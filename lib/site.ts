export const site = {
  name: 'OROCARTEL',
  domain: 'orocartel.com',
  url: 'https://www.orocartel.com',
  tagline: 'Limited runs. No restocks.',
  description: 'OROCARTEL — Drop 001. Join the list for early access before the public release.',
  // Drop a photo in /public (e.g. /hero.jpg) and set its path here to fill the hero.
  heroImage: '',
  dropDate: process.env.NEXT_PUBLIC_DROP_DATE || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'orocartel.com@gmail.com',
}

// Collection tiles on the homepage. Add `image: '/file.jpg'` (from /public) once photos are ready.
export const collections: { name: string; image?: string }[] = [
  { name: 'Outerwear' },
  { name: 'Shirts' },
  { name: 'Denim' },
  { name: 'Accessories' },
]
