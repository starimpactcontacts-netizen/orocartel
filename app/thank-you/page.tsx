import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClearCart from '@/components/cart/ClearCart'
import { site } from '@/lib/site'
import { stripe, stripeConfigured } from '@/lib/stripe'
import { decodeLines } from '@/lib/order'
import { getProducts } from '@/lib/products'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Order confirmed', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ payment_intent?: string }> }

const kr = (n: number) => `${n.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} kr`

async function loadOrder(id?: string) {
  if (!id?.startsWith('pi_') || !stripeConfigured()) return null
  try {
    const pi = await stripe().paymentIntents.retrieve(id)
    if (pi.metadata?.store !== 'orocartel') return null
    const products = await getProducts()
    return {
      status: pi.status,
      ref: pi.metadata.ref ?? pi.id.slice(-8).toUpperCase(),
      email: pi.receipt_email,
      ship: pi.shipping,
      total: pi.amount / 100,
      shipping: Number(pi.metadata.shipping ?? 0),
      lines: decodeLines(pi.metadata.items ?? '').map((l) => ({
        ...l,
        name: products.find((p) => p.id === l.productId)?.name ?? 'Orocartel product',
      })),
    }
  } catch {
    return null
  }
}

export default async function ThankYou({ searchParams }: Props) {
  const order = await loadOrder((await searchParams).payment_intent)
  const paid = !order || order.status === 'succeeded' || order.status === 'processing'

  return (
    <>
      {paid && <ClearCart />}
      <Header />
      <main className={styles.main}>
        {paid ? (
          <>
            <h1 className={styles.h1}>Thank you</h1>
            <p className={styles.lead}>
              {order?.status === 'processing'
                ? 'Your payment is being processed. We will email you as soon as it is confirmed.'
                : 'Your order is confirmed. A receipt is on its way to your inbox, and you will get tracking by email when it ships.'}
            </p>

            {order && (
              <section className={styles.card}>
                <p className={styles.ref}>
                  Order <strong>#{order.ref}</strong>
                </p>
                <p className={styles.small}>Keep this number to track your order.</p>
                <ul className={styles.lines}>
                  {order.lines.map((l) => (
                    <li key={l.productId}>
                      <span>
                        {l.name} × {l.quantity}
                      </span>
                      <span>{kr(l.unitPrice * l.quantity)}</span>
                    </li>
                  ))}
                  <li>
                    <span>Shipping</span>
                    <span>{order.shipping ? kr(order.shipping) : 'Free'}</span>
                  </li>
                  <li className={styles.total}>
                    <span>Total paid</span>
                    <span>{kr(order.total)}</span>
                  </li>
                </ul>
                {order.ship?.address && (
                  <div className={styles.addr}>
                    <p className={styles.small}>Delivering to</p>
                    <p>
                      {order.ship.name}
                      <br />
                      {order.ship.address.line1}
                      {order.ship.address.line2 ? `, ${order.ship.address.line2}` : ''}
                      <br />
                      {order.ship.address.postal_code} {order.ship.address.city}, {order.ship.address.country}
                    </p>
                  </div>
                )}
                {order.email && <p className={styles.small}>Receipt sent to {order.email}</p>}
                <Link href={`/track?order=${order.ref}`} className={styles.link}>
                  Track this order
                </Link>
              </section>
            )}
          </>
        ) : (
          <>
            <h1 className={styles.h1}>Payment not completed</h1>
            <p className={styles.lead}>Your payment did not go through and you have not been charged. Your bag is saved.</p>
            <Link href="/checkout" className={styles.link}>
              Back to checkout
            </Link>
          </>
        )}

        <p className={styles.help}>
          Questions about your order? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          {order ? ` with your order number #${order.ref}.` : '.'}
        </p>
      </main>
      <Footer />
    </>
  )
}
