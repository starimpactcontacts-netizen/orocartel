import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClearCart from '@/components/cart/ClearCart'
import { site } from '@/lib/site'
import styles from '../about/page.module.css'

export const metadata = { title: 'Thank you', robots: { index: false } }

export default function ThankYou() {
  return (
    <>
      <ClearCart />
      <Header />
      <main className={styles.main}>
        <h1 className={styles.h1}>Thank you.</h1>
        <p className={styles.lead}>Your order is in. A confirmation is on its way to your inbox.</p>
        <section className={styles.block}>
          <p>
            Questions about your order: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
