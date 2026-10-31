import 'server-only'
import { wixConfigured, wixFetch } from './wix'
import { catalog } from './catalog'

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
        const gallery = [...(o.images ?? []), ...(o.hideConnectorImages ? [] : images.map((u) => sizeImage(u)))]
        return {
          id: p.id,
          variantId: stocked?.variantId ?? '',
          slug: o.slug ?? p.slug,
          name: o.name ?? p.name,
          price: Number(min?.amount ?? 0),
          formattedPrice: (min?.formattedAmount ?? '').replace(/(\d)kr$/, '$1 kr'),
          currency: p.currency ?? 'SEK',
          image: gallery[0] ?? '',
          images: gallery,
          descriptionHtml: cleanHtml(p.plainDescription ?? ''),
          inStock: items.length ? items.some((i) => i.inStock) : p.inventory?.availabilityStatus !== 'OUT_OF_STOCK',
        }
      })
  } catch (e) {
    console.error('getProducts failed', e)
    return []
  }
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug)
}
