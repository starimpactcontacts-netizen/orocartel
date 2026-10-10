import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const alt = `${site.name} — Drop 001`
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
          background: '#121212',
          color: '#f3f3f3',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 120, letterSpacing: 6 }}>{site.name}</div>
        <div style={{ marginTop: 30, fontSize: 30, letterSpacing: 12, textTransform: 'uppercase', opacity: 0.7 }}>
          Drop 001
        </div>
      </div>
    ),
    size
  )
}
