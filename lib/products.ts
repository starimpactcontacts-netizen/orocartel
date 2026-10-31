import 'server-only'
import { wixConfigured, wixFetch } from './wix'
import { catalog, type Shade } from './catalog'

export type Product = {
  id: string // Wix product id
  variantId: string // default variant, used for cart/checkout
  slug: string
  name: string
  price: number
  formattedPrice: string
  currency: string
  image: string
  images: string[]
  descriptionHtml: string
  inStock: boolean
  tagline?: string
  badge?: string
  summary?: string
  slides: { src: string; fill?: boolean; ram?: string }[] // product page gallery
  shade?: Shade
  shades: { name: string; hex: string; slug: string }[] // every shade in the family, incl. this one
  sections: { title: string; html: string }[] // PRODUCT DETAILS, HOW TO USE, INGREDIENTS AND SAFETY
}

type WixMedia = { image?: { url?: string } }
type WixProduct = {
  id: string
  name: string
  slug: string
  visible?: boolean
  plainDescription?: string
  currency?: string
  media?: { main?: WixMedia; itemsInfo?: { items?: WixMedia[] } }
  actualPriceRange?: { minValue?: { amount?: string; formattedAmount?: string } }
  inventory?: { availabilityStatus?: string }
}
type WixInventoryItem = { productId: string; variantId: string; inStock?: boolean; availabilityStatus?: string }

// Allow only simple formatting tags from the Wix description.
function cleanHtml(html: string) {
  return html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/<(?!\/?(h2|h3|p|ul|ol|li|strong|em|b|i|br)\b)[^>]*>/gi, '')
}

// Wix descriptions come as <h2>Heading</h2> blocks; index them by heading.
function splitSections(html: string) {
  const out: Record<string, string> = {}
  const parts = html.split(/<h2>(.*?)<\/h2>/i)
  for (let i = 1; i < parts.length; i += 2) out[parts[i].trim().toLowerCase()] = parts[i + 1].trim()
  return out
}

const plain = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

function buildSections(html: string, o: { detailsHtml?: string }) {
  const s = splitSections(html)
  const details = o.detailsHtml ?? [s.description, s.benefits && `<h3>Benefits</h3>${s.benefits}`].filter(Boolean).join('')
  const sections = [
    { title: 'Product details', html: details || html },
    { title: 'How to use', html: s.application ?? s['how to use'] ?? '' },
    {
      title: 'Ingredients and safety',
      html: s.ingredients
        ? `${s.ingredients}<p class="note">Ingredient lists can change from time to time. Please refer to the list on the package you receive for the most up-to-date information.</p>`
        : '',
    },
  ]
  return { sections: sections.filter((x) => x.html), firstSentence: plain(s.description ?? '').split(/(?<=\.)\s/)[0] }
}

const sizeImage = (url: string, w = 1200) =>
  url.includes('static.wixstatic.com/media/') ? `${url}/v1/fit/w_${w},h_${w},q_90/file.webp` : url

export async function getProducts(): Promise<Product[]> {
  if (!wixConfigured()) return []
  try {
    const [{ products }, { inventoryItems }] = await Promise.all([
      wixFetch<{ products?: WixProduct[] }>('/stores/v3/products/query', {
        body: {
          query: { cursorPaging: { limit: 100 } },
          fields: ['CURRENCY', 'PLAIN_DESCRIPTION', 'MEDIA_ITEMS_INFO'],
        },
      }),
      wixFetch<{ inventoryItems?: WixInventoryItem[] }>('/stores/v3/inventory-items/query', {
        body: { query: { cursorPaging: { limit: 1000 } } },
      }).catch((e) => {
        // Stock detail is optional: fall back to each product's own availability.
        console.error('inventory query failed', e)
        return { inventoryItems: [] as WixInventoryItem[] }
      }),
    ])
    const inv = new Map<string, WixInventoryItem[]>()
    for (const i of inventoryItems ?? []) inv.set(i.productId, [...(inv.get(i.productId) ?? []), i])

    return (products ?? [])
      .filter((p) => p.visible !== false)
      .map((p) => {
        const items = inv.get(p.id) ?? []
        const stocked = items.find((i) => i.inStock) ?? items[0]
        const images = [p.media?.main, ...(p.media?.itemsInfo?.items ?? [])]
          .map((m) => m?.image?.url)
          .filter((u, i, a): u is string => !!u && a.indexOf(u) === i)
        const min = p.actualPriceRange?.minValue
        const o = catalog[p.slug] ?? {}
        const fromWix = images.map((u) => sizeImage(u))
        const slides = o.gallery
          ? o.gallery
              .map((g) => ('connector' in g ? { ...g, src: fromWix[g.connector] } : g))
              .filter((g): g is { src: string; fill?: boolean; ram?: 'white-left' | 'black-left' } => !!g.src)
              .map(({ src, fill, ram }) => ({ src, fill, ram }))
          : [...(o.images ?? []), ...(o.hideConnectorImages ? [] : fromWix)].map((src) => ({ src }))
        const gallery = slides.map((s) => s.src)
        return {
          id: p.id,
          variantId: stocked?.variantId ?? '',
          slug: o.slug ?? p.slug,
          name: o.name ?? p.name,
          price: o.price ?? Number(min?.amount ?? 0),
          formattedPrice:
            o.price !== undefined
              ? `${o.price.toLocaleString('sv-SE')} kr`
              : (min?.formattedAmount ?? '').replace(/(\d)kr$/, '$1 kr'),
          currency: p.currency ?? 'SEK',
          image: gallery[0] ?? '',
          images: gallery,
          slides,
          shade: o.shade,
          shades: [] as Product['shades'],
          descriptionHtml: cleanHtml(p.plainDescription ?? ''),
          tagline: o.tagline,
          badge: o.badge,
          ...(() => {
            const b = buildSections(cleanHtml(p.plainDescription ?? ''), o)
            return { sections: b.sections, summary: o.summary ?? b.firstSentence }
          })(),
          inStock: items.length ? items.some((i) => i.inStock) : p.inventory?.availabilityStatus !== 'OUT_OF_STOCK',
        }
      })
      .map((p, _i, all) => ({
        ...p,
        shades: p.shade
          ? all
              .filter((x) => x.shade?.family === p.shade!.family)
              .map((x) => ({ name: x.shade!.name, hex: x.shade!.hex, slug: x.slug }))
          : [],
      }))
  } catch (e) {
    console.error('getProducts failed', e)
    return []
  }
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug)
}
