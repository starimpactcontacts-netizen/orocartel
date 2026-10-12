export const site = {
  name: 'OROCARTEL',
  domain: 'orocartel.com',
  url: 'https://www.orocartel.com',
  tagline: 'Limited runs. No restocks.',
  description: 'Orocartel is a menswear label from Sweden. 001: The Henley.',
  // Drop a photo in /public (e.g. /hero.jpg) and set its path here to fill the hero.
  heroImage: '/hero.jpg',
  dropDate: process.env.NEXT_PUBLIC_DROP_DATE || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
  contactEmail: 'contact@orocartel.com',
}
