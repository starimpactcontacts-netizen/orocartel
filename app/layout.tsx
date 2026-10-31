import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { site } from '@/lib/site'
import { CartProvider } from '@/components/cart/CartProvider'
import CartDrawer from '@/components/cart/CartDrawer'
import './globals.css'

// Montserrat: the closest open geometric sans to the Gotham-style face luxury beauty houses use.
const sans = Montserrat({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
