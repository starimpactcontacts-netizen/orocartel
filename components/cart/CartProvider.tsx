'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: string
  variantId: string
  slug: string
  name: string
  image: string
  price: number
  currency: string
  quantity: number
}

type Cart = {
  items: CartItem[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (o: boolean) => void
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  setQty: (variantId: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<Cart | null>(null)
const KEY = 'oro-cart-v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]')
      if (Array.isArray(saved)) setItems(saved)
    } catch {}
  }, [])

  const persist = useCallback((next: CartItem[]) => {
    setItems(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {}
  }, [])

  const add: Cart['add'] = (item, qty = 1) => {
    const existing = items.find((i) => i.variantId === item.variantId)
    persist(
      existing
        ? items.map((i) => (i.variantId === item.variantId ? { ...i, quantity: Math.min(i.quantity + qty, 10) } : i))
        : [...items, { ...item, quantity: qty }],
    )
    setOpen(true)
  }

  const setQty: Cart['setQty'] = (variantId, qty) =>
    persist(qty <= 0 ? items.filter((i) => i.variantId !== variantId) : items.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.min(qty, 10) } : i)))

  const value = useMemo<Cart>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.quantity * i.price, 0),
      open,
      setOpen,
      add,
      setQty,
      clear: () => persist([]),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, open],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const c = useContext(CartContext)
  if (!c) throw new Error('useCart must be used inside CartProvider')
  return c
}

export const formatKr = (n: number) =>
  `${n.toLocaleString('sv-SE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} kr`
