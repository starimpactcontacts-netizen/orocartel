import Link from 'next/link'
import { site } from '@/lib/site'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <img src="/greyhound.png" alt="" className={styles.mark} width={1477} height={462} />
      <img src="/wordmark.png" alt={site.name} className={styles.logo} width={657} height={85} />
      <nav className={styles.links}>
        {site.instagram && <a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a>}
        {site.tiktok && <a href={site.tiktok} target="_blank" rel="noreferrer">TikTok</a>}
        {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>Contact</a>}
        <Link href="/privacy">Privacy</Link>
      </nav>
      <span className={styles.copy}>© {new Date().getFullYear()}, {site.name}</span>
    </footer>
  )
}
