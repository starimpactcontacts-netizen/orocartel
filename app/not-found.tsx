import Link from 'next/link'
import Logo from '@/components/Logo'

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
      <h1>
        <Logo size={240} />
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
