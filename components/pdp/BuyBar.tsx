'use client'

import { useEffect, useState } from 'react'
import SignUp from '@/components/SignUp'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/lib/products'
import styles from './BuyBar.module.css'

// Sticky bottom bar: price on the left, add to bag (or restock alert) on the right.
export default function BuyBar({ product }: { product: Product }) {
  const { add } = useCart()
  const [notify, setNotify] = useState(false)

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

  return (
    <>
      <div className={styles.bar}>
        <span className={styles.size}>{product.formattedPrice}</span>
        <button className={styles.main} onClick={product.inStock ? addToBag : () => setNotify(true)}>
          {product.inStock ? 'Add to bag' : 'Sold out · Notify me'}
        </button>
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
