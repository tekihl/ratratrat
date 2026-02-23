import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sanityRead } from '@/lib/sanity'
import AddToCartButton from '@/app/components/AddToCartButton'

type Product = {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  price: number
  status: 'for_sale' | 'reserved' | 'sold'
  images?: Array<{ asset?: { url?: string } }>
}

async function getProduct(slug: string) {
  return sanityRead.fetch<Product | null>(
    `*[_type=="product" && slug.current==$slug][0]{
      _id,
      title,
      slug,
      description,
      price,
      status,
      images[]{asset->{url}}
    }`,
    { slug }
  )
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <p>
        <Link href="/">Back to shop</Link>
      </p>

      <article style={{ display: 'grid', gap: 24 }}>
        {product.images?.length ? (
          <div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              overflowY: 'hidden',
              width: '100%',
              maxWidth: '100%',
              paddingBottom: 8,
            }}
          >
            {product.images.map((image, index) =>
              image.asset?.url ? (
                <img
                  key={image.asset.url}
                  src={image.asset.url}
                  alt={`${product.title} image ${index + 1}`}
                  style={{
                    height: 520,
                    width: 'auto',
                    flex: '0 0 auto',
                  }}
                />
              ) : null
            )}
          </div>
        ) : null}

        <div>
          <h1>{product.title}</h1>
          <p style={{ fontWeight: 700 }}>{product.price} SEK</p>
          <p>Status: {product.status}</p>
          <AddToCartButton productId={product._id} productTitle={product.title} />
          {product.description ? <p>{product.description}</p> : null}
        </div>
      </article>
    </main>
  )
}
