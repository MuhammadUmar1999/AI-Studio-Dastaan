'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ProductTile } from '@/components/product/product-tile'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  categories,
  scentFamilies,
  volumeOptions,
  type ProductCategory,
  type ScentFamily,
} from '@/data/products'
import {
  getProducts,
  MAX_CATALOG_PRICE,
  MIN_CATALOG_PRICE,
  SORT_OPTIONS,
  type SortOption,
} from '@/lib/catalog'

const PAGE_SIZE = 12

export type InitialShopState = {
  category: ProductCategory
  maxPrice: number
  volume: string
  scentFamily: ScentFamily | 'all'
  sort: SortOption
  page: number
}

const validCategories = new Set<string>(categories.map((c) => c.value))
const validScentFamilies = new Set<string>(['all', ...scentFamilies.map((s) => s.value)])
const validVolumes = new Set<string>(['all', ...volumeOptions])
const validSorts = new Set<string>(SORT_OPTIONS.map((s) => s.value))

export function parseShopParams(params: {
  category?: string
  maxPrice?: string
  volume?: string
  scent?: string
  sort?: string
  page?: string
}): InitialShopState {
  const category = (
    params.category && validCategories.has(params.category) ? params.category : 'all'
  ) as ProductCategory

  const rawMax = params.maxPrice ? Number(params.maxPrice) : MAX_CATALOG_PRICE
  const maxPrice =
    Number.isFinite(rawMax) && rawMax >= 50 && rawMax <= MAX_CATALOG_PRICE
      ? Math.round(rawMax)
      : MAX_CATALOG_PRICE

  const volume = params.volume && validVolumes.has(params.volume) ? params.volume : 'all'

  const scentFamily = (
    params.scent && validScentFamilies.has(params.scent) ? params.scent : 'all'
  ) as ScentFamily | 'all'

  const sort = (
    params.sort && validSorts.has(params.sort) ? params.sort : 'featured'
  ) as SortOption

  const rawPage = params.page ? Number(params.page) : 1
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1

  return { category, maxPrice, volume, scentFamily, sort, page }
}

export function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      <div className="h-4 w-28 animate-pulse bg-tile/60" />
      <div className="mt-4 h-10 w-48 animate-pulse bg-tile/60" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="aspect-square w-full animate-pulse bg-tile/60" />
            <div className="mx-auto h-4 w-3/4 animate-pulse bg-tile/60" />
            <div className="mx-auto h-3 w-1/3 animate-pulse bg-tile/60" />
          </div>
        ))}
      </div>
    </div>
  )
}

type FilterControlsProps = {
  category: ProductCategory
  maxPrice: number
  volume: string
  scentFamily: ScentFamily | 'all'
  onCategoryChange: (value: ProductCategory) => void
  onMaxPriceChange: (value: number) => void
  onVolumeChange: (value: string) => void
  onScentFamilyChange: (value: ScentFamily | 'all') => void
  onClearAll: () => void
  activeCount: number
}

function FilterControls({
  category,
  maxPrice,
  volume,
  scentFamily,
  onCategoryChange,
  onMaxPriceChange,
  onVolumeChange,
  onScentFamilyChange,
  onClearAll,
  activeCount,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <span className="label-caps text-ink">Filters</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="link-underline text-[10px]"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h2 className="label-caps text-ink/55">Category</h2>
        <div className="mt-3 flex flex-col gap-2">
          {categories.map((item) => {
            const active = category === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onCategoryChange(item.value)}
                aria-pressed={active}
                className={`flex items-center justify-between py-1 text-left text-xs transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                  active ? 'font-medium text-ink underline underline-offset-4' : 'text-ink/65'
                }`}
              >
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-hairline pt-6">
        <div className="flex items-center justify-between">
          <label htmlFor="price-range-slider" className="label-caps text-ink/55">
            Price Range
          </label>
          <span className="text-xs text-ink">
            ${MIN_CATALOG_PRICE} – ${maxPrice}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min={80}
          max={MAX_CATALOG_PRICE}
          step={10}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="mt-4 h-1 w-full cursor-pointer appearance-none bg-hairline accent-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink"
        />
        <div className="mt-2 flex justify-between text-[10px] text-muted">
          <span>$80</span>
          <span>$190</span>
          <span>$300</span>
        </div>
      </div>

      {/* Volume */}
      <div className="border-t border-hairline pt-6">
        <h2 className="label-caps text-ink/55">Volume</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['all', ...volumeOptions] as const).map((option) => {
            const active = volume === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => onVolumeChange(option)}
                aria-pressed={active}
                className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                  active
                    ? 'border-ink bg-ink text-white'
                    : 'border-hairline bg-transparent text-ink/75 hover:border-ink'
                }`}
              >
                {option === 'all' ? 'All sizes' : option}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scent Family */}
      <div className="border-t border-hairline pt-6">
        <h2 className="label-caps text-ink/55">Scent Family</h2>
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onScentFamilyChange('all')}
            aria-pressed={scentFamily === 'all'}
            className={`py-1 text-left text-xs transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              scentFamily === 'all'
                ? 'font-medium text-ink underline underline-offset-4'
                : 'text-ink/65'
            }`}
          >
            All scent families
          </button>
          {scentFamilies.map((family) => {
            const active = scentFamily === family.value
            return (
              <button
                key={family.value}
                type="button"
                onClick={() => onScentFamilyChange(family.value)}
                aria-pressed={active}
                className={`py-1 text-left text-xs transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                  active ? 'font-medium text-ink underline underline-offset-4' : 'text-ink/65'
                }`}
              >
                {family.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function ShopClient({ initialState }: { initialState: InitialShopState }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState<ProductCategory>(initialState.category)
  const [maxPrice, setMaxPrice] = useState<number>(initialState.maxPrice)
  const [volume, setVolume] = useState<string>(initialState.volume)
  const [scentFamily, setScentFamily] = useState<ScentFamily | 'all'>(
    initialState.scentFamily
  )
  const [sort, setSort] = useState<SortOption>(initialState.sort)
  const [page, setPage] = useState<number>(initialState.page)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Keep state synced when browser back/forward changes searchParams
  useEffect(() => {
    const parsed = parseShopParams({
      category: searchParams.get('category') ?? undefined,
      maxPrice: searchParams.get('maxPrice') ?? undefined,
      volume: searchParams.get('volume') ?? undefined,
      scent: searchParams.get('scent') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
      page: searchParams.get('page') ?? undefined,
    })
    setCategory(parsed.category)
    setMaxPrice(parsed.maxPrice)
    setVolume(parsed.volume)
    setScentFamily(parsed.scentFamily)
    setSort(parsed.sort)
    setPage(parsed.page)
  }, [searchParams])

  const syncUrl = useCallback(
    (next: {
      category: ProductCategory
      maxPrice: number
      volume: string
      scentFamily: ScentFamily | 'all'
      sort: SortOption
      page: number
    }) => {
      const params = new URLSearchParams()
      if (next.category !== 'all') params.set('category', next.category)
      if (next.maxPrice < MAX_CATALOG_PRICE) params.set('maxPrice', String(next.maxPrice))
      if (next.volume !== 'all') params.set('volume', next.volume)
      if (next.scentFamily !== 'all') params.set('scent', next.scentFamily)
      if (next.sort !== 'featured') params.set('sort', next.sort)
      if (next.page > 1) params.set('page', String(next.page))
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router]
  )

  const updateFilter = <K extends keyof InitialShopState>(
    key: K,
    value: InitialShopState[K]
  ) => {
    const nextState: InitialShopState = {
      category,
      maxPrice,
      volume,
      scentFamily,
      sort,
      page: key === 'page' ? (value as number) : 1,
      [key]: value,
    }
    setCategory(nextState.category)
    setMaxPrice(nextState.maxPrice)
    setVolume(nextState.volume)
    setScentFamily(nextState.scentFamily)
    setSort(nextState.sort)
    setPage(nextState.page)
    syncUrl(nextState)
  }

  const clearAllFilters = () => {
    const reset: InitialShopState = {
      category: 'all',
      maxPrice: MAX_CATALOG_PRICE,
      volume: 'all',
      scentFamily: 'all',
      sort,
      page: 1,
    }
    setCategory(reset.category)
    setMaxPrice(reset.maxPrice)
    setVolume(reset.volume)
    setScentFamily(reset.scentFamily)
    setPage(1)
    syncUrl(reset)
  }

  const filteredProducts = useMemo(
    () =>
      getProducts(
        {
          category,
          minPrice: MIN_CATALOG_PRICE,
          maxPrice,
          volume,
          scentFamily,
        },
        sort
      ),
    [category, maxPrice, volume, scentFamily, sort]
  )

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, page * PAGE_SIZE),
    [filteredProducts, page]
  )

  const activeChips: { key: string; label: string; onRemove: () => void }[] = []
  if (category !== 'all') {
    const label = categories.find((c) => c.value === category)?.label ?? category
    activeChips.push({
      key: 'category',
      label: `Category: ${label}`,
      onRemove: () => updateFilter('category', 'all'),
    })
  }
  if (maxPrice < MAX_CATALOG_PRICE) {
    activeChips.push({
      key: 'maxPrice',
      label: `Up to $${maxPrice}`,
      onRemove: () => updateFilter('maxPrice', MAX_CATALOG_PRICE),
    })
  }
  if (volume !== 'all') {
    activeChips.push({
      key: 'volume',
      label: `Volume: ${volume}`,
      onRemove: () => updateFilter('volume', 'all'),
    })
  }
  if (scentFamily !== 'all') {
    const label = scentFamilies.find((s) => s.value === scentFamily)?.label ?? scentFamily
    activeChips.push({
      key: 'scentFamily',
      label: `Scent: ${label}`,
      onRemove: () => updateFilter('scentFamily', 'all'),
    })
  }

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      {/* Header */}
      <div className="border-b border-hairline pb-8">
        <Breadcrumbs items={[{ label: 'Shop' }]} />
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-heading text-4xl font-normal text-ink md:text-5xl">Shop</h1>
            <p className="mt-2 max-w-xl text-sm text-ink/60">
              Signature Eau de Parfums, conditioning body mists, and limited-edition coffrets.
            </p>
          </div>
          <p className="label-caps text-ink/55" aria-live="polite">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'fragrance' : 'fragrances'}
          </p>
        </div>
      </div>

      {/* Mobile Filters + Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline py-4">
        <div className="flex items-center gap-3">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger
              className="inline-flex h-10 items-center gap-2 border border-hairline px-4 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink lg:hidden"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="size-3.5" strokeWidth={1.5} />
              <span>Filters</span>
              {activeChips.length > 0 && (
                <span className="ml-1 flex size-4 items-center justify-center bg-ink text-[9px] text-white">
                  {activeChips.length}
                </span>
              )}
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto rounded-none bg-bg p-6">
              <SheetHeader className="p-0 pb-4">
                <SheetTitle className="font-heading text-2xl font-normal">
                  Filter Fragrances
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Filter catalog by category, price, volume, and scent family
                </SheetDescription>
              </SheetHeader>
              <FilterControls
                category={category}
                maxPrice={maxPrice}
                volume={volume}
                scentFamily={scentFamily}
                onCategoryChange={(v) => updateFilter('category', v)}
                onMaxPriceChange={(v) => updateFilter('maxPrice', v)}
                onVolumeChange={(v) => updateFilter('volume', v)}
                onScentFamilyChange={(v) => updateFilter('scentFamily', v)}
                onClearAll={clearAllFilters}
                activeCount={activeChips.length}
              />
            </SheetContent>
          </Sheet>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`Remove filter ${chip.label}`}
                  className="inline-flex items-center gap-1.5 border border-hairline bg-cream/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
                >
                  <span>{chip.label}</span>
                  <X className="size-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="link-underline ml-1 text-[10px]"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="shop-sort-select" className="label-caps text-ink/55">
            Sort by
          </label>
          <select
            id="shop-sort-select"
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value as SortOption)}
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

      {/* Main Content Layout */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Desktop Sidebar */}
        <aside aria-label="Catalog filters" className="hidden lg:block">
          <FilterControls
            category={category}
            maxPrice={maxPrice}
            volume={volume}
            scentFamily={scentFamily}
            onCategoryChange={(v) => updateFilter('category', v)}
            onMaxPriceChange={(v) => updateFilter('maxPrice', v)}
            onVolumeChange={(v) => updateFilter('volume', v)}
            onScentFamilyChange={(v) => updateFilter('scentFamily', v)}
            onClearAll={clearAllFilters}
            activeCount={activeChips.length}
          />
        </aside>

        {/* Product Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center border border-hairline bg-cream/30 p-8 text-center">
              <p className="font-heading text-2xl font-normal text-ink">
                No fragrances match your filters
              </p>
              <p className="mt-2 max-w-sm text-xs text-ink/60">
                Try adjusting your price range, volume, or scent family to discover more creations.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-6 h-11 bg-ink px-7 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-4 md:gap-y-10 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Footer */}
              <div className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-hairline pt-8 text-center">
                <p className="text-xs text-ink/60">
                  Showing {visibleProducts.length} of {filteredProducts.length}
                </p>
                {visibleProducts.length < filteredProducts.length && (
                  <button
                    type="button"
                    onClick={() => updateFilter('page', page + 1)}
                    className="h-12 border border-ink bg-transparent px-10 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    Load more
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
