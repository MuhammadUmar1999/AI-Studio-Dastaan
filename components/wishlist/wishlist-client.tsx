'use client'

import Link from 'next/link'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ProductTile } from '@/components/product/product-tile'
import { products, type Product } from '@/data/products'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addItem, toggle } from '@/lib/store'

export function WishlistClient() {
  const dispatch = useAppDispatch()
  const hydrated = useAppSelector((state) => state.ui.hydrated)
  const wishlistIds = useAppSelector((state) => state.wishlist.ids)

  const savedProducts = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter((item): item is Product => Boolean(item))

  const handleMoveToBag = (product: Product) => {
    if (!product.inStock) return
    const firstVolume = product.volumes[0] ?? { label: '100 ml', price: product.price }
    dispatch(
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: firstVolume.price,
        volumeLabel: firstVolume.label,
        qty: 1,
        image: product.images[0],
      })
    )
    dispatch(toggle(product.id))
    toast.success(`${product.name} (${firstVolume.label}) moved to your bag.`)
  }

  const handleRemove = (product: Product) => {
    dispatch(toggle(product.id))
    toast.success(`${product.name} removed from wishlist.`)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      <div className="border-b border-hairline pb-8">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="label-caps text-ink/55">Saved Creations</p>
            <h1 className="mt-2 font-heading text-4xl font-normal text-ink md:text-5xl">
              Your Wishlist
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink/60">
              Your personal curation of Dastaan perfumes kept ready for your next ritual.
            </p>
          </div>
          {hydrated && (
            <p className="label-caps text-ink/55" aria-live="polite">
              {savedProducts.length}{' '}
              {savedProducts.length === 1 ? 'saved fragrance' : 'saved fragrances'}
            </p>
          )}
        </div>
      </div>

      {!hydrated ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="aspect-square w-full animate-pulse bg-tile/60" />
              <div className="mx-auto h-4 w-2/3 animate-pulse bg-tile/60" />
              <div className="h-10 w-full animate-pulse bg-tile/60" />
            </div>
          ))}
        </div>
      ) : savedProducts.length === 0 ? (
        <div className="my-16 border border-hairline bg-cream/30 px-6 py-20 text-center">
          <p className="label-caps text-ink/55">Empty Wardrobe</p>
          <h2 className="mt-3 font-heading text-3xl font-normal text-ink">
            Your wishlist is currently empty
          </h2>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-ink/60">
            Save your favorite Eau de Parfums, conditioning body mists, and gift coffrets as
            you explore the house collection.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center bg-ink px-8 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Explore the shop
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
          {savedProducts.map((product) => (
            <div key={product.id} className="flex flex-col justify-between">
              <ProductTile product={product} showQuickAdd={false} />

              <div className="mt-4 flex flex-col gap-2">
                {product.inStock ? (
                  <button
                    type="button"
                    onClick={() => handleMoveToBag(product)}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 bg-ink px-4 text-[10px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <ShoppingBag className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    <span>Move to bag</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex h-10 w-full cursor-not-allowed items-center justify-center border border-hairline bg-cream/60 px-4 text-[10px] uppercase tracking-[0.14em] text-ink/50"
                  >
                    Sold out
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(product)}
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 border border-hairline bg-transparent px-3 text-[10px] uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <Trash2 className="size-3" strokeWidth={1.5} aria-hidden="true" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
