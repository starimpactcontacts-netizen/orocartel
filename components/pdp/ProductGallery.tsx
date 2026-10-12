'use client'

import { useRef, useState } from 'react'
import styles from './ProductGallery.module.css'

export default function ProductGallery({ images, label, name }: { images: string[]; label: string; name: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function onScroll() {
    const el = track.current
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  function go(i: number) {
    const el = track.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className={styles.gallery}>
      <p className={styles.label}>{label}</p>
      <div ref={track} className={styles.track} onScroll={onScroll}>
        {images.map((src, i) => (
          <div key={src + i} className={styles.slide}>
            <img src={src} alt={i === 0 ? name : `${name}, view ${i + 1}`} width={960} height={1200} />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button className={styles.next} aria-label="Next image" onClick={() => go((active + 1) % images.length)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className={styles.dashes}>
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Image ${i + 1}`}
                className={i === active ? `${styles.dash} ${styles.dashOn}` : styles.dash}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
