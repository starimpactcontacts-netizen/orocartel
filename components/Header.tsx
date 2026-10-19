'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { site } from '@/lib/site'
import { formatPrice, products } from '@/lib/products'
import styles from './Header.module.css'

const icon = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }

// `overHero`: start transparent with white marks over the hero photo, turn solid white once scrolled.
export default function Header({ overHero = false }: { overHero?: boolean }) {
  const [panel, setPanel] = useState<'menu' | 'search' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!overHero) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overHero])

  useEffect(() => {
    document.body.style.overflow = panel ? 'hidden' : ''
    if (panel === 'search') searchRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [panel])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products
  }, [query])

  const clear = overHero && !scrolled && !panel
  const toggle = (p: 'menu' | 'search') => setPanel(panel === p ? null : p)
  const close = () => setPanel(null)

  return (
    <>
      <header className={`${styles.header} ${overHero ? styles.fixed : ''} ${clear ? styles.clear : ''}`}>
        <div className={styles.side}>
          <button className={styles.iconBtn} aria-label={panel === 'menu' ? 'Close menu' : 'Open menu'} aria-expanded={panel === 'menu'} onClick={() => toggle('menu')}>
            {panel === 'menu' ? (
              <svg {...icon}><path d="M5 5l14 14M19 5L5 19" /></svg>
            ) : (
              <svg {...icon} strokeWidth={2}><path d="M3 9h18M3 15h12" /></svg>
            )}
          </button>
          <button className={styles.iconBtn} aria-label={panel === 'search' ? 'Close search' : 'Search'} aria-expanded={panel === 'search'} onClick={() => toggle('search')}>
            {panel === 'search' ? (
              <svg {...icon}><path d="M5 5l14 14M19 5L5 19" /></svg>
            ) : (
              <svg {...icon} strokeWidth={2}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
            )}
          </button>
        </div>

        <Link href="/" className={styles.logo} aria-label={site.name} onClick={close}>
          <img src={clear ? '/wordmark.png' : '/wordmark-dark.png'} alt={site.name} className={styles.word} width={659} height={87} />
        </Link>

        <div className={`${styles.side} ${styles.right}`}>
          <a href="/#list" className={styles.iconBtn} aria-label="Join the list" onClick={close}>
            <svg {...icon}><rect x="3" y="5.5" width="18" height="13" rx="1" /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" /></svg>
          </a>
          <a href="/#shop" className={styles.iconBtn} aria-label="Shop" onClick={close}>
            <svg {...icon}><path d="M5 8h14l-1.2 12H6.2L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
          </a>
        </div>
      </header>

      {panel === 'menu' && (
        <nav className={styles.panel} onClick={close}>
          <div className={styles.menuLinks}>
            <a href="/#shop">Shop</a>
            <a href="/#list">Join the list</a>
            <Link href="/about">About</Link>
            {site.instagram && <a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            {site.tiktok && <a href={site.tiktok} target="_blank" rel="noreferrer">TikTok</a>}
            {site.youtube && <a href={site.youtube} target="_blank" rel="noreferrer">YouTube</a>}
            {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>Contact</a>}
            <Link href="/privacy">Privacy</Link>
          </div>
        </nav>
      )}

      {panel === 'search' && (
        <div className={styles.panel}>
          <input
            ref={searchRef}
            className={styles.search}
            type="search"
            placeholder="Search"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.results}>
            {results.length === 0 && <p className={styles.empty}>No results for “{query}”</p>}
            {results.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className={styles.result} onClick={close}>
                <img src={p.image} alt="" width={960} height={1200} />
                <span>
                  {p.name}
                  <small>{p.inStock ? formatPrice(p.price) : `${formatPrice(p.price)} · Sold out`}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
