'use client'

import { useEffect, useState } from 'react'
import SignUp from '@/components/SignUp'
import type { Product } from '@/lib/products'
import styles from './BuyBar.module.css'

// Sticky bottom bar: size picker on the left, main action on the right.
export default function BuyBar({ product }: { product: Product }) {
  const [size, setSize] = useState('')
  const [sheet, setSheet] = useState<'size' | 'notify' | null>(null)

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sheet])

  return (
    <>
      <div className={styles.bar}>
        <button className={styles.size} onClick={() => setSheet('size')}>
          {size ? `Size ${size}` : 'Select a size'}
        </button>
        <button
          className={styles.main}
          onClick={() => (product.inStock ? setSheet(size ? null : 'size') : setSheet('notify'))}
        >
          {product.inStock ? 'Add to cart' : 'Sold out · Notify me'}
        </button>
      </div>

      {sheet && (
        <div className={styles.scrim} onClick={() => setSheet(null)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={styles.sheetHead}>
              <p>{sheet === 'size' ? 'Select a size' : 'Notify me when it’s back'}</p>
              <button aria-label="Close" onClick={() => setSheet(null)}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>

            {sheet === 'size' ? (
              <div className={styles.sizes}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={s === size ? `${styles.sizeOpt} ${styles.sizeOn}` : styles.sizeOpt}
                    onClick={() => {
                      setSize(s)
                      setSheet(product.inStock ? null : 'notify')
                    }}
                  >
                    <span>{s}</span>
                    {!product.inStock && <span className={styles.out}>Sold out</span>}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.notify}>
                <p className={styles.notifyText}>
                  {product.name}
                  {size ? `, size ${size}` : ''} is sold out. Leave your email and we’ll tell you first when it’s back.
                </p>
                <SignUp source={`restock:${product.slug}${size ? ':' + size : ''}`} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
