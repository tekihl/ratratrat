'use client'

import Link from 'next/link'
import { useCart } from '../components/cart-context'

export default function CartPage() {
  const { items, totalItems, removeItem, clearCart } = useCart()

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Cart</h1>
      <p>Total items: {totalItems}</p>

      {items.length === 0 ? (
        <p>
          Your cart is empty. <Link href="/">Continue shopping</Link>
        </p>
      ) : (
        <>
          <ul style={{ display: 'grid', gap: 10, padding: 0, listStyle: 'none' }}>
            {items.map((item) => (
              <li
                key={item.productId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #ddd',
                  padding: 12,
                }}
              >
                <span>{item.title}</span>
                <span>Qty: {item.qty}</span>
                <button onClick={() => removeItem(item.productId)}>Remove</button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 16 }}>
            <button onClick={clearCart}>Clear cart</button>
          </div>
        </>
      )}
    </main>
  )
}
