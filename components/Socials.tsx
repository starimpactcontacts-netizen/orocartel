import { site } from '@/lib/site'

const icons = {
  TikTok: (
    <path d="M16.6 3c.3 2.2 1.6 3.8 3.9 4v3a7 7 0 0 1-3.9-1.2v6.4A5.8 5.8 0 1 1 10.8 9.4v3.1a2.8 2.8 0 1 0 2.8 2.8V3h3z" fill="currentColor" stroke="none" />
  ),
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" />
    </>
  ),
}

export default function Socials({ className, size = 24 }: { className?: string; size?: number }) {
  const links = [
    ['TikTok', site.tiktok],
    ['Instagram', site.instagram],
    ['YouTube', site.youtube],
  ] as const
  return (
    <nav className={className} aria-label="Social">
      {links.map(([label, href]) =>
        href ? (
          <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`${site.name} on ${label}`}>
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6">
              {icons[label]}
            </svg>
          </a>
        ) : null,
      )}
    </nav>
  )
}
