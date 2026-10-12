import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductGallery from '@/components/pdp/ProductGallery'
import ProductInfo from '@/components/pdp/ProductInfo'
import CloserLook from '@/components/pdp/CloserLook'
import BuyBar from '@/components/pdp/BuyBar'
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
        <Link href="/#shop" className={styles.back}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          All articles
        </Link>

        <div className={styles.top}>
          <ProductGallery images={product.images} label={product.label} name={product.name} />

          <div className={styles.summary}>
            <div className={styles.titleRow}>
              <h1 className={styles.name}>{product.name}</h1>
              <p className={styles.price}>{formatPrice(product.price)}</p>
            </div>
            {!product.inStock && <p className={styles.stock}>Sold out</p>}

            <p className={styles.color}>
              <span>Colour:</span> {product.color}
            </p>
            <div className={styles.swatch}>
              <img src={product.image} alt={product.color} width={960} height={1200} />
            </div>

            <ProductInfo product={product} />
          </div>
        </div>

        <CloserLook product={product} />
      </main>
      <Footer />
      <BuyBar product={product} />
    </>
  )
}
