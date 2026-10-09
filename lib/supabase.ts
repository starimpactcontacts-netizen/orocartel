import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

// The publishable key is safe to ship: RLS only lets it insert signups and call
// oro_waitlist_count(), so nothing in the list can be read with it. Env vars override these.
const DEFAULT_URL = 'https://ostzfpeuchytqdwlvibe.supabase.co'
const DEFAULT_KEY = 'sb_publishable_Mg4pNWEJAwlKiep3ovgK5w_Wc967WZ4'

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY
  if (!url || !key) return null
  if (!client) {
    client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return client
}
