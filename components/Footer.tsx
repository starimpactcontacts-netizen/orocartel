import Link from 'next/link'
import { site } from '@/lib/site'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.logo}>{site.name}</span>
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
