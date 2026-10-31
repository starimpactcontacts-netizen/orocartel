import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductGallery from '@/components/pdp/ProductGallery'
import ProductDetails from '@/components/pdp/ProductDetails'
import BuyBar from '@/components/pdp/BuyBar'
import ShadePicker from '@/components/pdp/ShadePicker'
import JsonLd from '@/components/JsonLd'
import { site } from '@/lib/site'
import { getProduct, getProducts } from '@/lib/products'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug)
  if (!product) return {}
  const description = `${product.summary ?? product.name} Men’s makeup from Orocartel, ${product.formattedPrice}.`
  return {
    title: `${product.name}: Kohl Eyeliner for Men`,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { images: product.image ? [{ url: product.image, width: 1200, height: 1200 }] : [] },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug)
  if (!product) notFound()

  return (
    <>
      <Header />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.summary,
          image: product.images.map((src) => new URL(src, site.url).toString()),
          brand: { '@type': 'Brand', name: site.name },
          category: 'Men’s makeup > Eyeliner',
          offers: {
            '@type': 'Offer',
            url: `${site.url}/products/${product.slug}`,
            priceCurrency: 'SEK',
            price: product.price.toFixed(2),
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@id': `${site.url}/#org` },
          },
        }}
      />
      <main className={styles.main}>
        <Link href="/#shop" className={styles.back}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          All products
        </Link>

        <div className={styles.top}>
          <ProductGallery slides={product.slides} name={product.name} />

          <div className={styles.summary}>
            <div className={styles.titleRow}>
              <h1 className={styles.name}>{product.name}</h1>
              <p className={styles.price}>{product.formattedPrice}</p>
            </div>
            <p className={styles.stock}>{product.inStock ? 'In stock' : 'Sold out'}</p>
            <ShadePicker product={product} />

            <ProductDetails product={product} />
          </div>
        </div>
      </main>
      <Footer />
      <BuyBar product={product} />
    </>
  )
}
