import Link from 'next/link'
import { site } from '@/lib/site'
import SignUp from './SignUp'
import styles from './SiteInfo.module.css'

function Chevron() {
  return (
    <svg className={styles.chev} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// Burberry-style closing block: sign up, then collapsible info sections.
export default function SiteInfo() {
  const socials = [
    site.instagram && { label: 'Instagram', href: site.instagram },
    site.tiktok && { label: 'TikTok', href: site.tiktok },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <section id="list" className={styles.wrap}>
      <h2 className={styles.title}>Sign Up</h2>
      <p className={styles.sub}>Early access to every drop, before the public.</p>
      <SignUp source="home" />

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
            <p>Orocartel is a menswear label from Sweden.</p>
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
