'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ProductTile } from '@/components/product/product-tile'
import { collections } from '@/data/collections'
import { products } from '@/data/products'
import {
  clearRecentSearches,
  getRecentSearches,
  saveRecentSearch,
  searchCatalog,
} from '@/lib/search'

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState(initialQuery)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Sync if URL query parameter changes externally (e.g., SearchDialog or browser back/forward)
  const urlQuery = searchParams.get('q') ?? ''
  useEffect(() => {
    setQuery(urlQuery)
    if (urlQuery.trim()) {
      setRecentSearches(saveRecentSearch(urlQuery.trim()))
    }
  }, [urlQuery])

  // Debounced 300ms URL update while typing
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = query.trim()
      const currentParam = (searchParams.get('q') ?? '').trim()
      if (trimmed !== currentParam) {
        const nextUrl = trimmed
          ? `${pathname}?q=${encodeURIComponent(trimmed)}`
          : pathname
        router.replace(nextUrl, { scroll: false })
        if (trimmed.length >= 2) {
          setRecentSearches(saveRecentSearch(trimmed))
        }
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [query, pathname, router, searchParams])

  const trimmedQuery = query.trim()
  const results = useMemo(() => searchCatalog(trimmedQuery), [trimmedQuery])

  const popularProducts = useMemo(
    () => products.filter((p) => p.isBestseller).slice(0, 4),
    []
  )
  const suggestedCollections = useMemo(() => collections.slice(0, 4), [])

  const applySearchTerm = (term: string) => {
    setQuery(term)
    const updated = saveRecentSearch(term)
    setRecentSearches(updated)
    router.replace(`${pathname}?q=${encodeURIComponent(term)}`, { scroll: false })
    inputRef.current?.focus()
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      <Breadcrumbs items={[{ label: 'Search' }]} />

      <div className="border-b border-hairline pb-10">
        <p className="label-caps text-ink/55">Search Boutique</p>
        <h1 className="mt-2 font-heading text-4xl font-normal text-ink md:text-5xl">
          {trimmedQuery ? `Results for “${trimmedQuery}”` : 'Search Dastaan'}
        </h1>

        {/* Live Search Input */}
        <div className="relative mt-6 max-w-2xl">
          <label htmlFor="search-page-input" className="sr-only">
            Search perfumes, collections, and notes
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/50"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="search-page-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by perfume name, note (amber, iris, fig), or collection..."
            autoFocus
            className="h-12 w-full border border-hairline bg-bg pl-11 pr-10 text-sm text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                router.replace(pathname, { scroll: false })
                inputRef.current?.focus()
              }}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink/55 hover:text-ink"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="label-caps mr-1 text-[10px] text-ink/55">Recent:</span>
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => applySearchTerm(term)}
                className="border border-hairline bg-cream/40 px-3 py-1 text-[11px] text-ink transition-colors hover:border-ink"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearRecent}
              className="link-underline ml-2 text-[10px]"
            >
              Clear
            </button>
          </div>
        )}

        {trimmedQuery && (
          <p className="label-caps mt-6 text-ink/60" aria-live="polite">
            {results.total} {results.total === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {/* Empty Query State */}
      {!trimmedQuery && (
        <div className="mt-12 space-y-16">
          <section aria-label="Suggested collections">
            <h2 className="font-heading text-2xl font-normal text-ink">
              Explore Curated Collections
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {suggestedCollections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/collections/${collection.slug}`}
                  className="group border border-hairline bg-cream/30 p-5 transition-colors hover:border-ink"
                >
                  <p className="label-caps text-[10px] text-ink/55">Collection</p>
                  <h3 className="mt-2 font-heading text-xl text-ink">{collection.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{collection.subtitle}</p>
                  <span className="link-underline mt-4">Shop selection</span>
                </Link>
              ))}
            </div>
          </section>

          <section aria-label="Popular perfumes">
            <div className="flex items-end justify-between">
              <h2 className="font-heading text-2xl font-normal text-ink">
                Most Coveted Perfumes
              </h2>
              <Link href="/shop" className="link-underline">
                View all
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 md:gap-x-4">
              {popularProducts.map((product) => (
                <ProductTile key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* No Results State */}
      {trimmedQuery && results.total === 0 && (
        <div className="mt-12 space-y-16">
          <div className="border border-hairline bg-cream/30 p-8 text-center md:p-12">
            <h2 className="font-heading text-3xl font-normal text-ink">
              No matches found for &ldquo;{trimmedQuery}&rdquo;
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink/60">
              Try searching for an olfactory note such as &ldquo;amber&rdquo;, &ldquo;iris&rdquo;,
              &ldquo;cinnamon&rdquo;, or explore our suggested collections below.
            </p>
          </div>

          <section aria-label="Suggested collections">
            <h3 className="font-heading text-2xl font-normal text-ink">
              Suggested Collections
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {suggestedCollections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/collections/${collection.slug}`}
                  className="group border border-hairline bg-cream/30 p-5 transition-colors hover:border-ink"
                >
                  <p className="label-caps text-[10px] text-ink/55">Collection</p>
                  <h4 className="mt-2 font-heading text-xl text-ink">{collection.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{collection.subtitle}</p>
                  <span className="link-underline mt-4">Shop selection</span>
                </Link>
              ))}
            </div>
          </section>

          <section aria-label="Popular perfumes">
            <h3 className="font-heading text-2xl font-normal text-ink">
              Popular Perfumes
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 md:gap-x-4">
              {popularProducts.map((product) => (
                <ProductTile key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Grouped Search Results */}
      {trimmedQuery && results.total > 0 && (
        <div className="mt-12 space-y-16">
          {/* Products Group */}
          {results.products.length > 0 && (
            <section aria-label="Matching products">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <h2 className="font-heading text-2xl font-normal text-ink">Perfumes</h2>
                <span className="label-caps text-ink/55">
                  {results.products.length}{' '}
                  {results.products.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-4 md:gap-y-10 lg:grid-cols-4">
                {results.products.map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Collections Group */}
          {results.collections.length > 0 && (
            <section aria-label="Matching collections">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <h2 className="font-heading text-2xl font-normal text-ink">Collections</h2>
                <span className="label-caps text-ink/55">
                  {results.collections.length}{' '}
                  {results.collections.length === 1 ? 'collection' : 'collections'}
                </span>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {results.collections.map((collection) => (
                  <article
                    key={collection.slug}
                    className="group grid items-center gap-5 border border-hairline p-4 sm:grid-cols-[160px_1fr]"
                  >
                    <Link
                      href={`/collections/${collection.slug}`}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-tile"
                    >
                      <Image
                        src={collection.heroImage}
                        alt={collection.title}
                        fill
                        sizes="200px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </Link>
                    <div>
                      <p className="label-caps text-[10px] text-ink/55">Collection</p>
                      <h3 className="mt-1 font-heading text-2xl font-normal text-ink">
                        {collection.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted">{collection.subtitle}</p>
                      <Link
                        href={`/collections/${collection.slug}`}
                        className="link-underline mt-3"
                      >
                        Shop selection
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Journal Articles Group */}
          {results.articles.length > 0 && (
            <section aria-label="Matching journal stories">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <h2 className="font-heading text-2xl font-normal text-ink">Journal</h2>
                <span className="label-caps text-ink/55">
                  {results.articles.length}{' '}
                  {results.articles.length === 1 ? 'story' : 'stories'}
                </span>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {results.articles.map((article) => (
                  <article
                    key={article.slug}
                    className="flex flex-col justify-between border border-hairline bg-cream/30 p-6"
                  >
                    <div>
                      <p className="label-caps text-[10px] text-ink/55">
                        {article.category} · {article.readTime}
                      </p>
                      <h3 className="mt-2 font-heading text-2xl font-normal text-ink">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink/65">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="mt-5">
                      <Link href={`/journal/${article.slug}`} className="link-underline">
                        Read story
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
