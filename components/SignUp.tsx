'use client'

import { useState } from 'react'
import styles from './SignUp.module.css'

// Minimal email-only signup: underlined field with an arrow submit.
export default function SignUp({ source = 'home' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'something went wrong, try again')
        setStatus('idle')
        return
      }
      setStatus('done')
    } catch {
      setError('something went wrong, try again')
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return <p className={styles.done}>Thank you. You&apos;re on the list.</p>
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <div className={styles.field}>
        <input
          type="email"
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className={styles.input}
        />
        <button type="submit" aria-label="Sign up" className={styles.submit} disabled={status === 'loading'}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </form>
  )
}
