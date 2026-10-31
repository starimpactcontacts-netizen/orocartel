import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CompanyInfo from '@/components/CompanyInfo'
import { site } from '@/lib/site'
import { shipping } from '@/lib/shipping'
import styles from '@/components/Legal.module.css'

export const metadata: Metadata = {
  title: 'Terms of sale',
  description: 'Orocartel terms of sale: prices, payment, delivery, returns and complaints.',
  alternates: { canonical: '/terms' },
}

export default function Terms() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.h1}>Terms of sale</h1>
        <p className={styles.updated}>Last updated 1 November 2026</p>

        <section>
          <h2>1. The seller</h2>
          <p>These terms apply to all purchases made on orocartel.com. The seller is:</p>
          <CompanyInfo />
        </section>

        <section>
          <h2>2. Orders</h2>
          <p>
            Your order is binding once you have paid and received an order confirmation. You must be at least 18 years old, or
            have a guardian’s permission, to order. We may cancel an order in case of an obvious pricing error or if a product
            is no longer available; any payment is then refunded in full.
          </p>
        </section>

        <section>
          <h2>3. Prices and payment</h2>
          <p>
            All prices are in Swedish kronor (SEK) and include VAT. Shipping is {shipping.fee} kr per order and free on
            orders from {shipping.freeFrom} kr, and is shown before you pay. You can pay by card, Apple Pay, Google Pay and
            the other methods shown at checkout. Payments are processed by Stripe; we never see or store your card details.
          </p>
        </section>

        <section id="delivery">
          <h2>4. Delivery</h2>
          <p>
            Your order is made and shipped by our production partner in North America. Delivery usually takes{' '}
            {site.deliveryTime}. You will receive a tracking link by email when your order ships. We deliver to Sweden, the
            Nordics, most of the EU, the United Kingdom, the United States and Canada.
          </p>
          <p>
            Orders to countries outside the EU, such as Norway or the United Kingdom, may be charged import duties or VAT by
            the destination country. These are paid by the recipient.
          </p>
          <p>
            If your delivery is delayed by more than 30 days from the expected date, you may cancel the order and receive a
            full refund.
          </p>
        </section>

        <section id="returns">
          <h2>5. Right of withdrawal (14 days)</h2>
          <p>
            Under the Swedish Distance and Off-Premises Contracts Act you can cancel your purchase within 14 days of receiving
            it. Tell us by email at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> with your order number,
            or use the EU standard withdrawal form.
          </p>
          <p>
            <strong>Hygiene exception:</strong> for health and hygiene reasons, cosmetics such as eye pencils can only be
            returned unopened, with the seal and packaging intact. Once a product has been opened or used, the right of
            withdrawal no longer applies.
          </p>
          <p>
            Return the unopened product within 14 days of telling us. You pay the cost of returning it. We refund the purchase
            price and the original standard shipping within 14 days of receiving your cancellation, using the same payment
            method. We may hold the refund until the product has been returned to us.
          </p>
        </section>

        <section id="complaints">
          <h2>6. Faulty, damaged or wrong items</h2>
          <p>
            If your product is faulty, damaged in transit or not what you ordered, email us with your order number and a photo
            within a reasonable time, and no later than 2 months after you noticed the problem. We will send a replacement or
            refund you in full, including any return shipping. Your right to complain about faulty goods lasts for 3 years
            under the Swedish Consumer Sales Act (konsumentköplagen).
          </p>
        </section>

        <section>
          <h2>7. Product use</h2>
          <p>
            Read the ingredient list before use and stop using a product if irritation occurs. Do not use on broken or
            irritated skin. The full ingredient list is on each product page and on the packaging.
          </p>
        </section>

        <section>
          <h2>8. Personal data</h2>
          <p>
            We process your personal data to handle your order. Read more in our <a href="/privacy">Privacy policy</a>.
          </p>
        </section>

        <section>
          <h2>9. Disputes</h2>
          <p>
            Contact us first and we will try to solve the matter. If we cannot agree, you can turn to the Swedish National Board
            for Consumer Disputes (Allmänna reklamationsnämnden, <a href="https://www.arn.se" target="_blank" rel="noreferrer">arn.se</a>),
            whose recommendations we follow. Swedish law applies.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
