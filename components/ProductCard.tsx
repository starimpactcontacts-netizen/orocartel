'use client'

import Link from 'next/link'
import type { Product } from '@/lib/products'
import { useCart } from './cart/CartProvider'
import styles from './ProductCard.module.css'

// Beauty-house tile: square grey field, label, uppercase name, one line, price, add to bag.
export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const href = `/products/${product.slug}`

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.media} aria-label={product.name}>
        {product.image && <img src={product.image} alt="" width={1200} height={1200} loading="lazy" />}
        {(product.badge || !product.inStock) && (
          <span className={styles.tag}>{product.inStock ? product.badge : 'Sold out'}</span>
        )}
      </Link>
      <div className={styles.body}>
        <Link href={href} className={styles.name}>
          {product.name}
        </Link>
        {product.tagline && <p className={styles.tagline}>{product.tagline}</p>}
        <p className={styles.price}>{product.formattedPrice}</p>
        {product.inStock ? (
          <button
            className={styles.add}
            onClick={() =>
              add({
                id: product.id,
                variantId: product.variantId,
                slug: product.slug,
                name: product.name,
                image: product.image,
                price: product.price,
                currency: product.currency,
              })
            }
          >
            Add to bag
          </button>
        ) : (
          <Link href={href} className={styles.add}>
            Notify me
          </Link>
        )}
      </div>
    </article>
  )
}
