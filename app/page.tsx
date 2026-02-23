import Link from 'next/link'
import { sanityRead } from '@/lib/sanity'
import AddToCartButton from '@/app/components/AddToCartButton'

type Product = {
  _id: string
  title: string
  slug: { current: string }
  price: number
  image?: { asset?: { url?: string } }
}

async function getProducts() {
  return sanityRead.fetch<Product[]>(
    `*[_type=="product" && status=="for_sale"] | order(_createdAt desc){
      _id,
      title,
      slug,
      price,
      image{asset->{url}}
    }`
  )
}

export default async function Page() {
  const products = await getProducts()

  return (
    <main style={{ padding: 24 }}>
      
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
        {products.map((p) => (
          <article key={p._id} className="p-0">
            {p.image?.asset?.url ? (
              <img src={p.image.asset.url} alt={p.title} style={{ width: '100%', height: 250, objectFit: 'cover' }} />
            ) : null}
            <h2>{p.title}</h2>
            <p>{p.price} SEK</p>
            <div className="flex flex-row gap-3 items-left">
              <Link href={`/product/${p.slug.current}`}>View</Link>
              
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
