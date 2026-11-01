'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import OrderCard, { type OrderView } from './OrderCard'
import styles from './Account.module.css'

export default function TrackOrder() {
  const params = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(params.get('order') ?? '')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<OrderView | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Track order</h1>
      <p className={styles.lead}>Enter the order number from your confirmation and the email you ordered with.</p>

      <form className={styles.form} onSubmit={submit}>
        <label className={styles.label}>
          Order number
          <input
            className={styles.input}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. 7KQ2M9XA"
            autoCapitalize="characters"
            autoComplete="off"
            required
          />
        </label>
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <button className={styles.btn} disabled={busy}>
          {busy ? 'Looking up…' : 'Track order'}
        </button>
      </form>

      {order && <OrderCard order={order} />}

    </main>
  )
}
