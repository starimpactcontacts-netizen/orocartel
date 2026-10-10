import type { Metadata, Viewport } from 'next'
import { Assistant, Cormorant_Garamond, Italiana } from 'next/font/google'
import { site } from '@/lib/site'
import './globals.css'

const logo = Italiana({ weight: '400', subsets: ['latin'], variable: '--font-logo' })
const display = Cormorant_Garamond({ weight: ['500', '600'], subsets: ['latin'], variable: '--font-display' })
const body = Assistant({ subsets: ['latin'], variable: '--font-body' })

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
  themeColor: '#121212',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${logo.variable} ${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
