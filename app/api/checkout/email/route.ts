import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripeConfigured } from '@/lib/stripe'
import { normaliseEmail } from '@/lib/order'

// Saves the customer's email on the payment just before it is confirmed, so the
// order can be found later (order tracking and the account page).
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  const body = await req.json().catch(() => ({}))
  const id = typeof body.paymentIntentId === 'string' ? body.paymentIntentId : ''
  const email = typeof body.email === 'string' ? normaliseEmail(body.email) : ''
  if (!id.startsWith('pi_') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  try {
    const pi = await stripe().paymentIntents.retrieve(id)
    if (pi.metadata?.store !== 'orocartel' || !pi.status.startsWith('requires_')) {
      return NextResponse.json({ error: 'Invalid payment' }, { status: 400 })
    }
    await stripe().paymentIntents.update(id, { metadata: { email }, receipt_email: email })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Saving checkout email failed', e)
    return NextResponse.json({ error: 'Try again' }, { status: 502 })
  }
}
