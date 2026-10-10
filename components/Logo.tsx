import styles from './Logo.module.css'

// Stacked lockup: small greyhound centered above the wordmark. `size` is the wordmark width in px.
export default function Logo({ size = 200, className }: { size?: number; className?: string }) {
  return (
    <span className={className ? `${styles.logo} ${className}` : styles.logo} style={{ width: size }}>
      <img src="/greyhound.png" alt="" className={styles.mark} width={1477} height={462} />
      <img src="/wordmark.png" alt="OROCARTEL" className={styles.word} width={657} height={85} />
    </span>
  )
}
