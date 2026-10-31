export const site = {
  // true: every page shows the coming-soon screen. Set to false to open the store.
  comingSoon: false,
  name: 'OROCARTEL',
  domain: 'orocartel.com',
  url: 'https://www.orocartel.com',
  description: 'Orocartel is the men’s makeup store.',
  // Homepage copy (placeholder — swap freely)
  heroBadge: 'New',
  heroTitle: 'Cabrón Kohl',
  heroText: 'Creamy black kohl, made for men.',
  heroLink: 'Shop now',
  heroHref: '/products/cabron-kohl-eye-pencil',
  introText: 'Orocartel is the first stop for men’s makeup. Considered formulas, nothing loud.',
  introLink: 'Shop all',
  // Hero photo: list every pre-sized copy in /public/hero, smallest to largest
  // (largest = the original file). width/height are the original's pixels.
  hero: {
    width: 1078,
    height: 976,
    alt: 'Man wearing the Cabrón Kohl',
    sources: [
      { src: '/hero/kohl-640.jpg', width: 640 },
      { src: '/hero/kohl-828.jpg', width: 828 },
      { src: '/hero/kohl-1078.jpg', width: 1078 },
    ],
  },
  // Full-width tile under the hero.
  feature: {
    title: ['Makeup', 'for men'],
    href: '/#shop',
    width: 1024,
    height: 1024,
    alt: 'Cabrón Kohl Eye Pencil and box on black leather',
    sources: [
      { src: '/hero/cabron-still-640.jpg', width: 640 },
      { src: '/hero/cabron-still-1024.jpg', width: 1024 },
    ],
  },
  dropDate: process.env.NEXT_PUBLIC_DROP_DATE || '',
  instagram: 'https://www.instagram.com/orocartel',
  tiktok: 'https://www.tiktok.com/@orocartel',
  youtube: 'https://www.youtube.com/@theorocartel',
  contactEmail: 'contact@orocartel.com',
}
