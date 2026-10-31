'use client'

// Cookie consent, kept in local storage for 12 months. Today only essential storage
// is used; anything optional (analytics) must check `consent()?.analytics` first.
export type Consent = { analytics: boolean; at: string }
const KEY = 'oro-consent'
const YEAR = 365 * 24 * 3600 * 1000

export function consent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null') as Consent | null
    if (!c || Date.now() - new Date(c.at).getTime() > YEAR) return null
    return c
  } catch {
    return null
  }
}

export function saveConsent(analytics: boolean) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ analytics, at: new Date().toISOString() }))
  } catch {}
  window.dispatchEvent(new Event('oro:consent'))
}

export const openCookieSettings = () => window.dispatchEvent(new Event('oro:cookie-settings'))
