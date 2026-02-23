import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { sanityWrite, sanityRead } from '@/lib/sanity'

export async function POST(req: Request) {
    const sig = (await headers()).get('stripe-signature')
    if (!sig) return new Response('Missing signature', { status: 400 })

    const rawBody = await req.text()

    let event
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch {
        return new Response('Invalid signature', { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const ids = (session.metadata?.productIds || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)

        const products = await sanityRead.fetch(
            `*[_type=="product" && _id in $ids]{_id, title, price}`,
            { ids }
        )

        await Promise.all(
            ids.map((id) =>
                sanityWrite.patch(id).set({ status: 'sold', reservedUntil: null }).commit()
            )
        )

        await sanityWrite.create({
            _type: 'order',
            stripeSessionId: session.id,
            stripePaymentIntentId: String(session.payment_intent || ''),
            email: session.customer_details?.email || '',
            amountTotal: (session.amount_total || 0) / 100,
            status: 'paid',
            items: products.map((p: any) => ({
                _key: p._id,
                productId: p._id,
                title: p.title,
                price: p.price,
                qty: 1,
            })),
        })
    }

    if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
        const session = event.data.object as any
        const ids = (session.metadata?.productIds || '').split(',').map((s: string) => s.trim()).filter(Boolean)

        await Promise.all(
            ids.map((id: string) =>
                sanityWrite.patch(id).set({ status: 'for_sale', reservedUntil: null }).commit()
            )
        )
    }

    return new Response('ok', { status: 200 })
}
