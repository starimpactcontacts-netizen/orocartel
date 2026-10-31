import type { Product } from '@/lib/products'
import styles from './ProductDetails.module.css'

function Toggle() {
  return (
    <span className={styles.toggle} aria-hidden>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path className={styles.v} d="M12 3v18" />
        <path d="M3 12h18" />
      </svg>
    </span>
  )
}

// Beauty-house product info: a short summary, then collapsible sections.
// Plain <details> elements, so they work before any JavaScript loads.
export default function ProductDetails({ product }: { product: Product }) {
  return (
    <div className={styles.wrap}>
      {product.summary && (
        <section className={styles.summary}>
          <h2 className={styles.label}>Summary</h2>
          <p>{product.summary}</p>
        </section>
      )}

      {product.sections.map((s, i) => (
        <details key={s.title} className={styles.acc} open={i === 0}>
          <summary className={styles.label}>
            {s.title}
            <Toggle />
          </summary>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: s.html }} />
        </details>
      ))}
    </div>
  )
}
