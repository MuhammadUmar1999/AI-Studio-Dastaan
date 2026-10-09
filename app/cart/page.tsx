import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: 'Shopping Bag | Dastaan',
  description: 'Review the fragrances in your Dastaan shopping bag before proceeding to checkout.',
}

export default function CartPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'Shopping Bag' }]}
        title="Your Shopping Bag"
        subtitle="Review your selected fragrances, complimentary samples, and delivery options."
      >
        <div className="flex flex-wrap gap-6">
          <Link href="/checkout" className="link-underline">
            Proceed to checkout
          </Link>
          <Link href="/shop" className="link-underline">
            Continue shopping
          </Link>
        </div>
      </PageHero>
    </main>
  )
}
