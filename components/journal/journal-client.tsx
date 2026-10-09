'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  journalArticles,
  journalCategories,
  type JournalCategory,
} from '@/data/journal'

type FilterCategory = 'All' | JournalCategory

const validCategories = new Set<string>(journalCategories)

export function JournalClient({ initialCategory }: { initialCategory: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const parsedInitial: FilterCategory = validCategories.has(initialCategory)
    ? (initialCategory as FilterCategory)
    : 'All'

  const [category, setCategory] = useState<FilterCategory>(parsedInitial)

  useEffect(() => {
    const param = searchParams.get('category') ?? 'All'
    setCategory(validCategories.has(param) ? (param as FilterCategory) : 'All')
  }, [searchParams])

  const handleCategoryChange = (next: FilterCategory) => {
    setCategory(next)
    const params = new URLSearchParams(searchParams.toString())
    if (next === 'All') {
      params.delete('category')
    } else {
      params.set('category', next)
    }
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const filtered = useMemo(
    () =>
      category === 'All'
        ? journalArticles
        : journalArticles.filter((article) => article.category === category),
    [category]
  )

  const featured = filtered[0] ?? journalArticles[0]
  const rest = filtered.slice(1)

  return (
    <div className="mx-auto max-w-[1440px] px-3 pb-24 sm:px-4 md:pb-32">
      {/* Category Filter Pills */}
      <div
        role="tablist"
        aria-label="Filter journal stories by category"
        className="flex flex-wrap items-center gap-2 border-b border-hairline pb-6"
      >
        {journalCategories.map((item) => {
          const active = category === item
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleCategoryChange(item)}
              className={`h-9 border px-4 text-[10px] uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                active
                  ? 'border-ink bg-ink text-white'
                  : 'border-hairline bg-transparent text-ink/70 hover:border-ink'
              }`}
            >
              {item}
            </button>
          )
        })}
      </div>

      {/* Featured Article */}
      {featured && (
        <section aria-label="Featured story" className="mt-10 border-b border-hairline pb-14">
          <article className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-14">
            <Link
              href={`/journal/${featured.slug}`}
              className="group relative aspect-[16/10] w-full overflow-hidden bg-tile focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Image
                src={featured.heroImage}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </Link>

            <div>
              <p className="label-caps text-ink/55">
                Featured · {featured.category} · {featured.date}
              </p>
              <Link href={`/journal/${featured.slug}`} className="mt-3 block">
                <h2 className="font-heading text-3xl font-normal leading-tight text-ink md:text-4xl">
                  {featured.title}
                </h2>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/65">
                {featured.excerpt}
              </p>
              <p className="label-caps mt-4 text-[10px] text-ink/45">{featured.readTime}</p>
              <div className="mt-6">
                <Link href={`/journal/${featured.slug}`} className="link-underline">
                  Read more
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Article Grid */}
      {rest.length > 0 && (
        <section aria-label="More journal stories" className="mt-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <article key={article.slug} className="group flex flex-col justify-between">
                <div>
                  <Link
                    href={`/journal/${article.slug}`}
                    className="relative block aspect-[4/3] w-full overflow-hidden bg-tile focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <Image
                      src={article.heroImage}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </Link>

                  <div className="mt-5 flex items-center justify-between gap-2">
                    <span className="label-caps text-[10px] text-ink/55">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-muted">{article.date}</span>
                  </div>

                  <Link href={`/journal/${article.slug}`} className="mt-2 block">
                    <h3 className="font-heading text-2xl font-normal leading-snug text-ink">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="mt-2 text-xs leading-relaxed text-ink/65">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-2">
                  <Link href={`/journal/${article.slug}`} className="link-underline">
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
