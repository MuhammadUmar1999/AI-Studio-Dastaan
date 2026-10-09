import type { Metadata } from 'next'
import { CartClient } from '@/components/cart/cart-client'

export const metadata: Metadata = {
  title: 'Shopping Bag | Dastaan',
  description:
    'Review the fragrances in your Dastaan shopping bag, select a complimentary sample, and proceed to checkout.',
}

export default function CartPage() {
  return (
    <main>
      <CartClient />
    </main>
  )
}

