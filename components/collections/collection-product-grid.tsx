'use client'

import { useMemo, useState } from 'react'
import { ProductTile } from '@/components/product/product-tile'
import { getProducts, SORT_OPTIONS, type SortOption } from '@/lib/catalog'

export function CollectionProductGrid({
  collectionSlug,
  initialSort = 'featured',
}: {
  collectionSlug: string
  initialSort?: SortOption
}) {
  const [sort, setSort] = useState<SortOption>(initialSort)

  const products = useMemo(
    () => getProducts({ collectionSlug }, sort),
    [collectionSlug, sort]
  )

  return (
    <section aria-label="Collection fragrances" className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-hairline py-4">
        <p className="label-caps text-ink/55">
          {products.length} {products.length === 1 ? 'fragrance' : 'fragrances'}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="collection-sort" className="label-caps text-ink/55">
            Sort by
          </label>
          <select
            id="collection-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-10 border border-hairline bg-bg px-3 text-xs text-ink focus-visible:border-ink focus-visible:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-4 md:gap-y-10 lg:grid-cols-4">
        {products.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
