import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'
import { WIX_STORES_APP_ID, wixConfigured, wixFetch } from '@/lib/wix'
import { site } from '@/lib/site'

type Line = { productId?: unknown; variantId?: unknown; quantity?: unknown }

// Builds a Wix checkout from the bag and returns the Wix-hosted payment URL.
// Prices and availability always come from Wix, never from the browser.
export async function POST(req: NextRequest) {
  if (!wixConfigured() || !process.env.WIX_CLIENT_ID) {
    return NextResponse.json({ error: 'Checkout is not open yet.' }, { status: 503 })
  }

  let body: { items?: Line[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const products = await getProducts()
  const lineItems = (body.items ?? [])
    .map((l) => {
      const p = products.find((x) => x.id === l.productId)
      const qty = Math.max(1, Math.min(10, Math.floor(Number(l.quantity) || 1)))
      if (!p || !p.inStock) return null
      const variantId = typeof l.variantId === 'string' && l.variantId ? l.variantId : p.variantId
      return {
        quantity: qty,
        catalogReference: { catalogItemId: p.id, appId: WIX_STORES_APP_ID, options: { variantId } },
      }
    })
    .filter(Boolean)
    .slice(0, 50)

  if (!lineItems.length) {
    return NextResponse.json({ error: 'Your bag has no available items.' }, { status: 400 })
  }

  try {
    // Visitor token for the headless OAuth app; checkout links are issued per visitor.
    const { access_token } = await wixFetch<{ access_token: string }>('/oauth2/token', {
      body: { clientId: process.env.WIX_CLIENT_ID, grantType: 'anonymous' },
      revalidate: false,
      auth: '',
    })

    const { checkout } = await wixFetch<{ checkout: { id: string } }>('/ecom/v1/checkouts', {
      body: { lineItems, channelType: 'WEB' },
      revalidate: false,
      auth: access_token,
    })

    const { redirectSession } = await wixFetch<{ redirectSession: { fullUrl: string } }>(
      '/redirect-session/v1/redirect-session',
      {
        body: {
          ecomCheckout: { checkoutId: checkout.id },
          callbacks: { postFlowUrl: site.url, thankYouPageUrl: `${site.url}/thank-you` },
        },
        revalidate: false,
        auth: access_token,
      },
    )

    return NextResponse.json({ url: redirectSession.fullUrl })
  } catch (e) {
    console.error('Checkout failed', e)
    return NextResponse.json({ error: 'Checkout is unavailable right now. Please try again.' }, { status: 502 })
  }
}
