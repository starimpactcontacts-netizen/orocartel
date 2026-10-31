'use client'

import { useEffect, useState } from 'react'
import SignUp from '@/components/SignUp'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/lib/products'
import styles from './BuyBar.module.css'

// Sticky bottom bar: add to bag + quick buy (straight to Stripe for this one item), or a restock alert.
export default function BuyBar({ product }: { product: Product }) {
  const { add } = useCart()
  const [notify, setNotify] = useState(false)
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.style.overflow = notify ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [notify])

  function addToBag() {
    add({
      id: product.id,
      variantId: product.variantId,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      currency: product.currency,
    })
  }

  async function quickBuy() {
    setError('')
    setBuying(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ productId: product.id, variantId: product.variantId, quantity: 1 }] }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout is unavailable right now.')
      window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout is unavailable right now.')
      setBuying(false)
    }
  }

  return (
    <>
      <div className={styles.bar}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {product.inStock ? (
          <div className={styles.pair}>
            <button className={styles.ghost} onClick={addToBag}>
              Add to bag
            </button>
            <button className={styles.main} onClick={quickBuy} disabled={buying}>
              {buying ? 'Opening…' : 'Quick buy'}
            </button>
          </div>
        ) : (
          <button className={styles.main} onClick={() => setNotify(true)}>
            Sold out: notify me
          </button>
        )}
      </div>

      {notify && (
        <div className={styles.scrim} onClick={() => setNotify(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={styles.sheetHead}>
              <p>Notify me when it’s back</p>
              <button aria-label="Close" onClick={() => setNotify(false)}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>
            <p className={styles.notifyText}>
              {product.name} is sold out. Leave your email and we’ll tell you first when it’s back.
            </p>
            <SignUp source={`restock:${product.slug}`} />
          </div>
        </div>
      )}
    </>
  )
}
