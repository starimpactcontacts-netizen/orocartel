import Link from 'next/link'
import { formatPrice, type Product } from '@/lib/products'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className={styles.card}>
      <div className={styles.media}>
        <img src={product.image} alt={product.name} width={960} height={1200} loading="lazy" />
        {!product.inStock && <span className={styles.badge}>Sold out</span>}
      </div>
      <p className={styles.name}>{product.name}</p>
      <p className={styles.price}>{formatPrice(product.price)}</p>
    </Link>
  )
}
