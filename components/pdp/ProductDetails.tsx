'use client'

import { useState } from 'react'
import { shipping } from '@/lib/shipping'
import { site } from '@/lib/site'
import type { Product } from '@/lib/products'
import styles from './ProductDetails.module.css'

function Plus() {
  return (
    <svg className={styles.plus} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export default function ProductDetails({ product }: { product: Product }) {
  const [shared, setShared] = useState(false)

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: product.name, url })
      else {
        await navigator.clipboard.writeText(url)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {}
  }

  return (
    <>
      {product.descriptionHtml && (
        <section className={styles.block}>
          <h2 className={styles.h}>Info</h2>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        </section>
      )}

      <details className={styles.acc}>
        <summary>Shipping, returns &amp; assistance <Plus /></summary>
        <ul>
          <li>
            Shipping {shipping.fee} kr, free on orders from {shipping.freeFrom} kr. VAT included.
          </li>
          <li>
            Questions or orders: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </li>
        </ul>
      </details>

      <div className={styles.actions}>
        <button className={styles.action} onClick={share}>
          <span className={styles.circle}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 15V3M7 8l5-5 5 5M5 13v7h14v-7" />
            </svg>
          </span>
          {shared ? 'Link copied' : 'Share'}
        </button>
      </div>
    </>
  )
}
