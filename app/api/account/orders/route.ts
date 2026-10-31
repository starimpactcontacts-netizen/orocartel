import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { stripeConfigured } from '@/lib/stripe'
import { findOrders, q, viewOrder } from '@/lib/orderStatus'

// Orders for the signed-in customer. The Supabase session token proves who they
// are; we only ever return orders placed with that verified email.
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const supabase = getSupabase()
  if (!token || !supabase) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data, error } = await supabase.auth.getUser(token)
  const email = data.user?.email?.toLowerCase()
  if (error || !email) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  if (!stripeConfigured()) return NextResponse.json({ email, orders: [] })

  try {
    const pis = await findOrders(`metadata['email']:'${q(email)}'`)
    const orders = await Promise.all(pis.map(viewOrder))
    orders.sort((a, b) => b.placedAt.localeCompare(a.placedAt))
    return NextResponse.json({ email, orders })
  } catch (e) {
    console.error('Account orders failed', e)
    return NextResponse.json({ email, orders: [], error: 'Orders are unavailable right now.' })
  }
}
