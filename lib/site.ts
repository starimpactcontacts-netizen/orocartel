type Feature = {
  title: string[]
  href: string
  shape: 'landscape' | 'square'
  ram?: { corner: 'left' | 'right'; tone: 'white' | 'black' }
  width: number
  height: number
  alt: string
  sources: { src: string; width: number }[]
}

export const site = {
  // true: every page shows the coming-soon screen. Set to false to open the store.
  comingSoon: false,
  name: 'OROCARTEL',
  domain: 'orocartel.com',
  url: 'https://www.orocartel.com',
  description: 'Orocartel is a men’s makeup store from Sweden. Makeup for men, starting with the CABRÓN Kohl Eye Pencil, a creamy black kohl eyeliner for men.',
  // Homepage copy (placeholder — swap freely)
  heroBadge: 'New',
  heroTitle: 'Cabrón Kohl',
  heroText: 'Creamy black kohl, made for men.',
  heroLink: 'Shop now',
  heroHref: '/products/cabron-kohl-eye-pencil',
  introText: 'Orocartel is the first stop for men’s makeup.',
  introLink: 'Shop all',
  // Hero photo: list every pre-sized copy in /public/hero, smallest to largest
  // (largest = the original file). width/height are the original's pixels.
  hero: {
    width: 2156,
    height: 1952,
    alt: 'Man wearing the Cabrón Kohl',
    sources: [
      { src: '/hero/kohl-640.jpg', width: 640 },
      { src: '/hero/kohl-828.jpg', width: 828 },
      { src: '/hero/kohl-1290.jpg', width: 1290 },
      { src: '/hero/kohl-1600.jpg', width: 1600 },
      { src: '/hero/kohl-2156.jpg', width: 2156 },
    ],
  },
  // Full-width campaign tiles under the hero, top to bottom.
  // shape: 'landscape' = 4:3 everywhere; 'square' = 1:1 on phones, wide banner on desktop.
  // ram: put the Orocartel ram in a bottom corner ('white' for dark photos).
  features: [
    {
      title: ['Makeup', 'for men'],
      href: '/#shop',
      shape: 'landscape',
      width: 2048,
      height: 2048,
      alt: 'Cabrón Kohl Eye Pencil and box on black leather',
      sources: [
        { src: '/hero/cabron-still-640.jpg', width: 640 },
        { src: '/hero/cabron-still-1024.jpg', width: 1024 },
        { src: '/hero/cabron-still-1290.jpg', width: 1290 },
        { src: '/hero/cabron-still-1600.jpg', width: 1600 },
        { src: '/hero/cabron-still-2048.jpg', width: 2048 },
      ],
    },
  ] as Feature[],
  dropDate: process.env.NEXT_PUBLIC_DROP_DATE || '',
  instagram: 'https://www.instagram.com/orocartel',
  tiktok: 'https://www.tiktok.com/@orocartel',
  youtube: 'https://www.youtube.com/@theorocartel',
  contactEmail: 'contact@orocartel.com',
}
