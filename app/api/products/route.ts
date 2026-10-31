import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'

export const revalidate = 60

// Lightweight list for client-side search.
export async function GET() {
  const products = await getProducts()
  return NextResponse.json(
    products.map(({ slug, name, image, formattedPrice, inStock }) => ({ slug, name, image, formattedPrice, inStock })),
  )
}
