// Our own merchandising on top of the Blanka/Wix feed. Stock and orders
// still come from the connector; anything set here wins on orocartel.com.
// Key = the Wix product slug.
// One gallery picture. `connector: n` = Blanka's n-th photo from Wix.
// fill: photo covers the whole square (campaign shots) instead of sitting on grey.
// ram: Orocartel ram in a bottom corner.
export type Slide =
  | { src: string; fill?: boolean; ram?: 'white-left' | 'black-left' }
  | { connector: number; fill?: boolean; ram?: 'white-left' | 'black-left' }

// Shades of one product line share a `family`; each product is one shade.
export type Shade = { family: string; name: string; hex: string }

export type CatalogOverride = {
  slug?: string // our URL: /products/<slug>
  name?: string
  images?: string[] // shown first, from /public
  hideConnectorImages?: boolean // drop Blanka's stock photos entirely
  gallery?: Slide[] // exact picture order; overrides images/hideConnectorImages
  shade?: Shade
  price?: number // kr incl. VAT, overrides the Wix price
  tagline?: string // one line under the name on product tiles
  summary?: string // SUMMARY line on the product page
  detailsHtml?: string // replaces the PRODUCT DETAILS section from the connector
  badge?: string // small label on the tile, e.g. NEW
}

// CABRÓN Kohl: one product per shade in Blanka/Wix ("Khol Eyeliner - <Shade>",
// slug khol-eyeliner-<shade>). We sell Black only; add a shade here to sell another.
const kohlShades = [{ key: 'black', name: 'Black', code: 'K-1', hex: '#141414' }]

const kohlDetails = (shade: string, code: string) =>
  `<h3>Key Details</h3><p>Shade: ${shade} ${code}<br>Net wt. 1.1 g / 0.04 oz<br>Made in USA</p>` +
  '<p>Whether you want a precise line or a smoked-out one, this pencil does both. The creamy formula glides on without tugging along the lash line or waterline, and can be layered with shadow. Long-wearing and comfortable from morning to after dark.</p>' +
  '<h3>Benefits</h3><ul><li>Creamy texture for blending and smudging</li><li>Intense pigment that lasts all day</li><li>Gentle formula for easy application</li></ul>'

const kohl: Record<string, CatalogOverride> = Object.fromEntries(
  kohlShades.map((s) => [
    `khol-eyeliner-${s.key}`,
    {
      slug: s.key === 'black' ? 'cabron-kohl-eye-pencil' : `cabron-kohl-eye-pencil-${s.key}`,
      name: 'CABRÓN Kohl Eye Pencil',
      // Blanka cost 66,82 kr (Wix "cost" field). At 299 kr the pencil nets ~172 kr
      // before shipping after 25% VAT and Stripe fees.
      price: 299,
      tagline: 'A Creamy Kohl Eye Pencil.',
      summary: `A creamy ${s.name.toLowerCase()} kohl pencil for the lash line and waterline.`,
      detailsHtml: kohlDetails(s.name, s.code),
      badge: 'New',
      shade: { family: 'cabron-kohl', name: s.name, hex: s.hex },
      ...(s.key === 'black'
        ? {
            gallery: [
              { src: '/products/cabron-kohl.jpg' },
              { connector: 0 }, // the pencil on its own (Blanka's #1 is the shade-swatch arm, left out)
              { src: '/products/cabron-eyes.jpg', fill: true, ram: 'white-left' },
            ] as Slide[],
          }
        : {}),
    },
  ]),
)

export const catalog: Record<string, CatalogOverride> = {
  ...kohl,
}
