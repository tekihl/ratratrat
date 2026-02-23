'use client'

import Link from 'next/link'
import { useCart } from './cart-context'

export default function Header() {
  const { totalItems } = useCart()

  return (

    <div className="border-b">
      <div className="flex flex-row justify-between px-10 py-5">
        <Link href="/" className="logo-link" aria-label="Go to home page">
          <span className="font-serif text-3xl">R(at) r(at) r(at)</span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/">Shop</Link>
          <Link href="/cart" className="cart-link">
            Cart
            <span className="cart-count" aria-label={`${totalItems} items in cart`}>
              {totalItems}
            </span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
