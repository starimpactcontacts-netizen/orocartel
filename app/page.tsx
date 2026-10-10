import Header from '@/components/Header'
import Countdown from '@/components/Countdown'
import Collections from '@/components/Collections'
import WaitlistForm from '@/components/WaitlistForm'
import Footer from '@/components/Footer'
import { site } from '@/lib/site'
import styles from './page.module.css'

const icon = { width: 26, height: 26, fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, viewBox: '0 0 24 24' }

const PERKS = [
  {
    label: 'Limited runs',
    svg: (
      <svg {...icon}>
        <path d="M3 12V4h8l10 10-8 8L3 12z" />
        <circle cx="7.5" cy="8.5" r="1.3" />
      </svg>
    ),
  },
  {
    label: 'No restocks',
    svg: (
      <svg {...icon}>
        <path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9" />
      </svg>
    ),
  },
  {
    label: 'Members first',
    svg: (
      <svg {...icon}>
        <rect x="5" y="11" width="14" height="10" rx="1" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <main>
      <Header overlay />

      <section
        className={styles.hero}
        style={site.heroImage ? { backgroundImage: `url(${site.heroImage})` } : undefined}
      >
        <div className={styles.heroShade} aria-hidden />
        <div className={styles.heroInner}>
          <img src="/greyhound.png" alt="" className={styles.mark} width={1477} height={462} />
          <p className={styles.kicker}>Drop 001</p>
          <Countdown target={site.dropDate} />
          <a href="#list" className={styles.heroBtn}>Get early access</a>
        </div>
      </section>

      <div className={styles.perks}>
        {PERKS.map((p) => (
          <div key={p.label} className={styles.perk}>
            {p.svg}
            <span>{p.label}</span>
          </div>
        ))}
      </div>

      <Collections />

      <section id="list" className={styles.list}>
        <span className={styles.badge}>Drop 001</span>
        <h2 className={styles.h2}>The list</h2>
        <p className={styles.sub}>{site.tagline} List members shop first.</p>
        <WaitlistForm source="home" />
      </section>

      <Footer />
    </main>
  )
}
