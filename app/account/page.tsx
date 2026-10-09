import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AccountClient } from '@/components/account/account-client'

export const metadata: Metadata = {
  title: 'Account | Dastaan',
  description: 'Manage your Dastaan profile, saved addresses, orders, and fragrance wishlist.',
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; redirect?: string }>
}) {
  const { tab, redirect } = await searchParams

  return (
    <main>
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1440px] px-3 py-16 sm:px-4">
            <div className="mx-auto h-96 max-w-4xl animate-pulse bg-tile/60" />
          </div>
        }
      >
        <AccountClient initialTab={tab} initialRedirect={redirect} />
      </Suspense>
    </main>
  )
}

