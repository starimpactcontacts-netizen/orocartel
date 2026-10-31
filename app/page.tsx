import Link from 'next/link'
import Header from '@/components/Header'
import SiteInfo from '@/components/SiteInfo'
import Footer from '@/components/Footer'
import ProductRail from '@/components/ProductRail'
import { getProducts } from '@/lib/products'
import { site } from '@/lib/site'
import styles from './page.module.css'

export const revalidate = 60

export default async function Home() {
  const products = await getProducts()
  return (
    <main>
      <Header overHero tone="dark" />

      {/* Full-bleed campaign photo, no overlay; centred white copy like the beauty houses. */}
      <section className={styles.hero}>
        <img
          src={site.hero.sources[site.hero.sources.length - 1].src}
          srcSet={site.hero.sources.map((s) => `${s.src} ${s.width}w`).join(', ')}
          sizes="100vw"
          width={site.hero.width}
          height={site.hero.height}
          alt={site.hero.alt}
          className={styles.heroImg}
          fetchPriority="high"
        />
        <div className={styles.heroCaption}>
          {site.heroBadge && <p className={styles.heroBadge}>{site.heroBadge}</p>}
          <h1 className={styles.heroTitle}>{site.heroTitle}</h1>
          {site.heroText && <p className={styles.heroText}>{site.heroText}</p>}
          <Link href={site.heroHref} className={styles.heroLink}>
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

      <ProductRail title="Most wanted" products={products} />

      <SiteInfo />

      <Footer />
    </main>
  )
}
