import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { collections } from '@/data/collections'

export const metadata: Metadata = {
  title: 'Collections | Dastaan',
  description: 'Browse curated olfactory collections and seasonal editions from Dastaan.',
}

export default function CollectionsPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      <div className="border-b border-hairline pb-8">
        <Breadcrumbs items={[{ label: 'Collections' }]} />
        <p className="label-caps text-ink/55">Olfactory Chapters</p>
        <h1 className="mt-2 font-heading text-4xl font-normal text-ink md:text-5xl">
          Curated Collections
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
          Explore the House of Dastaan through our signature scent families, seasonal archives,
          and intimate body rituals.
        </p>
      </div>

      <section
        aria-label="Fragrance collections"
        className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10"
      >
        {collections.map((collection) => (
          <article key={collection.slug} className="group flex flex-col text-center">
            <Link
              href={`/collections/${collection.slug}`}
              className="relative aspect-[1.25/1] w-full overflow-hidden bg-tile focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Image
                src={collection.heroImage}
                alt={collection.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </Link>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {collection.notes.map((note) => (
                <span
                  key={note}
                  className="label-caps border border-hairline bg-cream/40 px-2.5 py-1 text-[10px] text-ink/70"
                >
                  {note}
                </span>
              ))}
            </div>
            <h2 className="mt-4 font-display text-[clamp(1.35rem,2vw,2rem)] leading-tight text-ink">
              {collection.title}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
              {collection.subtitle}
            </p>
            <div className="mt-4">
              <Link href={`/collections/${collection.slug}`} className="link-underline">
                Shop selection
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
