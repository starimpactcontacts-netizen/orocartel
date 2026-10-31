import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'
import { getProducts } from '@/lib/products'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (site.comingSoon) return [{ url: site.url, changeFrequency: 'daily', priority: 1 }]
  const products = await getProducts()
  return [
    { url: site.url, changeFrequency: 'daily', priority: 1 },
    ...products.map((p) => ({ url: `${site.url}/products/${p.slug}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    { url: `${site.url}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${site.url}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
