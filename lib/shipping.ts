// One shipping rule for the whole store, used by the bag, the product page and checkout.
// Blanka ships each order from North America, so a flat fee covers their per-order
// shipping charge; larger baskets carry enough margin to ship free.
export const shipping = {
  fee: 69, // kr per order
  freeFrom: 699, // kr subtotal (VAT included)
}

export const shippingFor = (subtotal: number) => (subtotal >= shipping.freeFrom ? 0 : shipping.fee)
