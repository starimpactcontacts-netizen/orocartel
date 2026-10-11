import type { Metadata, Viewport } from 'next'
import { Charis_SIL } from 'next/font/google'
import { site } from '@/lib/site'
import './globals.css'

// Charis SIL is the open-source cut of Charter, the brand's text face.
const serif = Charis_SIL({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Drop 001`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: `${site.name} — Drop 001`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Drop 001`,
    description: site.description,
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable}>
      <body>{children}</body>
    </html>
  )
}
