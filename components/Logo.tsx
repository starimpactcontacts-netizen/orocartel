import styles from './Logo.module.css'

// Stacked lockup: small ram centered above the wordmark. `size` is the wordmark width in px.
export default function Logo({ size = 200, className }: { size?: number; className?: string }) {
  return (
    <span className={className ? `${styles.logo} ${className}` : styles.logo} style={{ width: size }}>
      <img src="/ram-dark.png" alt="" className={styles.mark} width={1313} height={833} />
      <img src="/wordmark-dark.png" alt="OROCARTEL" className={styles.word} width={659} height={87} />
    </span>
  )
}
