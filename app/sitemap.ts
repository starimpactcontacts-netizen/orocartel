import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'
import { products } from '@/lib/products'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: 'daily', priority: 1 },
    ...products.map((p) => ({ url: `${site.url}/products/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    { url: `${site.url}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
