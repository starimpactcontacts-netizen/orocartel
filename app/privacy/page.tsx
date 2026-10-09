import Link from 'next/link'
import Footer from '@/components/Footer'
import { site } from '@/lib/site'
import styles from './page.module.css'

export const metadata = { title: 'Privacy' }

export default function Privacy() {
  return (
    <>
      <main className={styles.main}>
        <Link href="/" className={styles.back}>← Back</Link>
        <h1 className={styles.h1}>Privacy</h1>
        <p>
          When you join the {site.name} list we store your email address and, if you choose to give
          them, your Instagram handle and size. We use this only to tell you about drops and give you
          early access.
        </p>
        <p>We don&apos;t sell or share your information with third parties for their marketing.</p>
        <p>
          Want off the list or your data deleted?{' '}
          {site.contactEmail ? (
            <>Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></>
          ) : (
            <>Reach out to us on our socials</>
          )}{' '}
          and we&apos;ll remove it.
        </p>
      </main>
      <Footer />
    </>
  )
}
