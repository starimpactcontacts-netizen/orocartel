import SignUp from './SignUp'
import styles from './ProductCard.module.css'
import own from './ComingSoonCard.module.css'

// Sits in the product rail after the products: same tile, but an email sign-up.
export default function ComingSoonCard() {
  return (
    <article id="list" className={`${styles.card} ${own.card}`}>
      <div className={`${styles.media} ${own.media}`}>
        <span className={styles.tag}>Soon</span>
        <img src="/ram-dark.png" alt="" aria-hidden className={own.ram} width={1085} height={710} />
      </div>
      <div className={styles.body}>
        <h3 className={`${styles.name} headline`}>More coming soon</h3>
        <p className={styles.tagline}>Be the first to know when the next product drops.</p>
        <div className={own.form}>
          <SignUp source="rail" />
        </div>
      </div>
    </article>
  )
}
