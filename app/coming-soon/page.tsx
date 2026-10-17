import SignUp from '@/components/SignUp'
import { site } from '@/lib/site'
import styles from './page.module.css'

export const metadata = { title: { absolute: site.name } }

export default function ComingSoon() {
  return (
    <main className={styles.main}>
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

      <div className={styles.ram} aria-hidden>
        <img src="/ram.png" alt="" className={styles.ramWhite} width={1085} height={710} />
        <img src="/ram-dark.png" alt="" className={styles.ramBlack} width={1085} height={710} />
      </div>

      <div className={styles.bottom}>
        <h1 className={styles.title}>Coming soon</h1>
        <p className={styles.sub}>Sign up to hear first.</p>
        <div className={styles.form}>
          <SignUp source="coming-soon" />
        </div>
        <a className={styles.contact} href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </div>
    </main>
  )
}
