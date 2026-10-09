import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: 'Wishlist | Dastaan',
  description: 'View and manage your saved Dastaan perfumes and gift sets.',
}

export default function WishlistPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'Wishlist' }]}
        title="Saved Fragrances"
        subtitle="Your personal curation of Dastaan perfumes kept ready for your next ritual."
      >
        <Link href="/shop" className="link-underline">
          Explore the collection
        </Link>
      </PageHero>
    </main>
  )
}
