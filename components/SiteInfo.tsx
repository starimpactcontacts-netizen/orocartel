import Link from 'next/link'
import { site } from '@/lib/site'
import { shipping } from '@/lib/shipping'
import CookieSettingsLink from './CookieSettingsLink'
import styles from './SiteInfo.module.css'

function Chevron() {
  return (
    <svg className={styles.chev} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// Closing block: collapsible info sections (sign-up lives in the product rail).
export default function SiteInfo() {
  const socials = [
    site.instagram && { label: 'Instagram', href: site.instagram },
    site.tiktok && { label: 'TikTok', href: site.tiktok },
    site.youtube && { label: 'YouTube', href: site.youtube },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <section className={styles.wrap}>
      <h2 className={styles.aboutTitle}>
        <Link href="/about" className={styles.aboutLink}>
          About
        </Link>
      </h2>

      <div className={styles.list}>
        <details className={styles.item}>
          <summary>Customer Support <Chevron /></summary>
          <div className={`${styles.body} ${styles.support}`}>
            <div>
              <h3>Contact us</h3>
              <p>
                Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. We reply {site.replyTime}, Monday to
                Friday. Include your order number if you have one.
              </p>
            </div>
            <div>
              <h3>Shipping</h3>
              <p>
                {shipping.fee} kr per order, free from {shipping.freeFrom} kr. Orders are made and shipped by our
                production partner and usually arrive in {site.deliveryTime}. You get a tracking link by email when your
                order ships. We deliver to Sweden, the Nordics, most of the EU, the UK, the US and Canada.
              </p>
            </div>
            <div>
              <h3>Order status</h3>
              <p>
                Your receipt arrives by email right after you pay. Can’t find it? Check your spam folder or email us with the
                name and email you ordered with.
              </p>
            </div>
            <div>
              <h3>Returns</h3>
              <p>
                You have 14 days to return unopened products with the seal intact. For hygiene reasons, opened cosmetics
                can’t be returned. <Link href="/terms#returns">Full return policy</Link>
              </p>
            </div>
            <div>
              <h3>Damaged or wrong item</h3>
              <p>
                Email us a photo and your order number and we will send a replacement or a full refund, at no cost to you.
              </p>
            </div>
            <div>
              <h3>Payment</h3>
              <p>
                Card, Apple Pay, Google Pay and more, processed securely by Stripe. Prices are in SEK and include VAT. We never
                see or store your card details.
              </p>
            </div>
          </div>
        </details>

        <details className={styles.item}>
          <summary>About Orocartel <Chevron /></summary>
          <div className={styles.body}>
            <p>Orocartel is a men’s makeup store from Stockholm.</p>
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
            <Link href="/terms">Terms of sale</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/privacy#cookies">Cookie policy</Link>
            <CookieSettingsLink />
          </div>
        </details>
      </div>
    </section>
  )
}
