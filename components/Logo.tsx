import styles from './Logo.module.css'

// Stacked lockup: small ram centered above the wordmark. `size` is the wordmark width in px.
export default function Logo({ size = 200, className }: { size?: number; className?: string }) {
  return (
    <span className={className ? `${styles.logo} ${className}` : styles.logo} style={{ width: size }}>
      <img src="/ram.png" alt="" className={styles.mark} width={767} height={491} />
      <img src="/wordmark.png" alt="OROCARTEL" className={styles.word} width={657} height={85} />
    </span>
  )
}
