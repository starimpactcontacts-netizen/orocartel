'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/products'
import ProductCard from './ProductCard'
import ComingSoonCard from './ComingSoonCard'
import styles from './ProductRail.module.css'

// Swipeable product row with a "1/N" counter, like the beauty houses' homepage rails.
export default function ProductRail({ title, products }: { title: string; products: Product[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const total = products.length + 1 // + the sign-up tile

  const step = () => {
    const el = track.current
    const first = el?.firstElementChild as HTMLElement | null
    return first ? first.offsetWidth + parseFloat(getComputedStyle(el!).columnGap || '0') : 0
  }
  const onScroll = () => {
    const s = step()
    if (s && track.current) setIndex(Math.min(total - 1, Math.round(track.current.scrollLeft / s)))
  }
  const go = (d: number) => track.current?.scrollBy({ left: d * step(), behavior: 'smooth' })

  return (
    <section id="shop" className={styles.rail}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <Link href="/#shop" className={styles.all}>
            Shop all
          </Link>
        </div>
        {total > 1 && (
          <div className={`${styles.nav} ${total <= 4 ? styles.navPhoneOnly : ''}`}>
            <button aria-label="Previous" onClick={() => go(-1)} disabled={index === 0}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <span>
              {index + 1}/{total}
            </span>
            <button aria-label="Next" onClick={() => go(1)} disabled={index >= total - 1}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className={styles.track} ref={track} onScroll={onScroll}>
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
        <ComingSoonCard />
      </div>
    </section>
  )
}
