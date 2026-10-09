import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | Dastaan',
  description: 'Complete your luxury fragrance order with the House of Dastaan.',
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
