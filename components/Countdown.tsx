'use client'

import { useEffect, useState } from 'react'
import styles from './Countdown.module.css'

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function Countdown({ target }: { target: string }) {
  const targetMs = target ? Date.parse(target) : NaN
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (Number.isNaN(targetMs)) {
    return <p className={styles.soon}>Drop date — coming soon</p>
  }

  if (now !== null && now >= targetMs) {
    return <p className={styles.live}>The drop is live</p>
  }

  const p = now === null ? null : parts(targetMs - now)
  const units: [string, number | undefined][] = [
    ['Days', p?.days],
    ['Hrs', p?.hours],
    ['Min', p?.mins],
    ['Sec', p?.secs],
  ]

  return (
    <div className={styles.wrap} aria-label="Time until drop">
      {units.map(([label, value]) => (
        <div key={label} className={styles.unit}>
          <span className={styles.num}>{value === undefined ? '--' : pad(value)}</span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  )
}
