'use client'

import { useState } from 'react'
import { useCart } from './cart-context'

export default function AddToCartButton({
  productId,
  productTitle,
}: {
  productId: string
  productTitle: string
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(productId, productTitle, 1)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <button onClick={handleAdd} type="button" className="native-button">
      {added ? 'Added' : 'Add to cart'}
    </button>
  )
}
