import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

// Uses the publishable key: RLS lets it insert signups and call oro_waitlist_count(), nothing else.
// Returns null when env vars aren't set so the site still renders before Supabase is wired up.
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  if (!client) {
    client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return client
}
