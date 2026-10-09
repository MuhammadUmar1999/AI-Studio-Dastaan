import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { JournalClient } from '@/components/journal/journal-client'

export const metadata: Metadata = {
  title: 'Journal | Dastaan',
  description:
    'Editorial stories, perfumery essays, and botanical field dispatches from the House of Dastaan.',
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  return (
    <main>
      <section className="mx-auto max-w-[1440px] px-3 pb-8 pt-10 sm:px-4 md:pt-16">
        <Breadcrumbs items={[{ label: 'Journal' }]} />
        <p className="label-caps text-ink/55">Editorial Dispatches</p>
        <h1 className="mt-2 font-heading text-4xl font-normal leading-tight text-ink md:text-5xl">
          The Dastaan Journal
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
          Notes from our perfumers, botanical field dispatches, and conversations on memory,
          architecture, and scent.
        </p>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4">
            <div className="h-96 w-full animate-pulse bg-tile/60" />
          </div>
        }
      >
        <JournalClient initialCategory={category ?? 'All'} />
      </Suspense>
    </main>
  )
}
