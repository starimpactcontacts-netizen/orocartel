import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrackOrder from '@/components/account/TrackOrder'

export const metadata: Metadata = {
  title: 'Track your order',
  description: 'Track your Orocartel order with your order number and email.',
}

export default function TrackPage() {
  return (
    <>
      <Header />
      <Suspense>
        <TrackOrder />
      </Suspense>
      <Footer />
    </>
  )
}
