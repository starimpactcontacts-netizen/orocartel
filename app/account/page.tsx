import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AccountView from '@/components/account/AccountView'

export const metadata: Metadata = { title: 'Account', robots: { index: false, follow: false } }

export default function AccountPage() {
  return (
    <>
      <Header />
      <AccountView />
      <Footer />
    </>
  )
}
