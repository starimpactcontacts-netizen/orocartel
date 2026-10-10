'use client'

import { useEffect, useState } from 'react'
import styles from './Countdown.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

export default function Countdown({ target }: { target: string }) {
  const targetMs = target ? Date.parse(target) : NaN
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (Number.isNaN(targetMs)) return <p className={styles.text}>Coming soon</p>
  if (now !== null && now >= targetMs) return <p className={styles.text}>Live now</p>

  const s = now === null ? null : Math.floor((targetMs - now) / 1000)
  const units: [string, number | null][] = [
    ['Days', s === null ? null : Math.floor(s / 86400)],
    ['Hours', s === null ? null : Math.floor((s % 86400) / 3600)],
    ['Min', s === null ? null : Math.floor((s % 3600) / 60)],
    ['Sec', s === null ? null : s % 60],
  ]

  return (
    <div className={styles.wrap} aria-label="Time until drop">
      {units.map(([label, v], i) => (
        <div key={label} className={styles.unit}>
          {i > 0 && <span className={styles.sep} aria-hidden />}
          <div>
            <span className={styles.num}>{v === null ? '--' : pad(v)}</span>
            <span className={styles.label}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
