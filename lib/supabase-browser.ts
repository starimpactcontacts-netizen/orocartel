'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Browser client for customer sign-in (passwordless email link or code).
// Same project and publishable key as lib/supabase.ts.
let client: SupabaseClient | null = null

export function supabaseBrowser() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ostzfpeuchytqdwlvibe.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Mg4pNWEJAwlKiep3ovgK5w_Wc967WZ4',
      { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'oro-auth' } },
    )
  }
  return client
}
