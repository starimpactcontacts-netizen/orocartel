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
        gap: 20,
        padding: 16,
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 80, color: 'var(--gold)' }}>404</h1>
      <p style={{ color: 'var(--muted)' }}>Nothing here. Yet.</p>
      <Link href="/" style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 12 }}>
        ← Back to the drop
      </Link>
    </main>
  )
}
