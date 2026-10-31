import Link from 'next/link'
import { site } from '@/lib/site'
import { aboutShort } from '@/lib/about'
import styles from './SiteInfo.module.css'

function Chevron() {
  return (
    <svg className={styles.chev} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// Closing block: collapsible info sections (sign-up lives in the product rail).
export default function SiteInfo() {
  const socials = [
    site.instagram && { label: 'Instagram', href: site.instagram },
    site.tiktok && { label: 'TikTok', href: site.tiktok },
    site.youtube && { label: 'YouTube', href: site.youtube },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <section className={styles.wrap}>
      <div className={styles.about}>
        <h2 className={styles.aboutTitle}>About</h2>
        {aboutShort.map((p) => (
          <p key={p.slice(0, 24)} className={styles.aboutText}>
            {p}
          </p>
        ))}
        <Link href="/about" className={styles.aboutLink}>
          Read more
        </Link>
      </div>

      <div className={styles.list}>
        <details className={styles.item}>
          <summary>Customer Support <Chevron /></summary>
          <div className={styles.body}>
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`}>Questions or orders: {site.contactEmail}</a>
            )}
            <p>Sold out? Get a restock alert from the product page.</p>
          </div>
        </details>

        <details className={styles.item}>
          <summary>About Orocartel <Chevron /></summary>
          <div className={styles.body}>
            <p>Orocartel is a men’s makeup store from Sweden.</p>
            <p>Oro is Spanish for gold. A cartel is a crew.</p>
            <Link href="/about">About Orocartel</Link>
          </div>
        </details>

        {socials.length > 0 && (
          <details className={styles.item}>
            <summary>Follow {site.name} <Chevron /></summary>
            <div className={styles.body}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
              ))}
            </div>
          </details>
        )}

        <details className={styles.item}>
          <summary>Legal &amp; Privacy <Chevron /></summary>
          <div className={styles.body}>
            <Link href="/privacy">Privacy policy</Link>
          </div>
        </details>
      </div>
    </section>
  )
}
