import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const alt = `${site.name} — First Drop`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 0%, #3a2e0c 0%, #070707 65%)',
          color: '#f4efe3',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 10, color: '#8f887a', textTransform: 'uppercase' }}>
          Drop 001
        </div>
        <div style={{ display: 'flex', marginTop: 20, fontSize: 150, fontWeight: 900, letterSpacing: -2 }}>
          <span>ORO&nbsp;</span>
          <span style={{ color: '#d4af37' }}>CARTEL</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 30, color: '#8f887a' }}>{site.tagline}</div>
        <div style={{ marginTop: 40, fontSize: 24, color: '#d4af37', letterSpacing: 6 }}>{site.domain.toUpperCase()}</div>
      </div>
    ),
    size
  )
}
