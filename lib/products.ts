export type Hotspot = {
  x: number // % from left of the image
  y: number // % from top of the image
  title: string
  text: string
}

export type Product = {
  slug: string
  name: string
  label: string // small line above the gallery, e.g. the drop
  price: number // in kr
  image: string
  images: string[]
  color: string
  inStock: boolean
  sizes: string[]
  description: string
  fit: string[]
  materials: string[]
  hotspots: Hotspot[]
}

// Placeholder copy is marked "TBD" — swap in real fabric, care and fit details.
export const products: Product[] = [
  {
    slug: 'henley-slim-fit-long-sleeve',
    name: 'The Henley (Slim Fit)',
    label: '001: The Henley',
    price: 349,
    image: '/products/henley-black.jpg',
    images: ['/products/henley-black.jpg'],
    color: 'Black',
    inStock: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description:
      'Black, buttoned low, made to move from daylight into the night. A slim-fit long-sleeve henley with a three-button placket.',
    fit: ['Slim fit', 'Henley collar with three-button placket', 'Long sleeves', 'Model measurements: TBD'],
    materials: ['Composition: TBD', 'Care instructions: TBD'],
    hotspots: [
      { x: 51, y: 27, title: 'Three-button placket', text: 'Buttoned low at the collar.' },
      { x: 40, y: 56, title: 'Slim body', text: 'Cut close through the chest and waist.' },
      { x: 20, y: 76, title: 'Long sleeves', text: 'Full-length sleeves with a clean cuff.' },
    ],
  },
]

export const formatPrice = (kr: number) => `${kr.toLocaleString('sv-SE')} kr`

export const getProduct = (slug: string) => products.find((p) => p.slug === slug)
