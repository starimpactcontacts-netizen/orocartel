'use client'

import { useState } from 'react'
import { site } from '@/lib/site'
import type { Product } from '@/lib/products'
import styles from './ProductInfo.module.css'

function Plus() {
  return (
    <svg className={styles.plus} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export default function ProductInfo({ product }: { product: Product }) {
  const [more, setMore] = useState(false)
  const [sizeGuide, setSizeGuide] = useState(false)
  const [shared, setShared] = useState(false)
  const short = product.description.length > 60 && !more

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
      <div className={styles.links}>
        <button className={styles.link} onClick={() => setSizeGuide(!sizeGuide)} aria-expanded={sizeGuide}>
          Size guide
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 7a2 2 0 1 1 2 2c-1 0-2 .7-2 2v1M3 19l9-6 9 6H3z" />
          </svg>
        </button>
        <a className={styles.link} href={`mailto:${site.contactEmail}?subject=${encodeURIComponent('Sizing: ' + product.name)}`}>
          Find your size
        </a>
      </div>
      {sizeGuide && (
        <div className={styles.sizeGuide}>
          <p>Available sizes: {product.sizes.join(', ')}.</p>
          <p>Full measurements coming soon. Unsure between sizes? Email {site.contactEmail}.</p>
        </div>
      )}

      <section className={styles.block}>
        <h2 className={styles.h}>Info</h2>
        <p className={short ? `${styles.text} ${styles.clamp}` : styles.text}>{product.description}</p>
        <button className={styles.link} onClick={() => setMore(!more)}>
          {more ? 'Read less' : 'Read more'}
        </button>
      </section>

      <details className={styles.acc}>
        <summary>Fit and product details <Plus /></summary>
        <ul>{product.fit.map((f) => <li key={f}>{f}</li>)}</ul>
      </details>
      <details className={styles.acc}>
        <summary>Materials and care <Plus /></summary>
        <ul>{product.materials.map((m) => <li key={m}>{m}</li>)}</ul>
      </details>
      <details className={styles.acc}>
        <summary>Shipping, returns &amp; assistance <Plus /></summary>
        <ul>
          <li>Shipping and returns details: TBD</li>
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
