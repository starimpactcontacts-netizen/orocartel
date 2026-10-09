import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export async function POST(request: NextRequest) {
  let body: { email?: unknown; instagram?: unknown; size?: unknown; source?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'enter a valid email' }, { status: 400 })
  }

  const instagram =
    typeof body.instagram === 'string'
      ? body.instagram.trim().replace(/^@/, '').slice(0, 30) || null
      : null
  const size = typeof body.size === 'string' && SIZES.includes(body.size) ? body.size : null
  const source = typeof body.source === 'string' ? body.source.slice(0, 64) || null : null

  const supabase = getSupabase()
  if (!supabase) {
    console.error('Waitlist: Supabase env vars are not set')
    return NextResponse.json({ error: 'list is not open yet, try again soon' }, { status: 503 })
  }

  const { error } = await supabase.from('oro_waitlist').insert([{ email, instagram, size, source }])

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: "you're already on the list" }, { status: 409 })
    }
    console.error('Waitlist insert error:', error)
    return NextResponse.json({ error: 'something went wrong, try again' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}

export async function GET() {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ count: 0 })

  const { data, error } = await supabase.rpc('oro_waitlist_count')

  if (error) {
    console.error('Waitlist count error:', error)
    return NextResponse.json({ count: 0 })
  }
  return NextResponse.json({ count: Number(data) || 0 })
}
