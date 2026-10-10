'use client'

import { useState } from 'react'
import Link from 'next/link'
import { site } from '@/lib/site'
import styles from './Header.module.css'

export default function Header({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className={styles.announcement}>{site.announcement}</div>
      <header className={overlay ? `${styles.header} ${styles.overlay}` : styles.header}>
        <button
          className={styles.iconBtn}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>

        <Link href="/" className={styles.logo}>{site.name}</Link>

        <a href="/#list" className={styles.iconBtn} aria-label="Join the list">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="3" y="5" width="18" height="14" rx="1" />
            <path d="M3.5 6l8.5 7 8.5-7" />
          </svg>
        </a>
      </header>

      {open && (
        <nav className={styles.menu} onClick={() => setOpen(false)}>
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
