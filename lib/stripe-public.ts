// Publishable key: safe to ship to the browser (it can only start payments,
// never read or move money). Override with NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_51QOW3uKjAots5bShyK8svrgARPzmwlwdRM86oTD1pXYH9Kp0dvUyVUjUGPsHZrZqYLvbGkpEoUHrGKyuLgcqcns50061vq81Z3'
