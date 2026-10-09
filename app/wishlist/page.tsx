import type { Metadata } from 'next'
import { WishlistClient } from '@/components/wishlist/wishlist-client'

export const metadata: Metadata = {
  title: 'Wishlist | Dastaan',
  description: 'View and manage your saved Dastaan perfumes and gift sets.',
}

export default function WishlistPage() {
  return (
    <main>
      <WishlistClient />
    </main>
  )
}

