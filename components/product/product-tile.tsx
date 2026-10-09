'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice, type Product } from '@/data/products'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addItem, toggle } from '@/lib/store'

export function ProductTile({
  product,
  showQuickAdd = true,
}: {
  product: Product
  showQuickAdd?: boolean
}) {
  const dispatch = useAppDispatch()
  const wishlist = useAppSelector((state) => state.wishlist.ids)
  const isWishlisted = wishlist.includes(product.id)

  const handleQuickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!product.inStock) return
    const firstVolume = product.volumes[0] ?? { label: '100 ml', price: product.price }
    const item = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: firstVolume.price,
      volumeLabel: firstVolume.label,
      qty: 1,
      image: product.images[0],
    }
    dispatch(addItem(item))
    try {
      const stored = JSON.parse(localStorage.getItem('dastaan-cart') || '{"items":[]}')
      const items = Array.isArray(stored.items) ? stored.items : []
      const existing = items.find(
        (entry: typeof item) =>
          entry.productId === item.productId && entry.volumeLabel === item.volumeLabel
      )
      if (existing) existing.qty += 1
      else items.push(item)
      localStorage.setItem('dastaan-cart', JSON.stringify({ items }))
    } catch {
      localStorage.setItem('dastaan-cart', JSON.stringify({ items: [item] }))
    }
    window.dispatchEvent(new CustomEvent('dastaan:open-cart'))
    toast.success(`${product.name} (${firstVolume.label}) added to your bag.`)
  }

  return (
    <article className="group">
      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: product.tileBg }}
      >
        <Link
          href={`/product/${product.slug}`}
          className="block size-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </Link>

        {!product.inStock ? (
          <span className="label-caps pointer-events-none absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[10px] text-ink">
            Sold out
          </span>
        ) : product.isNew ? (
          <span className="label-caps pointer-events-none absolute left-3 top-3 bg-white/85 px-2.5 py-1 text-[10px] text-ink">
            New
          </span>
        ) : null}

        <button
          type="button"
          aria-pressed={isWishlisted}
          aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            dispatch(toggle(product.id))
          }}
          className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/80 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink max-md:opacity-100"
        >
          <Heart
            className={`size-3.5 ${isWishlisted ? 'fill-ink' : ''}`}
            aria-hidden="true"
          />
        </button>

        {showQuickAdd && product.inStock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.name} to bag`}
            className="absolute inset-x-3 bottom-3 z-10 flex h-9 items-center justify-center gap-1.5 bg-ink/90 text-[10px] uppercase tracking-[0.14em] text-white opacity-0 transition-opacity hover:bg-ink group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink max-md:opacity-100"
          >
            <ShoppingBag className="size-3" strokeWidth={1.5} aria-hidden="true" />
            <span>Quick add</span>
          </button>
        )}
      </div>

      <Link
        href={`/product/${product.slug}`}
        className="mt-4 block text-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <h3 className="font-display text-lg leading-tight text-ink">{product.name}</h3>
        <p className="mt-1 text-[11px] text-muted">
          {product.inStock ? formatPrice(product.price) : `${formatPrice(product.price)} · Sold out`}
        </p>
      </Link>
    </article>
  )
}
