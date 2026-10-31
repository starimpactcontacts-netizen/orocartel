import { NextRequest, NextResponse } from 'next/server'
import { stripeConfigured } from '@/lib/stripe'
import { normaliseEmail, normaliseRef } from '@/lib/order'
import { findOrders, q, viewOrder } from '@/lib/orderStatus'

// Track an order with the order number and the email it was placed with.
// Both must match, so an order number alone reveals nothing.
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) return NextResponse.json({ error: 'Tracking is unavailable right now.' }, { status: 503 })
  const body = await req.json().catch(() => ({}))
  const ref = normaliseRef(String(body.orderNumber ?? ''))
  const email = normaliseEmail(String(body.email ?? ''))
  if (ref.length !== 8 || !email.includes('@')) {
    return NextResponse.json({ error: 'Enter your 8-character order number and the email you ordered with.' }, { status: 400 })
  }
  try {
    const [pi] = await findOrders(`metadata['ref']:'${q(ref)}'`, 1)
    const owner = (pi?.metadata.email ?? pi?.receipt_email ?? '').toLowerCase()
    if (!pi || owner !== email) {
      return NextResponse.json(
        { error: 'We couldn’t find an order with that number and email. New orders can take a minute to appear.' },
        { status: 404 },
      )
    }
    return NextResponse.json({ order: await viewOrder(pi) })
  } catch (e) {
    console.error('Order tracking failed', e)
    return NextResponse.json({ error: 'Tracking is unavailable right now. Please try again.' }, { status: 502 })
  }
}
