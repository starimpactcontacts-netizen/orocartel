'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Session } from '@supabase/supabase-js'
import { supabaseBrowser } from '@/lib/supabase-browser'
import OrderCard, { type OrderView } from './OrderCard'
import styles from './Account.module.css'

// Passwordless account: sign in with a one-time link or code sent to your email,
// then see every order placed with that email.
export default function AccountView() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sb = supabaseBrowser()
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!ready) return <main className={styles.main} />
  return session ? <SignedIn session={session} /> : <SignIn />
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabaseBrowser().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/account`, shouldCreateUser: true },
    })
    setBusy(false)
    if (error) setError('We couldn’t send the email right now. Please try again in a moment.')
    else setSent(true)
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabaseBrowser().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' })
    setBusy(false)
    if (error) setError('That code didn’t work. Check it or request a new one.')
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Account</h1>
      {!sent ? (
        <>
          <p className={styles.lead}>Sign in or create an account with your email. No password needed.</p>
          <form className={styles.form} onSubmit={send}>
            <label className={styles.label}>
              Email
              <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </label>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button className={styles.btn} disabled={busy}>
              {busy ? 'Sending…' : 'Continue'}
            </button>
          </form>
        </>
      ) : (
        <>
          <p className={styles.lead}>
            We sent a sign-in email to <strong>{email}</strong>. Tap the link in it, or enter the code below.
          </p>
          <form className={styles.form} onSubmit={verify}>
            <label className={styles.label}>
              Code
              <input
                className={styles.input}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </label>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button className={styles.btn} disabled={busy}>
              {busy ? 'Checking…' : 'Sign in'}
            </button>
            <button type="button" className={styles.ghost} onClick={() => setSent(false)}>
              Use another email
            </button>
          </form>
        </>
      )}
      <p className={`${styles.muted} ${styles.row}`}>
        <span>
          Just want to check an order? <Link href="/track" className={styles.link}>Track it with your order number</Link>.
        </span>
      </p>
    </main>
  )
}

function SignedIn({ session }: { session: Session }) {
  const [orders, setOrders] = useState<OrderView[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/account/orders', { headers: { Authorization: `Bearer ${session.access_token}` } })
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders ?? [])
        if (d.error) setError(d.error)
      })
      .catch(() => setError('Orders are unavailable right now.'))
  }, [session.access_token])

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Account</h1>
      <div className={styles.row}>
        <span className={styles.muted}>Signed in as {session.user.email}</span>
        <button className={styles.link} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }} onClick={() => supabaseBrowser().auth.signOut()}>
          Sign out
        </button>
      </div>

      <h2 style={{ marginTop: 40, fontSize: 22 }}>Orders</h2>
      {error && <p className={styles.error}>{error}</p>}
      {orders === null ? (
        <p className={styles.muted} style={{ marginTop: 16 }}>Loading your orders…</p>
      ) : orders.length === 0 ? (
        <p className={styles.muted} style={{ marginTop: 16 }}>
          No orders yet with this email. <Link href="/#shop" className={styles.link}>Start shopping</Link>
        </p>
      ) : (
        orders.map((o) => <OrderCard key={o.ref} order={o} />)
      )}
    </main>
  )
}
