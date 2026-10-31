// Our own merchandising on top of the Blanka/Wix feed. Stock and orders
// still come from the connector; anything set here wins on orocartel.com.
// Key = the Wix product slug.
export type CatalogOverride = {
  slug?: string // our URL: /products/<slug>
  name?: string
  images?: string[] // shown first, from /public
  hideConnectorImages?: boolean // drop Blanka's stock photos entirely
  price?: number // kr incl. VAT, overrides the Wix price
}

export const catalog: Record<string, CatalogOverride> = {
  'khol-eyeliner-black': {
    slug: 'cabron-kohl-eye-pencil',
    name: 'CABRÓN Kohl Eye Pencil',
    images: ['/products/cabron-kohl.jpg'],
    hideConnectorImages: false,
    // Blanka cost 66,82 kr (Wix "cost" field). At 299 kr the pencil nets ~172 kr
    // before shipping after 25% VAT and Stripe fees.
    price: 299,
  },
}
