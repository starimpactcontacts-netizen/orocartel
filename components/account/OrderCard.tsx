import styles from './Account.module.css'

export type OrderView = {
  ref: string
  placedAt: string
  stage: 'payment' | 'confirmed' | 'production' | 'shipped'
  lines: { name: string; quantity: number; total: number }[]
  shipping: number
  discount: number
  total: number
  shipTo: string | null
  tracking: { number?: string; carrier?: string; url?: string }[]
}

const steps: { key: OrderView['stage']; label: string }[] = [
  { key: 'confirmed', label: 'Order confirmed' },
  { key: 'production', label: 'Being made' },
  { key: 'shipped', label: 'Shipped' },
]

const kr = (n: number) => `${n.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} kr`

export default function OrderCard({ order }: { order: OrderView }) {
  const reached = order.stage === 'payment' ? -1 : steps.findIndex((s) => s.key === order.stage)
  return (
    <article className={styles.order}>
      <div className={styles.orderHead}>
        <p>
          Order <strong>#{order.ref}</strong>
        </p>
        <p className={styles.muted}>{new Date(order.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>

      {order.stage === 'payment' ? (
        <p className={styles.muted}>Payment is being processed.</p>
      ) : (
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.key} className={i <= reached ? styles.done : ''}>
              <span className={styles.dot} />
              {s.label}
            </li>
          ))}
        </ol>
      )}

      {order.tracking.length > 0 && (
        <div className={styles.tracking}>
          {order.tracking.map((t, i) => (
            <p key={i}>
              {t.carrier ? `${t.carrier} ` : ''}
              {t.url ? (
                <a href={t.url} target="_blank" rel="noreferrer">
                  Track parcel{t.number ? ` ${t.number}` : ''}
                </a>
              ) : (
                t.number
              )}
            </p>
          ))}
        </div>
      )}

      <ul className={styles.lines}>
        {order.lines.map((l, i) => (
          <li key={i}>
            <span>
              {l.name} × {l.quantity}
            </span>
            <span>{kr(l.total)}</span>
          </li>
        ))}
        {order.discount > 0 && (
          <li>
            <span>Discount</span>
            <span>−{kr(order.discount)}</span>
          </li>
        )}
        <li>
          <span>Shipping</span>
          <span>{order.shipping ? kr(order.shipping) : 'Free'}</span>
        </li>
        <li className={styles.total}>
          <span>Total</span>
          <span>{kr(order.total)}</span>
        </li>
      </ul>
      {order.shipTo && <p className={styles.muted}>Delivering to {order.shipTo}</p>}
    </article>
  )
}
