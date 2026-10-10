import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: 16,
        textAlign: 'center',
      }}
    >
      <img src="/greyhound.png" alt="" width={1477} height={462} style={{ width: 260, height: 'auto' }} />
      <h1>
        <img src="/wordmark.png" alt="OROCARTEL" width={657} height={85} style={{ height: 30, width: 'auto' }} />
      </h1>
      <p style={{ color: 'var(--muted)' }}>This page doesn&apos;t exist.</p>
      <Link
        href="/"
        style={{ padding: '14px 32px', border: '1.5px solid var(--text)', letterSpacing: '0.08em' }}
      >
        Back home
      </Link>
    </main>
  )
}
