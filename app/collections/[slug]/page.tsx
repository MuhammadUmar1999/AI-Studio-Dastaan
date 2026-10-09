import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { CollectionProductGrid } from '@/components/collections/collection-product-grid'
import { collections } from '@/data/collections'
import { getCollection } from '@/lib/catalog'

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) {
    return {
      title: 'Collection Not Found | Dastaan',
      description: 'The requested Dastaan fragrance collection could not be found.',
    }
  }

  return {
    title: `${collection.title} | Dastaan`,
    description: collection.subtitle,
    openGraph: {
      title: `${collection.title} | Dastaan`,
      description: collection.subtitle,
      images: [{ url: collection.heroImage, alt: collection.title }],
    },
  }
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) notFound()

  return (
    <main className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      <Breadcrumbs
        items={[
          { label: 'Collections', href: '/collections' },
          { label: collection.title },
        ]}
      />

      {/* Hero + Story */}
      <section className="grid items-center gap-8 border-b border-hairline pb-12 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        <div>
          <p className="label-caps text-ink/55">Collection</p>
          <h1 className="mt-3 font-heading text-4xl font-normal leading-tight text-ink md:text-5xl">
            {collection.title}
          </h1>
          <p className="mt-3 font-heading text-xl font-light text-ink/75">
            {collection.subtitle}
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/65">
            {collection.story}
          </p>

          {/* Olfactory Notes Row */}
          <div className="mt-8">
            <p className="label-caps text-ink/55">Signature Olfactory Notes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {collection.notes.map((note) => (
                <span
                  key={note}
                  className="label-caps border border-hairline bg-cream/60 px-3 py-1.5 text-[10px] text-ink"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-tile">
          <Image
            src={collection.heroImage}
            alt={collection.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </section>

      <CollectionProductGrid collectionSlug={collection.slug} />
    </main>
  )
}
