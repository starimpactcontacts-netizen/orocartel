import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { site } from '@/lib/site'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: { absolute: 'About Orocartel' },
  description: 'Orocartel is a menswear label from Sweden.',
  openGraph: {
    title: 'About Orocartel',
    description: 'Orocartel is a menswear label from Sweden.',
  },
}

export default function About() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.h1}>About Orocartel</h1>

        <section className={styles.block}>
          <h2 className={styles.h2}>The name.</h2>
          <p>Oro is Spanish for gold. A cartel is a crew.</p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.h2}>The crest.</h2>
          <p>The ram is the golden fleece, the prize in the Greek myth.</p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.h2}>Contact.</h2>
          <p>
            Questions or orders: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
