// Our own merchandising on top of the Blanka/Wix feed. Stock, price and orders
// still come from the connector; anything set here wins on orocartel.com.
// Key = the Wix product slug.
export type CatalogOverride = {
  slug?: string // our URL: /products/<slug>
  name?: string
  images?: string[] // shown first, from /public
  hideConnectorImages?: boolean // drop Blanka's stock photos entirely
}

export const catalog: Record<string, CatalogOverride> = {
  'khol-eyeliner-black': {
    slug: 'cabron-kohl-eye-pencil',
    name: 'CABRÓN Kohl Eye Pencil',
    images: ['/products/cabron-kohl.jpg'],
    hideConnectorImages: false,
  },
}
