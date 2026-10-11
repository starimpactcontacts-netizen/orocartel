import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaitlistForm from '@/components/WaitlistForm'
import { formatPrice, getProduct, products } from '@/lib/products'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [{ url: product.image, width: 960, height: 1200 }] },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug)
  if (!product) notFound()

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.media}>
          <img src={product.image} alt={product.name} width={960} height={1200} />
        </div>

        <div className={styles.info}>
          <p className={styles.brand}>OROCARTEL</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>
            {formatPrice(product.price)}
            {!product.inStock && <span className={styles.soldOut}>Sold out</span>}
          </p>

          <p className={styles.label}>Size</p>
          <div className={styles.sizes}>
            {product.sizes.map((s) => (
              <span key={s} className={product.inStock ? styles.size : `${styles.size} ${styles.sizeOff}`}>
                {s}
              </span>
            ))}
          </div>

          <button className={styles.buy} disabled={!product.inStock}>
            {product.inStock ? 'Add to cart' : 'Sold out'}
          </button>

          {product.description && <p className={styles.desc}>{product.description}</p>}

          {!product.inStock && (
            <div className={styles.notify}>
              <p className={styles.notifyTitle}>Get notified when it&apos;s back</p>
              <WaitlistForm source={`restock:${product.slug}`} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
