import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ProductTile } from '@/components/product/product-tile'
import { getJournalArticle, journalArticles } from '@/data/journal'
import { products, type Product } from '@/data/products'

export function generateStaticParams() {
  return journalArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getJournalArticle(slug)
  if (!article) {
    return {
      title: 'Article Not Found | Dastaan',
      description: 'The requested Dastaan Journal article could not be found.',
    }
  }

  return {
    title: `${article.title} | Dastaan`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Dastaan`,
      description: article.excerpt,
      images: [{ url: article.heroImage, alt: article.title }],
    },
  }
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const index = journalArticles.findIndex((item) => item.slug === slug)
  if (index === -1) notFound()

  const article = journalArticles[index]
  const prevArticle = index > 0 ? journalArticles[index - 1] : null
  const nextArticle =
    index < journalArticles.length - 1 ? journalArticles[index + 1] : null

  const relatedProducts = article.relatedProductSlugs
    .map((productSlug) => products.find((p) => p.slug === productSlug))
    .filter((item): item is Product => Boolean(item))

  return (
    <main className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      <div className="mx-auto max-w-[680px]">
        <Breadcrumbs
          items={[
            { label: 'Journal', href: '/journal' },
            { label: article.title },
          ]}
        />
        <p className="label-caps text-ink/55">
          {article.category} · {article.date} · {article.readTime}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-normal leading-tight text-ink md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/65">{article.excerpt}</p>
      </div>

      {/* Hero Image */}
      <div className="mx-auto mt-10 max-w-4xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-tile">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Readable Column Body Blocks */}
      <article className="mx-auto mt-12 max-w-[680px] space-y-6 border-b border-hairline pb-14">
        {article.body.map((block, blockIndex) => {
          if (block.type === 'paragraph') {
            return (
              <p
                key={blockIndex}
                className="text-sm leading-[1.85] text-ink/75"
              >
                {block.text}
              </p>
            )
          }
          if (block.type === 'heading') {
            return (
              <h2
                key={blockIndex}
                className="pt-4 font-heading text-2xl font-normal text-ink md:text-3xl"
              >
                {block.text}
              </h2>
            )
          }
          if (block.type === 'quote') {
            return (
              <blockquote
                key={blockIndex}
                className="my-8 border-y border-hairline bg-cream/40 px-6 py-8 text-center"
              >
                <p className="font-heading text-2xl font-light italic leading-relaxed text-ink">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.attribution && (
                  <footer className="label-caps mt-3 text-[10px] text-ink/55">
                    — {block.attribution}
                  </footer>
                )}
              </blockquote>
            )
          }
          if (block.type === 'image') {
            return (
              <figure key={blockIndex} className="my-8">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-tile">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 680px"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2.5 text-center text-xs text-muted">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )
          }
          return null
        })}
      </article>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section
          aria-label="Fragrances featured in this story"
          className="mx-auto mt-16 max-w-4xl border-b border-hairline pb-16"
        >
          <p className="label-caps text-center text-ink/55">Featured in This Story</p>
          <h2 className="mt-2 text-center font-heading text-3xl font-normal text-ink">
            Related Fragrances
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {relatedProducts.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Prev / Next Article Navigation */}
      <nav
        aria-label="Article navigation"
        className="mx-auto mt-12 flex max-w-4xl flex-col justify-between gap-6 sm:flex-row sm:items-center"
      >
        {prevArticle ? (
          <Link
            href={`/journal/${prevArticle.slug}`}
            className="group flex flex-col border border-hairline p-5 transition-colors hover:border-ink sm:max-w-xs"
          >
            <span className="label-caps text-[10px] text-ink/55">← Previous Story</span>
            <span className="mt-2 font-heading text-xl text-ink">{prevArticle.title}</span>
          </Link>
        ) : (
          <div />
        )}

        <Link href="/journal" className="link-underline self-center">
          All journal stories
        </Link>

        {nextArticle ? (
          <Link
            href={`/journal/${nextArticle.slug}`}
            className="group flex flex-col border border-hairline p-5 text-right transition-colors hover:border-ink sm:max-w-xs"
          >
            <span className="label-caps text-[10px] text-ink/55">Next Story →</span>
            <span className="mt-2 font-heading text-xl text-ink">{nextArticle.title}</span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </main>
  )
}
