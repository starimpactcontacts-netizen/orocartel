import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'
import { SHIP_TO, stripe, stripeConfigured } from '@/lib/stripe'
import { site } from '@/lib/site'

type Line = { productId?: unknown; variantId?: unknown; quantity?: unknown }

// Creates a Stripe Checkout session from the bag. Prices come from the Wix catalogue,
// never from the browser. The paid order is pushed to Wix by the Stripe webhook.
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
      if (!p || !p.inStock || !p.price) return null
      const quantity = Math.max(1, Math.min(10, Math.floor(Number(l.quantity) || 1)))
      const variantId = typeof l.variantId === 'string' && l.variantId ? l.variantId : p.variantId
      return { p, quantity, variantId }
    })
    .filter((l): l is NonNullable<typeof l> => !!l)
    .slice(0, 20)

  if (!lines.length) {
    return NextResponse.json({ error: 'Your bag has no available items.' }, { status: 400 })
  }

  try {
    const origin = req.headers.get('origin') || site.url
    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      currency: 'sek',
      line_items: lines.map(({ p, quantity }) => ({
        quantity,
        price_data: {
          currency: 'sek',
          unit_amount: Math.round(p.price * 100),
          product_data: { name: p.name, ...(p.image ? { images: [p.image] } : {}) },
        },
      })),
      shipping_address_collection: { allowed_countries: SHIP_TO },
      phone_number_collection: { enabled: true },
      ...(process.env.STRIPE_SHIPPING_RATE_ID
        ? { shipping_options: [{ shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID }] }
        : {}),
      // Compact cart for the webhook: productId:variantId:qty, comma-separated
      metadata: { items: lines.map(({ p, variantId, quantity }) => `${p.id}:${variantId}:${quantity}`).join(',') },
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('Stripe checkout failed', e)
    return NextResponse.json({ error: 'Checkout is unavailable right now. Please try again.' }, { status: 502 })
  }
}
