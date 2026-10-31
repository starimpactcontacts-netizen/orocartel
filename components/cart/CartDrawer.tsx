'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatKr, useCart } from './CartProvider'
import { shipping, shippingFor } from '@/lib/shipping'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { items, subtotal, open, setOpen, setQty } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  async function checkout() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ productId: i.id, variantId: i.variantId, quantity: i.quantity })) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout is unavailable right now.')
      window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout is unavailable right now.')
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className={styles.scrim} onClick={() => setOpen(false)}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Bag">
        <div className={styles.head}>
          <p>Bag{items.length ? ` (${items.reduce((n, i) => n + i.quantity, 0)})` : ''}</p>
          <button aria-label="Close bag" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your bag is empty.</p>
            <Link href="/#shop" onClick={() => setOpen(false)} className={styles.link}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((i) => (
                <li key={i.variantId} className={styles.item}>
                  <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} className={styles.thumb}>
                    {i.image && <img src={i.image} alt="" width={160} height={200} />}
                  </Link>
                  <div className={styles.info}>
                    <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} className={styles.name}>
                      {i.name}
                    </Link>
                    <p className={styles.price}>{formatKr(i.price * i.quantity)}</p>
                    <div className={styles.qty}>
                      <button aria-label="Decrease quantity" onClick={() => setQty(i.variantId, i.quantity - 1)}>−</button>
                      <span>{i.quantity}</span>
                      <button aria-label="Increase quantity" onClick={() => setQty(i.variantId, i.quantity + 1)}>+</button>
                      <button className={styles.remove} onClick={() => setQty(i.variantId, 0)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.foot}>
              <div className={styles.row}>
                <span>Subtotal</span>
                <span>{formatKr(subtotal)}</span>
              </div>
              <div className={styles.row}>
                <span>Shipping</span>
                <span>{shippingFor(subtotal) ? formatKr(shippingFor(subtotal)) : 'Free'}</span>
              </div>
              <div className={styles.row}>
                <span>Total</span>
                <span>{formatKr(subtotal + shippingFor(subtotal))}</span>
              </div>
              <p className={styles.note}>
                {shippingFor(subtotal)
                  ? `Free shipping from ${formatKr(shipping.freeFrom)}. VAT included.`
                  : 'VAT included.'}
              </p>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <button className={styles.checkout} onClick={checkout} disabled={loading}>
                {loading ? 'Opening checkout…' : 'Checkout'}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
