import Link from 'next/link'
import Header from '@/components/Header'
import SiteInfo from '@/components/SiteInfo'
import Footer from '@/components/Footer'
import ProductRail from '@/components/ProductRail'
import { getProducts } from '@/lib/products'
import { site } from '@/lib/site'
import styles from './page.module.css'

export const revalidate = 60

// Shades of one line show as one tile; the base shade (shortest URL) represents it.
function onePerFamily(products: Awaited<ReturnType<typeof getProducts>>) {
  const best = new Map<string, (typeof products)[number]>()
  for (const p of products) {
    const key = p.shade?.family ?? p.slug
    const cur = best.get(key)
    if (!cur || p.slug.length < cur.slug.length) best.set(key, p)
  }
  return [...best.values()]
}

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
        <img src="/ram-dark.png" alt="" aria-hidden className={styles.heroRamCorner} width={1085} height={710} />
        <div className={styles.heroCaption}>
          {site.heroBadge && <p className={styles.heroBadge}>{site.heroBadge}</p>}
          <h1 className={styles.heroTitle}>{site.heroTitle}</h1>
          {site.heroText && <p className={styles.heroText}>{site.heroText}</p>}
          <Link href={site.heroHref} className={styles.heroLink}>
            {site.heroLink}
          </Link>
        </div>
      </section>

      {/* Campaign tiles: full-width photos, white caps bottom-left, optional ram. */}
      {site.features.map((f) => (
        <Link
          key={f.sources[0].src}
          href={f.href}
          className={`${styles.feature} ${f.shape === 'square' ? styles.featureSquare : ''}`}
          aria-label={f.title.length ? f.title.join(' ') : f.alt}
        >
          <img
            src={f.sources[f.sources.length - 1].src}
            srcSet={f.sources.map((s) => `${s.src} ${s.width}w`).join(', ')}
            sizes="100vw"
            width={f.width}
            height={f.height}
            alt={f.alt}
            className={styles.featureImg}
            loading="lazy"
          />
          {f.ram && (
            <img
              src={f.ram.tone === 'white' ? '/ram.png' : '/ram-dark.png'}
              alt=""
              aria-hidden
              className={`${styles.featureRam} ${f.ram.corner === 'left' ? styles.featureRamLeft : ''}`}
              width={1085}
              height={710}
            />
          )}
          {f.title.length > 0 && (
            <h2 className={styles.featureTitle}>
              {f.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          )}
        </Link>
      ))}

      <ProductRail title="Most wanted" products={onePerFamily(products)} />

      <SiteInfo />

      <Footer />
    </main>
  )
}
