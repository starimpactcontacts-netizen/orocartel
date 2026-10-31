import Link from 'next/link'
import type { Product } from '@/lib/products'
import styles from './ShadePicker.module.css'

// Colour row like the beauty houses: current shade name, then a swatch per shade.
export default function ShadePicker({ product }: { product: Product }) {
  if (!product.shade) return null
  return (
    <div className={styles.wrap}>
      <p className={styles.label}>
        Colour: <span>{product.shade.name}</span>
      </p>
      <div className={styles.swatches}>
        {product.shades.map((s) => (
          <Link
            key={s.slug}
            href={`/products/${s.slug}`}
            aria-label={s.name}
            aria-current={s.slug === product.slug ? 'true' : undefined}
            className={`${styles.swatch} ${s.slug === product.slug ? styles.on : ''}`}
          >
            <span style={{ background: s.hex }} />
          </Link>
        ))}
      </div>
    </div>
  )
}
