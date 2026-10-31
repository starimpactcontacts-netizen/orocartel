import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe, stripeConfigured } from '@/lib/stripe'
import { fulfilPaymentIntent, fulfilSession } from '@/lib/fulfil'

// Stripe → paid Wix order. Add this URL in Stripe (Developers → Webhooks) for
// payment_intent.succeeded (our /checkout page) and checkout.session.completed /
// checkout.session.async_payment_succeeded (older hosted-checkout sessions).
// If STRIPE_WEBHOOK_SECRET is set the signature is checked; either way the session is
// re-read from Stripe, so a forged call can't create an order for an unpaid session.
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const raw = await req.text()
  let event: Stripe.Event
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    event = secret
      ? stripe().webhooks.constructEvent(raw, req.headers.get('stripe-signature') ?? '', secret)
      : (JSON.parse(raw) as Stripe.Event)
  } catch {
    return NextResponse.json({ error: 'Bad payload' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const piId = (event.data.object as { id?: string }).id
    if (!piId?.startsWith('pi_')) return NextResponse.json({ error: 'Bad payment' }, { status: 400 })
    try {
      return NextResponse.json({ received: true, wixOrderId: await fulfilPaymentIntent(piId) })
    } catch (e) {
      console.error('Fulfilment failed for', piId, e)
      return NextResponse.json({ error: 'Fulfilment failed' }, { status: 500 })
    }
  }

  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return NextResponse.json({ received: true })
  }

  const id = (event.data.object as { id?: string }).id
  if (!id?.startsWith('cs_')) return NextResponse.json({ error: 'Bad session' }, { status: 400 })

  try {
    const wixOrderId = await fulfilSession(id)
    return NextResponse.json({ received: true, wixOrderId })
  } catch (e) {
    // Non-2xx makes Stripe retry for up to three days.
    console.error('Fulfilment failed for', id, e)
    return NextResponse.json({ error: 'Fulfilment failed' }, { status: 500 })
  }
}
