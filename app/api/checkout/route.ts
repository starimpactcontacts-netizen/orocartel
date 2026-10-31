import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripeConfigured } from '@/lib/stripe'
import { encodeLines, newOrderRef, priceBag, type CartLine } from '@/lib/order'

// Our own checkout: creates (or updates) a Stripe PaymentIntent for the bag and
// returns its client secret to the /checkout page, which collects the address and
// payment on orocartel.com. The paid order is sent to Wix by /api/stripe/webhook.
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: 'Checkout is not open yet.' }, { status: 503 })
  }

  let body: { items?: CartLine[]; paymentIntentId?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const bag = await priceBag(body.items ?? [])
  if (!bag.lines.length) {
    return NextResponse.json({ error: 'Your bag has no available items.' }, { status: 400 })
  }

  const metadata = {
    store: 'orocartel',
    flow: 'elements',
    items: encodeLines(bag.lines),
    subtotal: String(bag.subtotal),
    shipping: String(bag.shipping),
  }
  const amount = Math.round(bag.total * 100)

  try {
    const existing = typeof body.paymentIntentId === 'string' && body.paymentIntentId.startsWith('pi_')
    let pi = existing ? await stripe().paymentIntents.retrieve(body.paymentIntentId as string) : null
    if (pi && pi.metadata?.store === 'orocartel' && ['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(pi.status)) {
      pi = await stripe().paymentIntents.update(pi.id, { amount, metadata })
    } else {
      pi = await stripe().paymentIntents.create({
        amount,
        currency: 'sek',
        automatic_payment_methods: { enabled: true },
        description: 'OROCARTEL order',
        statement_descriptor_suffix: 'OROCARTEL',
        metadata: { ...metadata, ref: newOrderRef() },
      })
    }

    return NextResponse.json({
      paymentIntentId: pi.id,
      clientSecret: pi.client_secret,
      lines: bag.lines.map((l) => ({
        id: l.product.id,
        name: l.product.name,
        image: l.product.image,
        quantity: l.quantity,
        price: l.product.price,
      })),
      subtotal: bag.subtotal,
      shipping: bag.shipping,
      total: bag.total,
    })
  } catch (e) {
    console.error('Checkout intent failed', e)
    return NextResponse.json({ error: 'Checkout is unavailable right now. Please try again.' }, { status: 502 })
  }
}
