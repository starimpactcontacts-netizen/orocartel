'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SignUp from '@/components/SignUp'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/lib/products'
import styles from './BuyBar.module.css'

// Sticky bottom bar: add to bag + quick buy (straight to Stripe for this one item), or a restock alert.
export default function BuyBar({ product }: { product: Product }) {
  const { add } = useCart()
  const [notify, setNotify] = useState(false)
  const [buying, setBuying] = useState(false)
  const router = useRouter()

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

  // Quick buy: straight to our checkout with just this item (the bag is left as is).
  function quickBuy() {
    setBuying(true)
    router.push(`/checkout?buy=${encodeURIComponent(product.id)}`)
  }

  return (
    <>
      <div className={styles.bar}>
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
