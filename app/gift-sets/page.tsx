import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { GiftSetCard } from '@/components/gift-sets/gift-set-card'
import { getProducts } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Gift Sets | Dastaan',
  description:
    'Discover luxury perfume coffrets, discovery sets, and bespoke gifting from the House of Dastaan.',
}

export default function GiftSetsPage() {
  const giftSets = getProducts({ category: 'gift-set' }, 'featured')

  return (
    <main className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      {/* Editorial Intro */}
      <section className="border-b border-hairline pb-10">
        <Breadcrumbs items={[{ label: 'Gift Sets' }]} />
        <p className="label-caps text-ink/55">The Art of Gifting</p>
        <h1 className="mt-2 font-heading text-4xl font-normal leading-tight text-ink md:text-5xl">
          Luxury Coffrets &amp; Discovery Sets
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
          Thoughtfully composed fragrance wardrobes, layering duos, and travel extraits housed
          in custom archival keepsake boxes—crafted to turn every gesture into an enduring memory.
        </p>
      </section>

      {/* Complimentary Gift-Wrap Note */}
      <section
        aria-label="Complimentary gift presentation"
        className="mt-8 border border-hairline bg-cream p-6 md:flex md:items-center md:justify-between md:p-8"
      >
        <div className="max-w-2xl">
          <p className="label-caps text-ink">Complimentary Signature Gift Wrapping</p>
          <p className="mt-2 text-xs leading-relaxed text-ink/70">
            Every Dastaan gift set arrives hand-wrapped in pleated cream linen paper, bound with
            our grosgrain ink ribbon, and accompanied by a wax-sealed calligraphy card and two
            complimentary 2 ml sample vials of your choice.
          </p>
        </div>
        <div className="mt-4 shrink-0 md:mt-0">
          <Link href="/shipping-returns" className="link-underline">
            Gifting &amp; delivery details
          </Link>
        </div>
      </section>

      {/* Gift Sets Grid */}
      <section aria-label="Gift sets catalog" className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
        {giftSets.map((setProduct) => (
          <GiftSetCard key={setProduct.id} product={setProduct} />
        ))}
      </section>
    </main>
  )
}
