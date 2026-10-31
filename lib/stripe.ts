import 'server-only'
import Stripe from 'stripe'

// STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET live in Vercel env vars only.
export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY)

let client: Stripe | null = null
export function stripe() {
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  return client
}

export { SHIP_TO } from './shipping'
