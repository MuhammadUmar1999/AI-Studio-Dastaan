import { z } from 'zod'
import { products, type Product } from '@/data/products'
import { collections, type Collection } from '@/data/collections'
import { journalArticles, type JournalArticle } from '@/data/journal'

export type SearchResults = {
  products: Product[]
  collections: Collection[]
  articles: JournalArticle[]
  total: number
}

export function searchCatalog(rawQuery: string): SearchResults {
  const query = rawQuery.trim().toLowerCase()
  if (!query) {
    return {
      products: [],
      collections: [],
      articles: [],
      total: 0,
    }
  }

  const matchedProducts = products.filter((product) => {
    const allNotes = [
      ...product.notes.top,
      ...product.notes.heart,
      ...product.notes.base,
    ].join(' ')
    const haystack = [
      product.name,
      product.slug,
      product.category,
      product.scentFamily,
      allNotes,
      product.tags.join(' '),
      product.description.join(' '),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })

  const matchedCollections = collections.filter((collection) => {
    const haystack = [
      collection.title,
      collection.slug,
      collection.subtitle,
      collection.story,
      collection.notes.join(' '),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })

  const matchedArticles = journalArticles.filter((article) => {
    const bodyText = article.body
      .map((block) => ('text' in block ? block.text : block.caption ?? ''))
      .join(' ')
    const haystack = [
      article.title,
      article.slug,
      article.excerpt,
      article.category,
      bodyText,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })

  return {
    products: matchedProducts,
    collections: matchedCollections,
    articles: matchedArticles,
    total:
      matchedProducts.length + matchedCollections.length + matchedArticles.length,
  }
}

export const RECENT_SEARCHES_KEY = 'dastaan-recent-searches'

export const recentSearchesSchema = z.array(z.string().trim().min(1)).max(5)

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (!raw) return []
    const parsed = recentSearchesSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

export function saveRecentSearch(term: string): string[] {
  const clean = term.trim()
  if (!clean || typeof window === 'undefined') return getRecentSearches()
  const existing = getRecentSearches().filter(
    (entry) => entry.toLowerCase() !== clean.toLowerCase()
  )
  const updated = [clean, ...existing].slice(0, 5)
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // ignore storage quota errors
  }
  return updated
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // ignore storage errors
  }
}
