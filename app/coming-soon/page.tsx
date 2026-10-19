import SignUp from '@/components/SignUp'
import Socials from '@/components/Socials'
import { site } from '@/lib/site'
import styles from './page.module.css'

export const metadata = { title: { absolute: site.name } }

export default function ComingSoon() {
  return (
    <main className={styles.main}>
      {/* Intro: two rams charge in and clash head to head, then the page reveals */}
      <div className={styles.intro} aria-hidden>
        <div className={styles.clash}>
          <img src="/ram.png" alt="" className={`${styles.introRam} ${styles.fromLeft}`} width={1085} height={710} />
          <img src="/ram.png" alt="" className={`${styles.introRam} ${styles.fromRight}`} width={1085} height={710} />
        </div>
        <img src="/wordmark.png" alt="" className={styles.introWord} width={659} height={87} />
      </div>

      <img
        src={site.heroImage}
        srcSet={`${site.heroImage} 1179w, ${site.heroImage.replace('.jpg', '@2x.jpg')} 2358w`}
        sizes="100vw"
        alt=""
        className={styles.bg}
        fetchPriority="high"
      />
      <div className={styles.shade} aria-hidden />
      <div className={styles.grain} aria-hidden />

      <header className={styles.top}>
        <img src="/wordmark.png" alt={site.name} className={styles.word} width={659} height={87} />
      </header>

      <div className={styles.bottom}>
        <h1 className={styles.title}>Coming soon</h1>
        <p className={styles.sub}>Sign up to hear first.</p>
        <div className={styles.form}>
          <SignUp source="coming-soon" />
        </div>

        <div className={styles.foot}>
          <div className={styles.ram} aria-hidden>
            <img src="/ram.png" alt="" className={styles.ramWhite} width={1085} height={710} />
            <img src="/ram-dark.png" alt="" className={styles.ramBlack} width={1085} height={710} />
          </div>
          <Socials className={styles.socials} />
        </div>
        <a className={styles.contact} href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </div>
    </main>
  )
}
