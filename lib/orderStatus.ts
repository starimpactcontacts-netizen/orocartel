import 'server-only'
import type Stripe from 'stripe'
import { stripe } from './stripe'
import { wixFetch } from './wix'
import { getProducts } from './products'
import { decodeLines } from './order'

export type OrderView = {
  ref: string
  placedAt: string
  stage: 'payment' | 'confirmed' | 'production' | 'shipped'
  lines: { name: string; quantity: number; total: number }[]
  shipping: number
  discount: number
  total: number
  shipTo: string | null
  tracking: { number?: string; carrier?: string; url?: string }[]
}

type WixFulfillment = { trackingInfo?: { trackingNumber?: string; shippingProvider?: string; trackingLink?: string } }

// One order as the customer sees it: Stripe has the payment, Wix (via Blanka)
// has production and shipping, including tracking once the parcel leaves.
export async function viewOrder(pi: Stripe.PaymentIntent): Promise<OrderView> {
  const products = await getProducts()
  const wixId = pi.metadata.wix_order_id
  let stage: OrderView['stage'] = pi.status === 'succeeded' ? 'confirmed' : 'payment'
  let tracking: OrderView['tracking'] = []

  if (wixId) {
    stage = 'production'
    try {
      const { orderWithFulfillments } = await wixFetch<{ orderWithFulfillments?: { fulfillments?: WixFulfillment[] } }>(
        `/ecom/v1/fulfillments/orders/${wixId}`,
        { method: 'GET', revalidate: false },
      )
      tracking = (orderWithFulfillments?.fulfillments ?? [])
        .map((f) => f.trackingInfo)
        .filter((t): t is NonNullable<typeof t> => !!t)
        .map((t) => ({ number: t.trackingNumber, carrier: t.shippingProvider, url: t.trackingLink }))
      if (tracking.length) stage = 'shipped'
    } catch (e) {
      console.error('Wix fulfillment lookup failed', wixId, e)
    }
  }

  const a = pi.shipping?.address
  return {
    ref: pi.metadata.ref ?? pi.id.slice(-8).toUpperCase(),
    placedAt: new Date(pi.created * 1000).toISOString(),
    stage,
    lines: decodeLines(pi.metadata.items ?? '').map((l) => ({
      name: products.find((p) => p.id === l.productId)?.name ?? 'Orocartel product',
      quantity: l.quantity,
      total: l.unitPrice * l.quantity,
    })),
    shipping: Number(pi.metadata.shipping ?? 0),
    discount: Number(pi.metadata.discount ?? 0),
    total: pi.amount / 100,
    shipTo: a ? [a.city, a.country].filter(Boolean).join(', ') : null,
    tracking,
  }
}

// Paid or processing Orocartel orders matching a Stripe search query.
export async function findOrders(query: string, limit = 20) {
  const res = await stripe().paymentIntents.search({
    query: `metadata['store']:'orocartel' AND metadata['flow']:'elements' AND ${query}`,
    limit,
  })
  return res.data.filter((pi) => pi.status === 'succeeded' || pi.status === 'processing')
}

// Stripe search syntax: quotes and backslashes must be escaped inside values.
export const q = (v: string) => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
