import Link from 'next/link'
import Header from '@/components/Header'
import SiteInfo from '@/components/SiteInfo'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/products'
import { site } from '@/lib/site'
import styles from './page.module.css'

export const revalidate = 60

export default async function Home() {
  const products = await getProducts()
  return (
    <main>
      <Header overHero={!!site.heroImage} />

      <section
        className={site.heroImage ? `${styles.hero} ${styles.heroPhoto}` : styles.hero}
      >
        {site.heroImage && (
          <img
            src={site.heroImage}
            srcSet={`${site.heroImage} 1179w, ${site.heroImage.replace('.jpg', '@2x.jpg')} 2358w`}
            sizes="100vw"
            alt=""
            className={styles.heroImg}
            fetchPriority="high"
          />
        )}
        <div className={styles.heroShade} aria-hidden />
        <div className={styles.heroRam} aria-hidden>
          <img src="/ram.png" alt="" className={styles.ramWhite} width={1085} height={710} />
          <img src="/ram-dark.png" alt="" className={styles.ramBlack} width={1085} height={710} />
        </div>
        <div className={styles.heroCaption}>
          <h1 className={styles.heroTitle}>{site.heroTitle}</h1>
          <Link href="/#shop" className={styles.heroLink}>
            {site.heroLink}
          </Link>
        </div>
      </section>

      <section className={styles.intro}>
        <p className={styles.introText}>{site.introText}</p>
        <Link href="/#shop" className={styles.introLink}>
          {site.introLink}
        </Link>
      </section>

      <section id="shop" className={styles.shop}>
        <p className={styles.count}>
          {products.length} {products.length === 1 ? 'Product' : 'Products'}
        </p>
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <SiteInfo />

      <Footer />
    </main>
  )
}
