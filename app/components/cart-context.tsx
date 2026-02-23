'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ratratrat-cart-v1'

export type CartItem = {
  productId: string
  title: string
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  addItem: (productId: string, title: string, qty?: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return

      const valid = parsed
        .filter(
          (item: unknown): item is { productId: string; title?: unknown; qty: number } =>
            typeof item === 'object' &&
            item !== null &&
            'productId' in item &&
            'qty' in item &&
            typeof (item as { productId?: unknown }).productId === 'string' &&
            typeof (item as { qty?: unknown }).qty === 'number'
        )
        .map((item) => ({
          productId: item.productId,
          title:
            typeof item.title === 'string' && item.title.trim().length > 0
              ? item.title
              : 'Product',
          qty: item.qty,
        }))
      setItems(valid)
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(productId: string, title: string, qty = 1) {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.productId === productId)
      if (index === -1) {
        return [...prev, { productId, title, qty }]
      }

      const next = [...prev]
      next[index] = { ...next[index], title, qty: next[index].qty + qty }
      return next
    })
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  )

  return (
    <CartContext.Provider
      value={{ items, totalItems, addItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
