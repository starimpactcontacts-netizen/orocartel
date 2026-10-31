'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { loadStripe, type Appearance } from '@stripe/stripe-js'
import {
  AddressElement,
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { useCart, formatKr } from '@/components/cart/CartProvider'
import { STRIPE_PUBLISHABLE_KEY } from '@/lib/stripe-public'
import { SHIP_TO, shipping as shippingRule } from '@/lib/shipping'
import { site } from '@/lib/site'
import styles from './Checkout.module.css'

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY, { locale: 'auto' })

type Summary = {
  paymentIntentId: string
  clientSecret: string
  lines: { id: string; name: string; image: string; quantity: number; price: number }[]
  subtotal: number
  shipping: number
  total: number
}

// Stripe's secure fields, styled to match the store.
const appearance: Appearance = {
  theme: 'flat',
  variables: {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSizeBase: '16px',
    colorPrimary: '#121212',
    colorText: '#121212',
    colorTextSecondary: 'rgba(18,18,18,0.6)',
    colorBackground: '#ffffff',
    colorDanger: '#b00020',
    borderRadius: '0px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1px solid rgba(18,18,18,0.25)', boxShadow: 'none', padding: '14px' },
    '.Input:focus': { border: '1px solid #121212', boxShadow: 'none' },
    '.Label': { fontSize: '13px', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' },
    '.Tab': { border: '1px solid rgba(18,18,18,0.25)', boxShadow: 'none' },
    '.Tab--selected': { border: '1px solid #121212', boxShadow: 'none' },
  },
}

export default function Checkout() {
  const params = useSearchParams()
  const cart = useCart()
  const buy = params.get('buy') // Quick buy: one item, bag untouched
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState('')

  const request = useMemo(
    () =>
      buy
        ? [{ productId: buy, quantity: 1 }]
        : cart.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    [buy, cart.items],
  )
  const key = JSON.stringify(request)

  useEffect(() => {
    if (!request.length) return
    let cancelled = false
    setError('')
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: request, paymentIntentId: summary?.paymentIntentId }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(data.error || 'Checkout is unavailable right now.')
        if (!cancelled) setSummary(data)
      })
      .catch((e) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const empty = !request.length

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <Link href="/" aria-label={site.name} className={styles.logo}>
          <img src="/wordmark-dark.png" alt={site.name} width={659} height={87} />
        </Link>
        <p className={styles.secure}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <rect x="5" y="11" width="14" height="9" rx="1" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          Secure checkout
        </p>
      </header>

      {empty ? (
        <main className={styles.emptyWrap}>
          <h1 className={styles.h1}>Your bag is empty</h1>
          <Link href="/#shop" className={styles.link}>
            Continue shopping
          </Link>
        </main>
      ) : (
        <main className={styles.grid}>
          <section className={styles.formCol}>
            <h1 className={styles.h1}>Checkout</h1>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            {summary ? (
              <Elements stripe={stripePromise} options={{ clientSecret: summary.clientSecret, appearance}} key={summary.paymentIntentId}>
                <PayForm total={summary.total} paymentIntentId={summary.paymentIntentId} />
              </Elements>
            ) : (
              !error && <p className={styles.muted}>Loading secure checkout…</p>
            )}
          </section>

          <aside className={styles.summaryCol}>
            <h2 className={styles.h2}>Order summary</h2>
            {summary && (
              <>
                <ul className={styles.lines}>
                  {summary.lines.map((l) => (
                    <li key={l.id} className={styles.line}>
                      <span className={styles.thumb}>{l.image && <img src={l.image} alt="" width={120} height={120} />}</span>
                      <span className={styles.lineName}>
                        {l.name}
                        <small>Qty {l.quantity}</small>
                      </span>
                      <span>{formatKr(l.price * l.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <dl className={styles.totals}>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatKr(summary.subtotal)}</dd>
                  </div>
                  <div>
                    <dt>Shipping</dt>
                    <dd>{summary.shipping ? formatKr(summary.shipping) : 'Free'}</dd>
                  </div>
                  <div className={styles.total}>
                    <dt>Total</dt>
                    <dd>{formatKr(summary.total)}</dd>
                  </div>
                </dl>
                <p className={styles.note}>
                  VAT included. {summary.shipping ? `Free shipping from ${formatKr(shippingRule.freeFrom)}.` : ''}
                </p>
              </>
            )}
            {!buy && (
              <button className={styles.edit} onClick={() => cart.setOpen(true)}>
                Edit bag
              </button>
            )}
          </aside>
        </main>
      )}
    </div>
  )
}

function PayForm({ total, paymentIntentId }: { total: number; paymentIntentId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function pay(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setBusy(true)
    setError('')
    const address = await elements.getElement(AddressElement)?.getValue()
    if (!address?.complete) {
      setError('Please complete your delivery address.')
      setBusy(false)
      return
    }
    const a = address.value
    // Store the email on the order first, so it can be tracked and shown in the account.
    if (email) {
      await fetch('/api/checkout/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, email }),
      }).catch(() => {})
    }
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/thank-you`,
        receipt_email: email || undefined,
        shipping: {
          name: a.name,
          phone: a.phone,
          address: { ...a.address, line2: a.address.line2 ?? undefined },
        },
      },
    })
    // Only reached if the payment could not be completed (otherwise Stripe redirects).
    setError(error?.message || 'Payment failed. Please try again.')
    setBusy(false)
  }

  return (
    <form onSubmit={pay} className={styles.form}>
      <fieldset className={styles.step}>
        <legend className={styles.stepTitle}>1. Contact</legend>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </fieldset>

      <fieldset className={styles.step}>
        <legend className={styles.stepTitle}>2. Delivery</legend>
        <AddressElement
          options={{
            mode: 'shipping',
            allowedCountries: [...SHIP_TO],
            defaultValues: { address: { country: 'SE' } },
            fields: { phone: 'always' },
            validation: { phone: { required: 'always' } },
          }}
        />
        <p className={styles.muted}>
          Standard shipping {shippingRule.fee} kr, free from {shippingRule.freeFrom} kr. Tracking by email when your order ships.
        </p>
      </fieldset>

      <fieldset className={styles.step}>
        <legend className={styles.stepTitle}>3. Payment</legend>
        <PaymentElement options={{ layout: 'tabs' }} />
      </fieldset>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.pay} disabled={!stripe || busy}>
        {busy ? 'Processing…' : `Pay ${formatKr(total)}`}
      </button>

      <p className={styles.legal}>
        By placing your order you agree to our <Link href="/terms">Terms of sale</Link> and confirm you have read our{' '}
        <Link href="/privacy">Privacy policy</Link>. Payments are processed securely by Stripe; we never see or store your card details.
      </p>
    </form>
  )
}
