'use client'

import { useState } from 'react'
import type { Product } from '@/lib/products'
import styles from './CloserLook.module.css'

export default function CloserLook({ product }: { product: Product }) {
  const [tab, setTab] = useState<'details' | 'features'>('features')
  const [open, setOpen] = useState<number | null>(null)
  const spot = open === null ? null : product.hotspots[open]

  return (
    <section className={styles.wrap}>
      <div className={styles.tabs} role="tablist">
        <button role="tab" aria-selected={tab === 'details'} className={tab === 'details' ? styles.tabOn : ''} onClick={() => setTab('details')}>
          Details
        </button>
        <button role="tab" aria-selected={tab === 'features'} className={tab === 'features' ? styles.tabOn : ''} onClick={() => setTab('features')}>
          Technical features
        </button>
      </div>

      {tab === 'features' ? (
        <div className={styles.panel}>
          <h2 className={styles.h}>A closer look</h2>
          <div className={styles.stage}>
            <img src={product.image} alt={product.name} width={960} height={1200} />
            {product.hotspots.map((h, i) => (
              <button
                key={h.title}
                className={open === i ? `${styles.dot} ${styles.dotOn}` : styles.dot}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                aria-label={h.title}
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            ))}
          </div>
          {spot ? (
            <div className={styles.note}>
              <p className={styles.noteTitle}>{spot.title}</p>
              <p>{spot.text}</p>
            </div>
          ) : (
            <p className={styles.hint}>Tap on + to explore product features</p>
          )}
        </div>
      ) : (
        <div className={styles.panel}>
          <h2 className={styles.h}>Details</h2>
          <ul className={styles.list}>
            {[...product.fit, ...product.materials].map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
      )}
    </section>
  )
}
