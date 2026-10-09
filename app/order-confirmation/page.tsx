import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: 'Order Confirmation | Dastaan',
  description: 'Thank you for your order with the House of Dastaan.',
}

export default function OrderConfirmationPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'Order Confirmation' }]}
        title="Thank You for Your Order"
        subtitle="Your fragrance order has been received and is being prepared with care at our atelier."
      >
        <div className="flex flex-wrap gap-6">
          <Link href="/account" className="link-underline">
            View order status
          </Link>
          <Link href="/shop" className="link-underline">
            Continue shopping
          </Link>
        </div>
      </PageHero>
    </main>
  )
}
