export type Product = {
  slug: string
  name: string
  price: number // in kr
  image: string
  inStock: boolean
  sizes: string[]
  description?: string
}

export const products: Product[] = [
  {
    slug: 'henley-slim-fit-long-sleeve',
    name: 'Henley Slim Fit Long Sleeve',
    price: 349,
    image: '/products/henley-black.jpg',
    inStock: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Slim-fit long-sleeve henley in black with a three-button placket.',
  },
]

export const formatPrice = (kr: number) => `${kr.toLocaleString('sv-SE')} kr`

export const getProduct = (slug: string) => products.find((p) => p.slug === slug)
