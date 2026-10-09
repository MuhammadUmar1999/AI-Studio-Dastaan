import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'
import { ShippingClient } from '@/components/shipping/shipping-client'

export const metadata: Metadata = {
  title: 'Shipping & Returns | Dastaan',
  description:
    'Information on Dastaan complimentary delivery tiers, international customs, and our 14-day return policy.',
}

export default function ShippingReturnsPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'Shipping & Returns' }]}
        eyebrow="Client Services"
        title="Shipping & Returns"
        subtitle="Complimentary standard delivery on orders of $150 or more, accompanied by our try-before-unsealing sample ritual and 14-day return privilege."
      />
      <ShippingClient />
    </main>
  )
}
