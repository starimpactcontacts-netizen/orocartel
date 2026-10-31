'use client'

import { useEffect } from 'react'
import { useCart } from './CartProvider'

// Empties the bag once the customer lands back from a completed Wix checkout.
export default function ClearCart() {
  const { clear } = useCart()
  useEffect(() => {
    clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
