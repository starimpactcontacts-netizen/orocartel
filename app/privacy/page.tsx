import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CompanyInfo from '@/components/CompanyInfo'
import CookieSettingsLink from '@/components/CookieSettingsLink'
import { site } from '@/lib/site'
import styles from '@/components/Legal.module.css'

export const metadata: Metadata = {
  title: 'Privacy & cookies',
  description: 'How Orocartel collects, uses and protects your personal data, and which cookies we use.',
  alternates: { canonical: '/privacy' },
}

export default function Privacy() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.h1}>Privacy &amp; cookies</h1>
        <p className={styles.updated}>Last updated 1 November 2026</p>

        <section>
          <h2>Who we are</h2>
          <p>
            This policy explains how {site.name} handles your personal data when you visit orocartel.com, place an order
            or sign up for updates. We are the data controller and follow the EU General Data Protection Regulation (GDPR).
          </p>
          <CompanyInfo />
        </section>

        <section>
          <h2>What we collect and why</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Why</th>
                <th>Legal basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name, email, phone, delivery and billing address, order contents</td>
                <td>To process, ship and support your order, and send your receipt and tracking</td>
                <td>Contract</td>
              </tr>
              <tr>
                <td>Payment details</td>
                <td>To take payment. Card details go straight to Stripe; we never see or store them</td>
                <td>Contract</td>
              </tr>
              <tr>
                <td>Order and payment records</td>
                <td>Bookkeeping, as required by Swedish law</td>
                <td>Legal obligation</td>
              </tr>
              <tr>
                <td>Email address (sign-up)</td>
                <td>To tell you about new products and drops</td>
                <td>Consent</td>
              </tr>
              <tr>
                <td>Messages you send us</td>
                <td>To answer your questions</td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Technical data (IP address, device, browser)</td>
                <td>To keep the site and payments secure and prevent fraud</td>
                <td>Legitimate interest</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Who we share it with</h2>
          <p>We only share what each partner needs to do their job, and we never sell your data.</p>
          <ul>
            <li>
              <strong>Stripe</strong>: payment processing and fraud prevention.
            </li>
            <li>
              <strong>Wix</strong>: our order management system.
            </li>
            <li>
              <strong>Blanka</strong>: our production partner, which makes and ships your order from North America.
            </li>
            <li>
              <strong>Vercel</strong>: website hosting.
            </li>
            <li>
              <strong>Supabase</strong>: storage for the email sign-up list.
            </li>
            <li>Postal and courier services: delivery of your parcel.</li>
          </ul>
          <p>
            Some of these partners process data outside the EU/EEA (for example in the United States or Canada). When they
            do, the transfer is covered by an EU adequacy decision (such as the EU–US Data Privacy Framework or the decision
            for Canada) or by the EU Standard Contractual Clauses.
          </p>
        </section>

        <section>
          <h2>How long we keep it</h2>
          <ul>
            <li>Order and payment records: 7 years, as required by the Swedish Bookkeeping Act (bokföringslagen).</li>
            <li>Sign-up email: until you unsubscribe or ask us to delete it.</li>
            <li>Support emails: up to 2 years after the matter is closed.</li>
          </ul>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>
            You can ask for a copy of your data, have it corrected or deleted, restrict or object to how we use it, take it
            with you (data portability), and withdraw consent at any time. Email{' '}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> and we will reply within one month. Every
            update email has a way to unsubscribe.
          </p>
          <p>
            If you think we handle your data wrongly, you can complain to the Swedish Authority for Privacy Protection
            (Integritetsskyddsmyndigheten, <a href="https://www.imy.se" target="_blank" rel="noreferrer">imy.se</a>).
          </p>
        </section>

        <section id="cookies">
          <h2>Cookies</h2>
          <p>
            Cookies and similar storage are small files saved in your browser. We only use what the store needs to work. We
            do not use advertising or tracking cookies. If we ever add analytics, it will only run if you say yes in the
            cookie banner.
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Purpose</th>
                <th>Type</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>oro-cart-v1</td>
                <td>Remembers what is in your bag</td>
                <td>Essential (local storage)</td>
                <td>Until you clear it</td>
              </tr>
              <tr>
                <td>oro-consent</td>
                <td>Remembers your cookie choice</td>
                <td>Essential (local storage)</td>
                <td>12 months</td>
              </tr>
              <tr>
                <td>__stripe_mid, __stripe_sid</td>
                <td>Set by Stripe at checkout to process payments securely and prevent fraud</td>
                <td>Essential</td>
                <td>1 year / 30 minutes</td>
              </tr>
            </tbody>
          </table>
          <p>
            Essential storage does not need consent because the store cannot work without it. You can change your choice any
            time: <CookieSettingsLink />.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>If we change this policy we will update the date above. Significant changes will be shown on the site.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
