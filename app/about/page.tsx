import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import { site } from '@/lib/site'
import { aboutFaq, aboutIntro, aboutSections } from '@/lib/about'
import styles from './page.module.css'

const title = 'About Orocartel: Men’s Makeup from Stockholm'
const description =
  'Orocartel is a men’s makeup store from Stockholm, Sweden. Makeup for men, starting with the CABRÓN Kohl Eye Pencil: creamy black kohl eyeliner for men.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/about' },
  openGraph: { title, description, url: `${site.url}/about` },
}

export default function About() {
  return (
    <>
      <Header />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: aboutFaq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <main className={styles.main}>
        <h1 className={styles.h1}>About</h1>
        <p className={styles.lead}>{aboutIntro}</p>

        {aboutSections.map((s) => (
          <section key={s.title} className={styles.block} lang={s.title === 'Smink för män' ? 'sv' : undefined}>
            <h2 className={styles.h2}>{s.title}</h2>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            {s.title === 'The CABRÓN Kohl Eye Pencil' && (
              <Link href="/products/cabron-kohl-eye-pencil" className={styles.cta}>
                Shop the CABRÓN Kohl
              </Link>
            )}
          </section>
        ))}

        <section className={styles.faq}>
          <h2 className={styles.h2}>Questions</h2>
          {aboutFaq.map((f) => (
            <details key={f.q} className={styles.qa}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>

        <section className={styles.block}>
          <h2 className={styles.h2}>Contact</h2>
          <p>
            Questions or orders: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
