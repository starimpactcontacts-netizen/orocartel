'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { site } from '@/lib/site'
import styles from './Header.module.css'

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label={site.name} onClick={() => setOpen(false)}>
          <img src="/wordmark-dark.png" alt={site.name} className={styles.word} width={659} height={87} />
        </Link>

        <div className={styles.actions}>
          <a href="/#list" className={styles.iconBtn} aria-label="Join the list" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="1" />
              <path d="M3.5 6l8.5 7 8.5-7" />
            </svg>
          </a>
          <button
            className={styles.iconBtn}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 7h20M2 17h20" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {open && (
        <nav className={styles.menu} onClick={() => setOpen(false)}>
          <a href="/#shop">Shop</a>
          <a href="/#collections">Collections</a>
          <a href="/#list">Join the list</a>
          {site.instagram && <a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a>}
          {site.tiktok && <a href={site.tiktok} target="_blank" rel="noreferrer">TikTok</a>}
          {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>Contact</a>}
          <Link href="/privacy">Privacy</Link>
        </nav>
      )}
    </>
  )
}
