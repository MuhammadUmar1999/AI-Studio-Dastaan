import {
  products,
  type Product,
  type ProductCategory,
  type ScentFamily,
} from '@/data/products'
import { collections, type Collection } from '@/data/collections'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'

export type CatalogFilters = {
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  volume?: string
  scentFamily?: ScentFamily | 'all'
  collectionSlug?: string
  inStockOnly?: boolean
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Best Rated' },
]

export const MIN_CATALOG_PRICE = 0
export const MAX_CATALOG_PRICE = 300

export function getProducts(
  filters: CatalogFilters = {},
  sort: SortOption = 'featured'
): Product[] {
  const {
    category = 'all',
    minPrice = MIN_CATALOG_PRICE,
    maxPrice = MAX_CATALOG_PRICE,
    volume = 'all',
    scentFamily = 'all',
    collectionSlug,
    inStockOnly = false,
  } = filters

  const filtered = products.filter((product) => {
    if (category && category !== 'all' && product.category !== category) {
      return false
    }
    if (product.price < minPrice || product.price > maxPrice) {
      return false
    }
    if (volume && volume !== 'all') {
      const hasVolume = product.volumes.some(
        (v) => v.label.toLowerCase() === volume.toLowerCase()
      )
      if (!hasVolume) return false
    }
    if (scentFamily && scentFamily !== 'all' && product.scentFamily !== scentFamily) {
      return false
    }
    if (collectionSlug) {
      const collection = getCollection(collectionSlug)
      const inCollectionList = collection?.productSlugs.includes(product.slug) ?? false
      const inProductCollections = product.collections.includes(collectionSlug)
      if (!inCollectionList && !inProductCollections) return false
    }
    if (inStockOnly && !product.inStock) {
      return false
    }
    return true
  })

  const sorted = [...filtered]
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.rating - a.rating)
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      break
    case 'featured':
    default:
      sorted.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller))
      break
  }

  return sorted
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((item) => item.slug === slug)
}

export function getCollection(slug: string): Collection | undefined {
  return collections.find((item) => item.slug === slug)
}

export function getRelated(product: Product, limit = 3): Product[] {
  const candidates = products.filter((item) => item.slug !== product.slug)

  const scored = candidates.map((candidate) => {
    let score = 0
    if (candidate.category === product.category) score += 3
    if (candidate.scentFamily === product.scentFamily) score += 2
    const sharedCollections = candidate.collections.filter((col) =>
      product.collections.includes(col)
    ).length
    score += sharedCollections
    return { candidate, score }
  })

  scored.sort((a, b) => b.score - a.score || b.candidate.rating - a.candidate.rating)
  return scored.slice(0, limit).map((entry) => entry.candidate)
}
