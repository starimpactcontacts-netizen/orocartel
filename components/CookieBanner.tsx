'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { consent, saveConsent } from '@/lib/consent'
import styles from './CookieBanner.module.css'

export default function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!consent()) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener('oro:cookie-settings', reopen)
    return () => window.removeEventListener('oro:cookie-settings', reopen)
  }, [])

  if (!open) return null

  const choose = (analytics: boolean) => {
    saveConsent(analytics)
    setOpen(false)
  }

  return (
    <div className={styles.banner} role="dialog" aria-live="polite" aria-label="Cookie preferences">
      <p className={styles.title}>Cookies</p>
      <p className={styles.text}>
        We use essential cookies to run the store, keep your bag and process payments securely. With your OK we may also use
        analytics to improve the site. No advertising cookies. <Link href="/privacy#cookies">Read more</Link>
      </p>
      <div className={styles.actions}>
        <button className={styles.ghost} onClick={() => choose(false)}>
          Essential only
        </button>
        <button className={styles.solid} onClick={() => choose(true)}>
          Accept all
        </button>
      </div>
    </div>
  )
}
