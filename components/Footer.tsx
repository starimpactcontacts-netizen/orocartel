import Link from 'next/link'
import { site } from '@/lib/site'
import Logo from './Logo'
import Socials from './Socials'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Logo size={180} />
      <Socials className={styles.icons} size={26} />
      <nav className={styles.links}>
        <Link href="/about">About</Link>
        <Link href="/track">Track order</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
      <span className={styles.copy}>© {new Date().getFullYear()}, {site.name}</span>
    </footer>
  )
}
