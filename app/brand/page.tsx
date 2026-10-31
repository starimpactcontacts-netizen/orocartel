import { site } from '@/lib/site'
import styles from './page.module.css'

export const metadata = { title: { absolute: `${site.name} — Brand files` }, robots: { index: false } }

const files = [
  { name: 'Wordmark — white', file: 'orocartel-wordmark-white.png', note: 'For dark products, e.g. the black kohl pencil', dark: true },
  { name: 'Wordmark — black', file: 'orocartel-wordmark.png', note: 'For light products and packaging', dark: false },
  { name: 'Lockup — white', file: 'orocartel-lockup-white.png', note: 'Ram above wordmark, for larger dark surfaces', dark: true },
  { name: 'Lockup — black', file: 'orocartel-lockup.png', note: 'Ram above wordmark, for larger light surfaces', dark: false },
  { name: 'Ram — white', file: 'orocartel-ram-white.png', note: 'Crest only, dark surfaces', dark: true },
  { name: 'Ram — black', file: 'orocartel-ram.png', note: 'Crest only, light surfaces', dark: false },
]

// Download page for packaging logos (transparent PNGs). Not linked publicly, not indexed.
export default function Brand() {
  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Brand files</h1>
      <p className={styles.sub}>Transparent PNGs. Tap Download, then save to Files.</p>
      <ul className={styles.list}>
        {files.map((f) => (
          <li key={f.file} className={styles.item}>
            <div className={`${styles.preview} ${f.dark ? styles.dark : styles.light}`}>
              <img src={`/brand/${f.file}`} alt={f.name} />
            </div>
            <div className={styles.meta}>
              <p className={styles.name}>{f.name}</p>
              <p className={styles.note}>{f.note}</p>
              <a className={styles.btn} href={`/brand/${f.file}`} download={f.file}>
                Download PNG
              </a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
