import type { Metadata } from 'next'
import { Suspense } from 'react'
import {
  parseShopParams,
  ShopClient,
  ShopSkeleton,
} from '@/components/shop/shop-client'

export const metadata: Metadata = {
  title: 'Shop | Dastaan',
  description:
    'Explore the complete collection of Dastaan luxury perfumes, body mists, and gift sets.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    maxPrice?: string
    volume?: string
    scent?: string
    sort?: string
    page?: string
  }>
}) {
  const resolvedParams = await searchParams
  const initialState = parseShopParams(resolvedParams)

  return (
    <main>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopClient initialState={initialState} />
      </Suspense>
    </main>
  )
}
