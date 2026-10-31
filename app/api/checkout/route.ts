import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'
import { SHIP_TO, stripe, stripeConfigured } from '@/lib/stripe'
import { shipping, shippingFor } from '@/lib/shipping'
import { site } from '@/lib/site'

type Line = { productId?: unknown; variantId?: unknown; quantity?: unknown }

// Creates a Stripe Checkout session from the bag. Prices and shipping are worked out
// here from the live catalogue, never taken from the browser. The paid order is sent
// to Wix (and so to Blanka) by /api/stripe/webhook.
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: 'Checkout is not open yet.' }, { status: 503 })
  }

  let body: { items?: Line[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const products = await getProducts()
  const lines = (body.items ?? [])
    .map((l) => {
      const p = products.find((x) => x.id === l.productId)
      if (!p || !p.inStock || !p.price || !p.variantId) return null
      const quantity = Math.max(1, Math.min(10, Math.floor(Number(l.quantity) || 1)))
      return { p, quantity }
    })
    .filter((l): l is NonNullable<typeof l> => !!l)
    .slice(0, 20)

  if (!lines.length) {
    return NextResponse.json({ error: 'Your bag has no available items.' }, { status: 400 })
  }

  const subtotal = lines.reduce((n, { p, quantity }) => n + p.price * quantity, 0)
  const fee = shippingFor(subtotal)

  try {
    const origin = req.headers.get('origin') || site.url
    // The Stripe account is shared with other brands, so the page is branded per
    // session and every session is tagged; the webhook ignores anything untagged.
    const branding = {
      display_name: site.name,
      logo: { type: 'url', url: `${site.url}/wordmark-dark.png` },
      icon: { type: 'url', url: `${site.url}/ram-dark.png` },
      background_color: '#ffffff',
      button_color: '#121212',
      border_style: 'rectangular',
      font_family: 'noto_serif',
    }
    const session = await stripe().checkout.sessions.create({
      // Newer API field, not in this SDK's types yet.
      ...({ branding_settings: branding } as object),
      mode: 'payment',
      metadata: { store: 'orocartel' },
      payment_intent_data: { statement_descriptor_suffix: 'OROCARTEL', metadata: { store: 'orocartel' } },
      currency: 'sek',
      locale: 'auto',
      line_items: lines.map(({ p, quantity }) => ({
        quantity,
        price_data: {
          currency: 'sek',
          unit_amount: Math.round(p.price * 100),
          product_data: {
            name: p.name,
            ...(p.image ? { images: [new URL(p.image, site.url).toString()] } : {}),
            // Read back by the webhook to build the Wix order.
            metadata: { wix_product_id: p.id, wix_variant_id: p.variantId },
          },
        },
      })),
      shipping_address_collection: { allowed_countries: SHIP_TO },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: fee ? 'Standard shipping' : `Free shipping (orders from ${shipping.freeFrom} kr)`,
            fixed_amount: { amount: fee * 100, currency: 'sek' },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('Stripe checkout failed', e)
    return NextResponse.json({ error: 'Checkout is unavailable right now. Please try again.' }, { status: 502 })
  }
}
