// Our own merchandising on top of the Blanka/Wix feed. Stock and orders
// still come from the connector; anything set here wins on orocartel.com.
// Key = the Wix product slug.
export type CatalogOverride = {
  slug?: string // our URL: /products/<slug>
  name?: string
  images?: string[] // shown first, from /public
  hideConnectorImages?: boolean // drop Blanka's stock photos entirely
  price?: number // kr incl. VAT, overrides the Wix price
  tagline?: string // one line under the name on product tiles
  summary?: string // SUMMARY line on the product page
  detailsHtml?: string // replaces the PRODUCT DETAILS section from the connector
  badge?: string // small label on the tile, e.g. NEW
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
    tagline: 'A Creamy Kohl Eye Pencil.',
    summary: 'A creamy black kohl pencil for the lash line and waterline.',
    detailsHtml:
      '<h3>Key Details</h3><p>Shade: Black K-1<br>Net wt. 1.1 g / 0.04 oz<br>Made in USA</p>' +
      '<p>Whether you want a precise line or a smoked-out one, this pencil does both. The creamy formula glides on without tugging along the lash line or waterline, and can be layered with shadow. Long-wearing and comfortable from morning to after dark.</p>' +
      '<h3>Benefits</h3><ul><li>Creamy texture for blending and smudging</li><li>Intense black pigment that lasts all day</li><li>Gentle formula for easy application</li></ul>',
    badge: 'New',
  },
}
