'use client'

import { useEffect, useState } from 'react'
import styles from './WaitlistForm.module.css'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function WaitlistForm({ source = 'home' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [instagram, setInstagram] = useState('')
  const [size, setSize] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [error, setError] = useState('')
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/waitlist')
      .then((r) => r.json())
      .then((d) => setCount(typeof d.count === 'number' ? d.count : null))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, instagram, size, source }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'something went wrong, try again')
        setStatus('idle')
        return
      }
      setStatus('done')
      setCount((c) => (c === null ? c : c + 1))
    } catch {
      setError('something went wrong, try again')
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneTitle}>You&apos;re on the list</p>
        <p className={styles.doneSub}>Early access lands in your inbox before the public drop.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        placeholder="Email"
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        className={styles.input}
        disabled={status === 'loading'}
      />
      <input
        type="text"
        placeholder="Instagram (optional)"
        aria-label="Instagram handle (optional)"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        className={styles.input}
        disabled={status === 'loading'}
        maxLength={31}
      />
      <div className={styles.sizes} role="radiogroup" aria-label="Your size (optional)">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={size === s}
            className={size === s ? `${styles.size} ${styles.sizeOn}` : styles.size}
            onClick={() => setSize(size === s ? '' : s)}
            disabled={status === 'loading'}
          >
            {s}
          </button>
        ))}
      </div>
      <button type="submit" disabled={status === 'loading'} className={styles.button}>
        {status === 'loading' ? 'Joining…' : 'Join the list'}
      </button>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {count !== null && count > 0 && (
        <p className={styles.count}>{count.toLocaleString()} on the list</p>
      )}
    </form>
  )
}
