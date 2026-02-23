import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityRead, sanityWrite } from '@/lib/sanity'
import { stripe } from '@/lib/stripe'

type Product = {
    _id: string
    title: string
    price: number
    status: 'for_sale' | 'reserved' | 'sold'
}

const bodySchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        qty: z.number().int().positive().default(1),
    })).min(1),
})

export async function POST(req: Request) {
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

    const ids = [...new Set(parsed.data.items.map(i => i.productId))]
    const products = await sanityRead.fetch<Product[]>(
        `*[_type=="product" && _id in $ids]{
      _id, title, price, status
    }`,
        { ids }
    )

    const byId = new Map(products.map((p) => [p._id, p]))

    for (const item of parsed.data.items) {
        const p = byId.get(item.productId)
        if (!p || p.status !== 'for_sale') {
            return NextResponse.json({ error: `Product unavailable: ${item.productId}` }, { status: 409 })
        }
    }

    // Reserve items for 15 minutes
    const reserveUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    await Promise.all(
        ids.map((id) =>
            sanityWrite.patch(id).set({ status: 'reserved', reservedUntil: reserveUntil }).commit()
        )
    )

    const lineItems = parsed.data.items.map((item) => {
        const p = byId.get(item.productId)!
        return {
            quantity: item.qty,
            price_data: {
                currency: 'sek',
                unit_amount: Math.round(p.price * 100),
                product_data: { name: p.title },
            },
        }
    })

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
        metadata: { productIds: ids.join(',') },
    })

    return NextResponse.json({ url: session.url })
}
