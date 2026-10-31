'use client'

import { openCookieSettings } from '@/lib/consent'

export default function CookieSettingsLink({ label = 'Cookie settings' }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      style={{ padding: 0, border: 'none', background: 'none', font: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
    >
      {label}
    </button>
  )
}
