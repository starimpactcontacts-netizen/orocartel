import type { Metadata, Viewport } from 'next'
import { Inter_Tight, Montserrat } from 'next/font/google'
import { site } from '@/lib/site'
import { CartProvider } from '@/components/cart/CartProvider'
import CartDrawer from '@/components/cart/CartDrawer'
import JsonLd from '@/components/JsonLd'
import CookieBanner from '@/components/CookieBanner'
import './globals.css'

// Montserrat: the closest open geometric sans to the Gotham-style face luxury beauty houses use.
const sans = Montserrat({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-sans' })
// Headlines: Helvetica Neue where the device has it (Apple), Inter Tight elsewhere.
const head = Inter_Tight({ weight: ['600', '700'], subsets: ['latin'], variable: '--font-head-fallback' })

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
    <html lang="en" className={`${sans.variable} ${head.variable}`}>
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': `${site.url}/#org`,
                name: site.name,
                url: site.url,
                logo: `${site.url}/icon.png`,
                email: site.contactEmail,
                address: { '@type': 'PostalAddress', addressLocality: 'Stockholm', addressCountry: 'SE' },
                description: site.description,
                sameAs: [site.instagram, site.tiktok, site.youtube].filter(Boolean),
              },
              { '@type': 'WebSite', '@id': `${site.url}/#site`, name: site.name, url: site.url, publisher: { '@id': `${site.url}/#org` } },
            ],
          }}
        />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        <CookieBanner />
      </body>
    </html>
  )
}
