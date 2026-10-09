'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { products } from '@/data/products'
import { saveRecentSearch, searchCatalog } from '@/lib/search'

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onOpenChange])

  const goToSearch = (rawQuery: string) => {
    const trimmed = rawQuery.trim()
    if (trimmed) {
      saveRecentSearch(trimmed)
    }
    onOpenChange(false)
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }

  const trimmedQuery = query.trim()
  const results = trimmedQuery
    ? searchCatalog(trimmedQuery)
    : { products: products.slice(0, 6), collections: [], articles: [], total: 6 }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search perfumes, notes, collections..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              goToSearch(query)
            }
          }}
        />
        <CommandList>
          {trimmedQuery && results.total === 0 && (
            <CommandEmpty>No matches found for &ldquo;{trimmedQuery}&rdquo;.</CommandEmpty>
          )}
          {results.products.length > 0 && (
            <CommandGroup heading={trimmedQuery ? 'Perfumes' : 'Popular Perfumes'}>
              {results.products.slice(0, 6).map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => {
                    if (trimmedQuery) saveRecentSearch(trimmedQuery)
                    onOpenChange(false)
                    router.push(`/product/${product.slug}`)
                  }}
                >
                  <span>{product.name}</span>
                  <span className="ml-auto text-xs text-muted">{product.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {results.collections.length > 0 && (
            <CommandGroup heading="Collections">
              {results.collections.slice(0, 3).map((collection) => (
                <CommandItem
                  key={collection.slug}
                  value={collection.title}
                  onSelect={() => {
                    if (trimmedQuery) saveRecentSearch(trimmedQuery)
                    onOpenChange(false)
                    router.push(`/collections/${collection.slug}`)
                  }}
                >
                  <span>{collection.title}</span>
                  <span className="ml-auto text-xs text-muted">Collection</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {results.articles.length > 0 && (
            <CommandGroup heading="Journal">
              {results.articles.slice(0, 3).map((article) => (
                <CommandItem
                  key={article.slug}
                  value={article.title}
                  onSelect={() => {
                    if (trimmedQuery) saveRecentSearch(trimmedQuery)
                    onOpenChange(false)
                    router.push(`/journal/${article.slug}`)
                  }}
                >
                  <span>{article.title}</span>
                  <span className="ml-auto text-xs text-muted">{article.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandItem
            value={`view-all-${query}`}
            onSelect={() => goToSearch(query)}
            className="justify-between font-medium"
          >
            <span className="label-caps text-ink">
              {trimmedQuery ? `View all results for "${trimmedQuery}"` : 'View all results'}
            </span>
            <ArrowRight className="size-3.5 text-ink/60" />
          </CommandItem>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
