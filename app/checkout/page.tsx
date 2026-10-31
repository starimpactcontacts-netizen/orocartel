import type { Metadata } from 'next'
import { Suspense } from 'react'
import Checkout from '@/components/checkout/Checkout'

export const metadata: Metadata = { title: 'Checkout', robots: { index: false, follow: false } }

export default function CheckoutPage() {
  return (
    <Suspense>
      <Checkout />
    </Suspense>
  )
}
