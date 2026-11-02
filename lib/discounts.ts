// Discount codes for the checkout. Codes are matched case-insensitively and only
// ever applied on the server. `percent` comes off the products, not shipping.
export type Discount = { code: string; percent: number; active: boolean }

export const discounts: Discount[] = [
  { code: 'JACK', percent: 15, active: true }, // TikTok pirate campaign
]

export function findDiscount(input: unknown): Discount | null {
  if (typeof input !== 'string') return null
  const code = input.trim().toUpperCase()
  return discounts.find((d) => d.active && d.code === code) ?? null
}
