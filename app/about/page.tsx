import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: 'About | Dastaan',
  description:
    'Every bottle holds a story. Discover the heritage, rare botanicals, and master perfumery behind the House of Dastaan.',
}

const values = [
  {
    eyebrow: '01 · Craftsmanship',
    title: 'Small-Batch Maceration',
    copy: 'Every Dastaan creation rests for six to eight weeks in dark glass demijohns, allowing thirty botanicals to marry into a seamless, velvety sillage before hand-bottling.',
  },
  {
    eyebrow: '02 · Ingredients',
    title: 'Traceable Botanicals',
    copy: 'From three-year aged Florentine Iris Pallida to wild-harvested Andalusian labdanum and Ceylon cinnamon bark, we source directly from generational growers.',
  },
  {
    eyebrow: '03 · Sustainability',
    title: 'Conscious Architecture',
    copy: 'Our weighted crystal flacons are topped with FSC-certified European ashwood caps and housed in 100% recycled cotton-rag archival boxes free of plastic laminate.',
  },
] as const

const milestones = [
  {
    year: '2019',
    title: 'The First Accord',
    description:
      'Founded with a singular obsession: to unite the narrative depth of Eastern attars with the architectural clarity of modern French haute parfumerie.',
  },
  {
    year: '2021',
    title: 'Ashes of Moonlight Debuts',
    description:
      'After forty-seven trials in our maceration cellar, our flagship nocturnal floral-amber composition is unveiled in numbered crystal flacons.',
  },
  {
    year: '2022',
    title: 'The Gold Dust Archive',
    description:
      'Introduction of our spiced resin and aged agarwood chapter, celebrating raw Ceylon cinnamon and smoked labdanum.',
  },
  {
    year: '2024',
    title: 'Botanical Body Rituals',
    description:
      'Expansion into alcohol-free conditioning skin and hair mists formulated for multi-layered daily scent rituals.',
  },
  {
    year: '2025',
    title: 'Global Private salons',
    description:
      'Opening of our by-appointment fragrance salons and launch of the Dastaan Signature Discovery Wardrobe.',
  },
] as const

const stats = [
  { value: '6–8 wks', label: 'Cellar Maceration' },
  { value: '28%', label: 'Extrait Concentration' },
  { value: '100%', label: 'Traceable Botanicals' },
  { value: '18', label: 'Signature Creations' },
] as const

export default function AboutPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'About' }]}
        eyebrow="The House of Dastaan"
        title="Every bottle holds a story."
        subtitle="In Persian and Urdu, “Dastaan” means a long, woven tale. We compose fragrances as intimate literature—designed to live on the skin and turn fleeting moments into memory."
      />

      {/* Two-Column Story Block */}
      <section
        aria-label="Our heritage story"
        className="mx-auto max-w-[1440px] px-3 py-12 sm:px-4 md:py-20"
      >
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-tile-warm">
            <Image
              src="/images/ashes-main.png"
              alt="Dastaan signature perfume bottle resting on carved stone"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="max-w-lg">
            <p className="label-caps text-ink/55">Our Philosophy</p>
            <h2 className="mt-3 font-heading text-3xl font-normal leading-tight text-ink md:text-4xl">
              Composed in silence, worn as presence.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink/65">
              Born from the belief that luxury lies in restraint and time, the House of Dastaan
              rejects hurried seasonal trends. Each perfume begins not with a marketing brief,
              but with a single evocative memory: rain on sun-warmed cedar, crushed fig leaves in
              late August, or saffron threads steeping in silver bowls.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink/65">
              Working alongside independent botanical distillers from Grasse to Mysore, our
              perfumers blend rare naturals with precision molecules to create compositions that
              evolve hour by hour on warm skin.
            </p>
            <div className="mt-8 border-t border-hairline pt-6">
              <blockquote className="font-heading text-2xl font-light italic text-ink">
                &ldquo;A great perfume never announces itself before you do; it lingers as the
                story people remember after you leave.&rdquo;
              </blockquote>
              <p className="label-caps mt-2 text-[10px] text-ink/55">
                — Atelier Manifesto, 2019
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section aria-label="Atelier figures" className="border-y border-hairline bg-cream/50">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-8 px-3 py-14 sm:px-4 md:grid-cols-4 md:py-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl text-ink md:text-5xl">{stat.value}</p>
              <p className="label-caps mt-2 text-ink/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Row */}
      <section
        aria-label="Core values"
        className="mx-auto max-w-[1440px] px-3 py-20 sm:px-4 md:py-28"
      >
        <div className="mx-auto max-w-xl text-center">
          <p className="label-caps text-ink/55">Pillars of the House</p>
          <h2 className="mt-2 font-heading text-3xl font-normal text-ink md:text-4xl">
            Uncompromising in every drop
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
          {values.map((item) => (
            <article
              key={item.title}
              className="border border-hairline bg-bg p-8 transition-colors hover:border-ink/40"
            >
              <p className="label-caps text-[10px] text-ink/55">{item.eyebrow}</p>
              <h3 className="mt-4 font-heading text-2xl font-normal text-ink">{item.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-ink/65">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section
        aria-label="Chronicle of the House"
        className="mx-auto max-w-[1440px] px-3 pb-20 sm:px-4 md:pb-28"
      >
        <div className="mx-auto max-w-3xl border-t border-hairline pt-16">
          <p className="label-caps text-ink/55">Chronicle</p>
          <h2 className="mt-2 font-heading text-3xl font-normal text-ink md:text-4xl">
            Milestones of the Atelier
          </h2>

          <ol className="mt-10 flex flex-col divide-y divide-hairline border-y border-hairline">
            {milestones.map((item) => (
              <li
                key={item.year}
                className="grid gap-3 py-6 sm:grid-cols-[100px_1fr] sm:items-baseline sm:gap-8"
              >
                <span className="font-display text-2xl text-ink">{item.year}</span>
                <div>
                  <h3 className="font-heading text-xl font-normal text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/65">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        aria-label="Explore collection"
        className="mx-auto max-w-[1440px] px-3 pb-24 sm:px-4 md:pb-32"
      >
        <div className="border border-hairline bg-cream px-6 py-16 text-center md:py-24">
          <p className="label-caps text-ink/55">Begin Your Story</p>
          <h2 className="mt-3 font-heading text-3xl font-normal text-ink md:text-5xl">
            Discover your olfactory signature
          </h2>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-ink/65">
            Explore our complete wardrobe of Eau de Parfums, conditioning body mists, and
            discovery coffrets.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center bg-ink px-8 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Explore the shop
            </Link>
            <Link href="/collections" className="link-underline">
              Browse collections
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
