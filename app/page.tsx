import Countdown from '@/components/Countdown'
import WaitlistForm from '@/components/WaitlistForm'
import Footer from '@/components/Footer'
import { site } from '@/lib/site'
import styles from './page.module.css'

const MARQUEE = ['Limited run', 'No restocks', 'Members first', 'Gold standard']

const PIECES = [
  { no: '01', name: 'Classified' },
  { no: '02', name: 'Classified' },
  { no: '03', name: 'Classified' },
  { no: '04', name: 'Classified' },
]

const STEPS = [
  { title: 'Get on the list', body: 'Drop your email. That’s your key.' },
  { title: 'Early access', body: 'List members shop before the public — first pick of sizes.' },
  { title: 'Gone for good', body: 'Every piece is a limited run. When it sells out, it’s done.' },
]

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.glow} aria-hidden />

      <header className={styles.topbar}>
        <span className={styles.mark}>OC</span>
        <a href="#list" className={styles.topCta}>Join the list</a>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>Drop 001 · {site.domain}</p>
        <h1 className={styles.wordmark}>
          <span>ORO</span>
          <span className={styles.gold}>CARTEL</span>
        </h1>
        <p className={styles.tagline}>{site.tagline}</p>
        <div className={styles.countdown}>
          <Countdown target={site.dropDate} />
        </div>
        <div id="list" className={styles.formWrap}>
          <WaitlistForm source="hero" />
        </div>
      </section>

      <div className={styles.marquee} aria-hidden>
        <div className={styles.track}>
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>
              {t} <span className={styles.star}>✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.h2}>Drop 001</h2>
        <p className={styles.sub}>Pieces revealed to the list first.</p>
        <div className={styles.grid}>
          {PIECES.map((p) => (
            <div key={p.no} className={styles.card}>
              <div className={styles.cardArt}>
                <span className={styles.cardNo}>{p.no}</span>
                <span className={styles.lock}>Locked</span>
              </div>
              <div className={styles.cardMeta}>
                <span>{p.name}</span>
                <span className={styles.muted}>—</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>How it works</h2>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s.title} className={styles.step}>
              <span className={styles.stepNo}>0{i + 1}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepBody}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.final}`}>
        <h2 className={styles.h2}>Don&apos;t hear about it late.</h2>
        <WaitlistForm source="footer" />
      </section>

      <Footer />
    </main>
  )
}
