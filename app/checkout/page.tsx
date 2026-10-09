import type { Metadata } from 'next'
import { CheckoutClient } from '@/components/checkout/checkout-client'

export const metadata: Metadata = {
  title: 'Checkout | Dastaan',
  description:
    'Complete your Dastaan fragrance order with complimentary sample selection and insured courier delivery.',
}

export default function CheckoutPage() {
  return (
    <main>
      <CheckoutClient />
    </main>
  )
}

