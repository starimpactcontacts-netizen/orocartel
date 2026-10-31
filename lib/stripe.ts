import 'server-only'
import Stripe from 'stripe'

// STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET live in Vercel env vars only.
export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY)

let client: Stripe | null = null
export function stripe() {
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  return client
}

// Countries we ship to; Blanka handles fulfilment from Wix.
export const SHIP_TO: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] = [
  'SE', 'NO', 'DK', 'FI', 'DE', 'NL', 'BE', 'FR', 'ES', 'IT', 'AT', 'PL', 'IE', 'GB', 'US', 'CA',
]
