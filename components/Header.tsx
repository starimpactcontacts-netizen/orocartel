'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { site } from '@/lib/site'
import { useCart } from '@/components/cart/CartProvider'
import styles from './Header.module.css'

type SearchItem = { slug: string; name: string; image: string; formattedPrice: string; inStock: boolean }

const icon = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }

// `overHero`: start transparent over the hero photo, turn solid white once scrolled.
// `tone`: marks colour while transparent: 'light' (white) for dark photos, 'dark' for light photos.
export default function Header({ overHero = false, tone = 'light' }: { overHero?: boolean; tone?: 'light' | 'dark' }) {
  const [panel, setPanel] = useState<'menu' | 'search' | 'account' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const cart = useCart()
  const [products, setProducts] = useState<SearchItem[] | null>(null)

  useEffect(() => {
    if (!overHero) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overHero])

  useEffect(() => {
    document.body.style.overflow = panel ? 'hidden' : ''
    if (panel === 'search') {
      searchRef.current?.focus()
      if (!products) fetch('/api/products').then((r) => r.json()).then(setProducts).catch(() => setProducts([]))
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [panel])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = products ?? []
    return q ? list.filter((p) => p.name.toLowerCase().includes(q)) : list
  }, [query, products])

  const clear = overHero && !scrolled && !panel
  const toggle = (p: 'menu' | 'search' | 'account') => setPanel(panel === p ? null : p)
  const close = () => setPanel(null)

  return (
    <>
      <header className={`${styles.header} ${overHero ? styles.fixed : ''} ${clear ? styles.clear : ''} ${clear && tone === 'light' ? styles.clearLight : ''}`}>
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
          <img src={clear && tone === 'light' ? '/wordmark.png' : '/wordmark-dark.png'} alt={site.name} className={styles.word} width={659} height={87} />
        </Link>

        <div className={`${styles.side} ${styles.right}`}>
          <button className={styles.iconBtn} aria-label="Account" aria-expanded={panel === 'account'} onClick={() => toggle('account')}>
            <svg {...icon}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5" /></svg>
          </button>
          <button
            className={styles.iconBtn}
            aria-label={cart.count ? `Bag, ${cart.count} item${cart.count === 1 ? '' : 's'}` : 'Bag'}
            onClick={() => {
              close()
              cart.setOpen(true)
            }}
          >
            <svg {...icon}><path d="M5 8h14l-1.2 12H6.2L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
            {cart.count > 0 && <span className={styles.badge}>{cart.count}</span>}
          </button>
        </div>
      </header>

      {panel === 'menu' && (
        <nav className={styles.panel} onClick={close}>
          <div className={styles.menuLinks}>
            <a href="/#shop">Shop</a>
            <a href="/#list">Join the list</a>
            <Link href="/about">About</Link>
            <Link href="/account">Account</Link>
            <Link href="/track">Track order</Link>
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
            {products && results.length === 0 && <p className={styles.empty}>{query ? `No results for “${query}”` : 'No products yet.'}</p>}
            {results.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className={styles.result} onClick={close}>
                <img src={p.image} alt="" width={960} height={1200} />
                <span>
                  {p.name}
                  <small>{p.inStock ? p.formattedPrice : `${p.formattedPrice} · Sold out`}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {panel === 'account' && (
        <div className={styles.sheetScrim} onClick={close}>
          <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="Account" onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHead}>
              <p className={styles.sheetTitle}>Account</p>
              <button className={styles.iconBtn} aria-label="Close" onClick={close}>
                <svg {...icon} strokeWidth={1.3} width={34} height={34}><path d="M5 5l14 14M19 5L5 19" /></svg>
              </button>
            </div>
            <Link href="/account" className={styles.sheetPrimary} onClick={close}>
              Sign in
            </Link>
            <div className={styles.sheetPair}>
              <Link href="/track" className={styles.sheetGhost} onClick={close}>
                <svg {...icon} width={20} height={20}><rect x="4" y="6" width="16" height="14" rx="1.5" /><path d="M8 6V4h8v2M8 13h8" /></svg>
                Track order
              </Link>
              <Link href="/account" className={styles.sheetGhost} onClick={close}>
                <svg {...icon} width={20} height={20}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5" /></svg>
                Orders
              </Link>
            </div>
            <a href={`mailto:${site.contactEmail}`} className={styles.sheetContact} onClick={close}>
              Need help? {site.contactEmail}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
