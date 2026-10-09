'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice, type Product } from '@/data/products'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addItem, toggle } from '@/lib/store'

export function GiftSetCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const wishlist = useAppSelector((state) => state.wishlist.ids)
  const isWishlisted = wishlist.includes(product.id)

  const handleAddToBag = () => {
    if (!product.inStock) return
    const firstVolume = product.volumes[0] ?? { label: 'Coffret Set', price: product.price }
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
    toast.success(`${product.name} added to your bag.`)
  }

  const includedItems = product.setIncludes ?? [
    `${product.name} (${product.volumes[0]?.label ?? 'Coffret'})`,
    'Signature linen-bound presentation box',
    'Complimentary personalized message card',
  ]

  return (
    <article className="group flex flex-col border border-hairline bg-bg">
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{ backgroundColor: product.tileBg }}
      >
        <Link href={`/product/${product.slug}`} className="block size-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </Link>
        <button
          type="button"
          aria-pressed={isWishlisted}
          aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`}
          onClick={() => dispatch(toggle(product.id))}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/85 text-ink transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <Heart className={`size-4 ${isWishlisted ? 'fill-ink' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p className="label-caps text-ink/55">
              {product.volumes[0]?.label ?? 'Coffret'}
            </p>
            <p className="text-sm font-semibold text-ink">{formatPrice(product.price)}</p>
          </div>

          <Link href={`/product/${product.slug}`} className="mt-2 block">
            <h2 className="font-heading text-2xl font-normal text-ink md:text-3xl">
              {product.name}
            </h2>
          </Link>

          <p className="mt-3 text-xs leading-relaxed text-ink/65">
            {product.description[0]}
          </p>

          <div className="mt-5 border-t border-hairline pt-4">
            <p className="label-caps text-[10px] text-ink/55">Set Includes</p>
            <ul className="mt-2.5 flex flex-col gap-1.5 text-xs text-ink/75">
              {includedItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 bg-ink/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleAddToBag}
            className="flex h-12 flex-1 items-center justify-center gap-2 bg-ink text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ShoppingBag className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span>{product.inStock ? 'Add to bag' : 'Sold out'}</span>
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="flex h-12 items-center justify-center border border-hairline px-5 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}
