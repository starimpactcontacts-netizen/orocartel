import type { Metadata, Viewport } from 'next'
import { Anton, Inter } from 'next/font/google'
import { site } from '@/lib/site'
import './globals.css'

const display = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const body = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — First Drop`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: `${site.name} — First Drop`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — First Drop`,
    description: site.description,
  },
}

export const viewport: Viewport = {
  themeColor: '#070707',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
