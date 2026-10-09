import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchClient } from '@/components/search/search-client'

export const metadata: Metadata = {
  title: 'Search | Dastaan',
  description:
    'Search the House of Dastaan catalog of fine fragrances, curated collections, and editorial stories.',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const initialQuery = q?.trim() ?? ''

  return (
    <main>
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1440px] px-3 py-16 sm:px-4">
            <div className="h-10 w-64 animate-pulse bg-tile/60" />
            <div className="mt-6 h-12 max-w-2xl animate-pulse bg-tile/60" />
          </div>
        }
      >
        <SearchClient initialQuery={initialQuery} />
      </Suspense>
    </main>
  )
}
