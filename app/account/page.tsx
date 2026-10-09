import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: 'Account | Dastaan',
  description: 'Manage your Dastaan profile, saved addresses, orders, and fragrance wishlist.',
}

export default function AccountPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'Account' }]}
        eyebrow="Account"
        title="Your Dastaan account"
        subtitle="Account access is coming soon. Browse the collection while we prepare your private space."
      >
        <div className="flex flex-wrap gap-6">
          <Link href="/shop" className="link-underline">
            Explore the collection
          </Link>
          <Link href="/" className="link-underline">
            Return home
          </Link>
        </div>
      </PageHero>
    </main>
  )
}
