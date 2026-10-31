import 'server-only'

// Wix Headless backend. Blanka syncs products into the Wix store; we read them here.
// WIX_API_KEY is a secret and must only be set in Vercel env vars, never committed.
const API = 'https://www.wixapis.com'
export const WIX_SITE_ID = process.env.WIX_SITE_ID || '771fb956-c08e-466b-bbaf-3886a70297b2'
export const WIX_STORES_APP_ID = '215238eb-22a5-4c36-9e7b-e7c08025e04e'

// Tolerate pasting slips in the dashboard: surrounding quotes, whitespace or a "Bearer " prefix.
const apiKey = () =>
  (process.env.WIX_API_KEY ?? '').trim().replace(/^["']|["']$/g, '').replace(/^Bearer\s+/i, '').trim()
export const wixConfigured = () => Boolean(apiKey())

export async function wixFetch<T>(
  path: string,
  init: { method?: string; body?: unknown; revalidate?: number | false; auth?: string } = {},
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init.method ?? 'POST',
    headers: {
      Authorization: init.auth ?? apiKey(),
      'wix-site-id': WIX_SITE_ID,
      'Content-Type': 'application/json',
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    ...(init.revalidate === false
      ? { cache: 'no-store' as const }
      : { next: { revalidate: init.revalidate ?? 60, tags: ['wix'] } }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Wix ${path} ${res.status}: ${text.slice(0, 300)}`)
  }
  return res.json() as Promise<T>
}
