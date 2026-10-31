import 'server-only'
import { randomInt } from 'crypto'
import { getProducts, type Product } from './products'
import { shippingFor } from './shipping'

export type CartLine = { productId?: unknown; quantity?: unknown }
export type PricedLine = { product: Product; quantity: number }

// Re-prices a bag against the live catalogue. The browser only says *what* and
// *how many*; every price and the shipping fee are decided here.
export async function priceBag(lines: CartLine[]) {
  const products = await getProducts()
  const merged = new Map<string, number>()
  for (const l of lines ?? []) {
    const id = typeof l.productId === 'string' ? l.productId : ''
    const qty = Math.max(1, Math.min(10, Math.floor(Number(l.quantity) || 1)))
    if (id) merged.set(id, Math.min(10, (merged.get(id) ?? 0) + qty))
  }
  const priced: PricedLine[] = []
  for (const [id, quantity] of merged) {
    const product = products.find((p) => p.id === id)
    if (product && product.inStock && product.price > 0 && product.variantId) priced.push({ product, quantity })
  }
  const lines5 = priced.slice(0, 5) // keeps the order inside Stripe's metadata limits
  const subtotal = lines5.reduce((n, l) => n + l.product.price * l.quantity, 0)
  const shipping = lines5.length ? shippingFor(subtotal) : 0
  return { lines: lines5, subtotal, shipping, total: subtotal + shipping }
}

// Compact order record stored on the PaymentIntent: productId:variantId:qty:unitKr;...
export const encodeLines = (lines: PricedLine[]) =>
  lines.map((l) => `${l.product.id}:${l.product.variantId}:${l.quantity}:${l.product.price}`).join(';')

export const decodeLines = (s: string) =>
  s
    .split(';')
    .filter(Boolean)
    .map((part) => {
      const [productId, variantId, qty, unit] = part.split(':')
      return { productId, variantId, quantity: Number(qty) || 1, unitPrice: Number(unit) || 0 }
    })

// Customer-facing order number, e.g. 7KQ2M9XA (no 0/O/1/I to avoid mix-ups).
export function newOrderRef() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => abc[randomInt(abc.length)]).join('')
}

export const normaliseRef = (s: string) => s.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8)
export const normaliseEmail = (s: string) => s.trim().toLowerCase().slice(0, 200)
