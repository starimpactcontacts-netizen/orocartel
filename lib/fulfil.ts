import 'server-only'
import type Stripe from 'stripe'
import { stripe } from './stripe'
import { WIX_STORES_APP_ID, wixFetch } from './wix'
import { getProducts } from './products'
import { decodeLines } from './order'

type Addr = Stripe.Address | null | undefined

const wixAddress = (a: Addr) => ({
  country: a?.country ?? undefined,
  subdivision: a?.state || undefined,
  city: a?.city ?? undefined,
  postalCode: a?.postal_code ?? undefined,
  addressLine1: a?.line1 ?? undefined,
  addressLine2: a?.line2 || undefined,
})

const contact = (name: string | null | undefined, phone: string | null | undefined) => {
  const parts = (name ?? '').trim().split(/\s+/)
  return {
    firstName: parts[0] || 'Customer',
    lastName: parts.slice(1).join(' ') || undefined,
    phone: phone || undefined,
  }
}

const amt = (minor: number | null | undefined) => ({ amount: ((minor ?? 0) / 100).toFixed(2) })

// Turns a paid Stripe Checkout session into a paid Wix order, which Blanka fulfils.
// Safe to call more than once: the Wix order id is stored on the PaymentIntent.
export async function fulfilSession(sessionId: string): Promise<string | null> {
  const s = await stripe().checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price.product', 'payment_intent'],
  })
  // Same Stripe account serves other brands: only touch Orocartel sessions.
  if (s.metadata?.store !== 'orocartel' || s.payment_status !== 'paid') return null

  const pi = s.payment_intent as Stripe.PaymentIntent | null
  if (pi?.metadata?.wix_order_id) return pi.metadata.wix_order_id

  // Stripe moved shipping details in newer API versions; accept either.
  const ship =
    (s as unknown as { collected_information?: { shipping_details?: Stripe.Checkout.Session.ShippingDetails } })
      .collected_information?.shipping_details ?? s.shipping_details
  const cust = s.customer_details
  const shipContact = contact(ship?.name ?? cust?.name, cust?.phone)

  const lineItems = (s.line_items?.data ?? []).map((li) => {
    const product = li.price?.product as Stripe.Product
    const unit = (li.amount_total ?? 0) / Math.max(1, li.quantity ?? 1)
    return {
      quantity: li.quantity ?? 1,
      catalogReference: {
        catalogItemId: product.metadata.wix_product_id,
        appId: WIX_STORES_APP_ID,
        options: { variantId: product.metadata.wix_variant_id },
      },
      productName: { original: product.name },
      itemType: { preset: 'PHYSICAL' },
      price: amt(unit),
      taxDetails: { taxRate: '0', totalTax: amt(0) },
    }
  })
  if (!lineItems.length || lineItems.some((l) => !l.catalogReference.catalogItemId)) {
    throw new Error(`Session ${sessionId} has no Wix line items`)
  }

  const shippingMinor = s.shipping_cost?.amount_total ?? s.total_details?.amount_shipping ?? 0
  const { order } = await wixFetch<{ order: { id: string; number?: string } }>('/ecom/v1/orders', {
    revalidate: false,
    body: {
      order: {
        channelInfo: { type: 'WEB' },
        currency: 'SEK',
        taxIncludedInPrices: true,
        paymentStatus: 'PAID',
        lineItems,
        buyerInfo: { email: cust?.email ?? undefined },
        billingInfo: {
          address: wixAddress(cust?.address ?? ship?.address),
          contactDetails: contact(cust?.name, cust?.phone),
        },
        shippingInfo: {
          title: shippingMinor ? 'Standard shipping' : 'Free shipping',
          logistics: {
            shippingDestination: { address: wixAddress(ship?.address), contactDetails: shipContact },
          },
          cost: { price: amt(shippingMinor) },
        },
        priceSummary: {
          subtotal: amt(s.amount_subtotal),
          shipping: amt(shippingMinor),
          tax: amt(0),
          discount: amt(s.total_details?.amount_discount),
          total: amt(s.amount_total),
        },
        buyerNote: `Paid with Stripe · ${pi?.id ?? sessionId}`,
      },
    },
  })

  if (pi) await stripe().paymentIntents.update(pi.id, { metadata: { wix_order_id: order.id } })
  console.log('Wix order created', order.number ?? order.id, 'for', sessionId)
  return order.id
}

// Our own checkout (/checkout): a succeeded PaymentIntent carrying the order in
// its metadata becomes a paid Wix order. Idempotent via metadata.wix_order_id.
export async function fulfilPaymentIntent(id: string): Promise<string | null> {
  const pi = await stripe().paymentIntents.retrieve(id, { expand: ['latest_charge'] })
  if (pi.metadata?.store !== 'orocartel' || pi.metadata?.flow !== 'elements' || pi.status !== 'succeeded') return null
  if (pi.metadata.wix_order_id) return pi.metadata.wix_order_id

  const lines = decodeLines(pi.metadata.items ?? '')
  if (!lines.length) throw new Error(`PaymentIntent ${id} has no order lines`)
  const products = await getProducts()

  const charge = pi.latest_charge as Stripe.Charge | null
  const bill = charge?.billing_details
  const ship = pi.shipping
  const email = pi.receipt_email ?? bill?.email ?? undefined
  const shippingKr = Number(pi.metadata.shipping ?? 0)
  const subtotalKr = Number(pi.metadata.subtotal ?? 0)
  const discountKr = Number(pi.metadata.discount ?? 0)

  const lineItems = lines.map((l) => ({
    quantity: l.quantity,
    catalogReference: { catalogItemId: l.productId, appId: WIX_STORES_APP_ID, options: { variantId: l.variantId } },
    productName: { original: products.find((p) => p.id === l.productId)?.name ?? 'Orocartel product' },
    itemType: { preset: 'PHYSICAL' },
    price: { amount: l.unitPrice.toFixed(2) },
    taxDetails: { taxRate: '0', totalTax: amt(0) },
  }))

  const { order } = await wixFetch<{ order: { id: string; number?: string } }>('/ecom/v1/orders', {
    revalidate: false,
    body: {
      order: {
        channelInfo: { type: 'WEB' },
        currency: 'SEK',
        taxIncludedInPrices: true,
        paymentStatus: 'PAID',
        lineItems,
        buyerInfo: { email },
        billingInfo: {
          address: wixAddress(bill?.address ?? ship?.address),
          contactDetails: contact(bill?.name ?? ship?.name, bill?.phone ?? ship?.phone),
        },
        shippingInfo: {
          title: shippingKr ? 'Standard shipping' : 'Free shipping',
          logistics: {
            shippingDestination: {
              address: wixAddress(ship?.address),
              contactDetails: contact(ship?.name, ship?.phone),
            },
          },
          cost: { price: { amount: shippingKr.toFixed(2) } },
        },
        priceSummary: {
          subtotal: { amount: subtotalKr.toFixed(2) },
          shipping: { amount: shippingKr.toFixed(2) },
          tax: amt(0),
          discount: { amount: discountKr.toFixed(2) },
          total: amt(pi.amount_received),
        },
        buyerNote: `Paid with Stripe · ${pi.id}${pi.metadata.discount_code ? ` · code ${pi.metadata.discount_code}` : ''}`,
      },
    },
  })

  await stripe().paymentIntents.update(pi.id, { metadata: { wix_order_id: order.id } })
  console.log('Wix order created', order.number ?? order.id, 'for', pi.id)
  return order.id
}
