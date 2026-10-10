'use client'

import { useRef, useState } from 'react'
import { collections } from '@/lib/site'
import styles from './Collections.module.css'

export default function Collections() {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function onScroll() {
    const el = track.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    if (!card) return
    const step = card.offsetWidth + 16
    setActive(Math.min(collections.length - 1, Math.round(el.scrollLeft / step)))
  }

  function goTo(i: number) {
    const el = track.current
    const card = el?.children[i] as HTMLElement | undefined
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.offsetWidth - card.offsetWidth) / 2, behavior: 'smooth' })
  }

  return (
    <section id="collections" className={styles.section}>
      <h2 className={styles.h2}>Collections</h2>
      <div ref={track} className={styles.track} onScroll={onScroll}>
        {collections.map((c, i) => (
          <div key={c.name} className={styles.card}>
            <div className={i === active ? `${styles.frame} ${styles.frameOn}` : styles.frame}>
              <div
                className={styles.img}
                style={c.image ? { backgroundImage: `url(${c.image})` } : undefined}
              >
                {!c.image && <span className={styles.soon}>Coming soon</span>}
              </div>
            </div>
            <p className={styles.name}>{c.name}</p>
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {collections.map((c, i) => (
          <button
            key={c.name}
            aria-label={`Show ${c.name}`}
            className={i === active ? `${styles.dot} ${styles.dotOn}` : styles.dot}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  )
}
