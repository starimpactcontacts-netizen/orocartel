import Header from '@/components/Header'
import SiteInfo from '@/components/SiteInfo'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { products } from '@/lib/products'
import { site } from '@/lib/site'
import styles from './page.module.css'

export default function Home() {
  return (
    <main>
      <Header overHero={!!site.heroImage} />

      <section
        className={site.heroImage ? `${styles.hero} ${styles.heroPhoto}` : styles.hero}
      >
        {site.heroImage && (
          <img src={site.heroImage} alt="" className={styles.heroImg} fetchPriority="high" />
        )}
        <div className={styles.heroShade} aria-hidden />
        <img src="/ram.png" alt="" className={styles.heroRam} width={1085} height={710} />
      </section>

      <section id="shop" className={styles.shop}>
        <h2 className={styles.h2}>Shop</h2>
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
