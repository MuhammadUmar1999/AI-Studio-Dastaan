'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Minus, Plus, Trash2, Tag, X, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { FreeShippingProgress } from './free-shipping-progress'
import { ProductTile } from '@/components/product/product-tile'
import { products } from '@/data/products'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  changeVolume,
  removeItem,
  selectCartCount,
  setPromoCode,
  setQty,
  setSample,
} from '@/lib/store'
import {
  calculatePricing,
  COMPLIMENTARY_SAMPLES,
  isValidPromoCode,
  VALID_PROMO_CODE,
} from '@/lib/pricing'

const promoInputSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Please enter a promo code.')
    .refine((val) => isValidPromoCode(val), {
      message: 'Invalid promotional code. Try DASTAAN10 for 10% off.',
    }),
})

export function CartClient() {
  const dispatch = useAppDispatch()
  const hydrated = useAppSelector((state) => state.ui.hydrated)
  const items = useAppSelector((state) => state.cart.items)
  const promoCode = useAppSelector((state) => state.cart.promoCode)
  const selectedSample = useAppSelector((state) => state.cart.sample)
  const count = useAppSelector(selectCartCount)

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  const pricing = calculatePricing(items, promoCode, 'standard')

  const cartProductIds = new Set(items.map((item) => item.productId))
  const recommendations = products
    .filter((product) => product.inStock && !cartProductIds.has(product.id))
    .slice(0, 4)

  const handleApplyPromo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = promoInputSchema.safeParse({ code: promoInput })
    if (!parsed.success) {
      setPromoError(
        parsed.error.issues[0]?.message ?? 'Invalid promotional code.'
      )
      return
    }
    setPromoError('')
    setPromoInput('')
    dispatch(setPromoCode(VALID_PROMO_CODE))
    toast.success('Promotional code DASTAAN10 applied (10% off).')
  }

  const handleRemovePromo = () => {
    dispatch(setPromoCode(null))
    setPromoError('')
    toast.success('Promotional code removed.')
  }

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      <div className="border-b border-hairline pb-8">
        <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="label-caps text-ink/55">Atelier Selection</p>
            <h1 className="mt-2 font-heading text-4xl font-normal text-ink md:text-5xl">
              Your Shopping Bag
            </h1>
          </div>
          {hydrated && (
            <p className="label-caps text-ink/55" aria-live="polite">
              {count} {count === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>
      </div>

      {!hydrated ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="space-y-4">
            <div className="h-20 w-full animate-pulse bg-tile/60" />
            <div className="h-36 w-full animate-pulse bg-tile/60" />
            <div className="h-36 w-full animate-pulse bg-tile/60" />
          </div>
          <div className="h-96 w-full animate-pulse bg-tile/60" />
        </div>
      ) : items.length === 0 ? (
        <div className="my-16 border border-hairline bg-cream/30 px-6 py-20 text-center">
          <p className="label-caps text-ink/55">Your Bag Is Empty</p>
          <h2 className="mt-3 font-heading text-3xl font-normal text-ink">
            Begin your fragrance story
          </h2>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-ink/60">
            Explore our collection of small-batch Eau de Parfums, conditioning body mists,
            and signature gift coffrets.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center bg-ink px-8 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.45fr_0.85fr] lg:gap-16">
          {/* Left Column: Progress Bar, Line Items, Complimentary Sample Selector */}
          <div className="space-y-10">
            <FreeShippingProgress afterDiscountSubtotal={pricing.afterDiscount} />

            {/* Line Items */}
            <section aria-label="Shopping bag items">
              <div className="divide-y divide-hairline border-y border-hairline">
                {items.map((item) => {
                  const catalogProduct = products.find((p) => p.id === item.productId)
                  const volumeOptions = catalogProduct?.volumes ?? [
                    { label: item.volumeLabel, price: item.price },
                  ]

                  return (
                    <article
                      key={`${item.productId}-${item.volumeLabel}`}
                      className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        className="relative aspect-square w-24 shrink-0 overflow-hidden bg-cream sm:w-28"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-2">
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-heading text-2xl font-normal text-ink hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-ink/60">
                            Unit price: ${item.price.toFixed(2)}
                          </p>

                          <div className="pt-1">
                            <label
                              htmlFor={`cart-volume-${item.productId}-${item.volumeLabel}`}
                              className="label-caps mr-2 text-[10px] text-ink/55"
                            >
                              Volume:
                            </label>
                            {volumeOptions.length > 1 ? (
                              <select
                                id={`cart-volume-${item.productId}-${item.volumeLabel}`}
                                value={item.volumeLabel}
                                onChange={(e) => {
                                  const target = volumeOptions.find(
                                    (v) => v.label === e.target.value
                                  )
                                  if (!target) return
                                  dispatch(
                                    changeVolume({
                                      productId: item.productId,
                                      oldVolumeLabel: item.volumeLabel,
                                      newVolumeLabel: target.label,
                                      newPrice: target.price,
                                    })
                                  )
                                  toast.success(
                                    `Updated ${item.name} volume to ${target.label}.`
                                  )
                                }}
                                className="h-8 border border-hairline bg-bg px-2.5 text-xs text-ink focus-visible:border-ink focus-visible:outline-none"
                              >
                                {volumeOptions.map((vol) => (
                                  <option key={vol.label} value={vol.label}>
                                    {vol.label} (${vol.price})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-xs text-ink">{item.volumeLabel}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-6 sm:justify-end">
                          {/* Quantity Stepper (1 - 10) */}
                          <div className="flex items-center border border-hairline">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              disabled={item.qty <= 1}
                              onClick={() =>
                                dispatch(
                                  setQty({
                                    productId: item.productId,
                                    volumeLabel: item.volumeLabel,
                                    qty: Math.max(1, item.qty - 1),
                                  })
                                )
                              }
                              className="flex size-9 items-center justify-center text-ink disabled:opacity-35"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span
                              className="w-9 text-center text-xs font-medium"
                              aria-live="polite"
                            >
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              disabled={item.qty >= 10}
                              onClick={() =>
                                dispatch(
                                  setQty({
                                    productId: item.productId,
                                    volumeLabel: item.volumeLabel,
                                    qty: Math.min(10, item.qty + 1),
                                  })
                                )
                              }
                              className="flex size-9 items-center justify-center text-ink disabled:opacity-35"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>

                          <div className="min-w-[76px] text-right">
                            <p className="text-sm font-semibold text-ink">
                              ${(item.price * item.qty).toFixed(2)}
                            </p>
                          </div>

                          <button
                            type="button"
                            aria-label={`Remove ${item.name} (${item.volumeLabel}) from bag`}
                            onClick={() => {
                              dispatch(
                                removeItem({
                                  productId: item.productId,
                                  volumeLabel: item.volumeLabel,
                                })
                              )
                              toast.success(`${item.name} removed from your bag.`)
                            }}
                            className="p-1.5 text-ink/55 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            {/* Complimentary Sample Selector */}
            <section
              aria-label="Complimentary sample selection"
              className="border border-hairline bg-cream/35 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-ink" strokeWidth={1.5} />
                  <h2 className="font-heading text-2xl font-normal text-ink">
                    Complimentary Atelier Sample
                  </h2>
                </div>
                <span className="label-caps text-[10px] text-ink/55">
                  Choose 1 of 3 · Included Free
                </span>
              </div>
              <p className="mt-1.5 text-xs text-ink/65">
                Select a complimentary 2 ml glass atomizer to accompany your order.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {COMPLIMENTARY_SAMPLES.map((sample) => {
                  const active = selectedSample === sample.id
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        dispatch(setSample(active ? null : sample.id))
                      }
                      className={`flex flex-col justify-between border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                        active
                          ? 'border-ink bg-ink text-white'
                          : 'border-hairline bg-bg text-ink hover:border-ink'
                      }`}
                    >
                      <div>
                        <p className="font-heading text-lg font-normal">{sample.name}</p>
                        <p
                          className={`mt-1 text-[11px] leading-relaxed ${
                            active ? 'text-white/75' : 'text-ink/60'
                          }`}
                        >
                          {sample.notes}
                        </p>
                      </div>
                      <span
                        className={`label-caps mt-4 inline-block text-[9px] ${
                          active ? 'text-white' : 'text-ink/55'
                        }`}
                      >
                        {active ? 'Selected ✓' : 'Select sample'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>

          {/* Right Column: Promo Code + Order Summary */}
          <aside
            aria-label="Order summary"
            className="border border-hairline bg-cream/30 p-6 md:p-8 lg:sticky lg:top-24"
          >
            <h2 className="font-heading text-2xl font-normal text-ink">Order Summary</h2>

            {/* Promo Code Field */}
            <div className="mt-6 border-b border-hairline pb-6">
              <p className="label-caps text-[10px] text-ink/60">
                Promotional Code (Try DASTAAN10)
              </p>

              {promoCode ? (
                <div className="mt-3 flex items-center justify-between border border-ink bg-bg px-3.5 py-2.5 text-xs">
                  <span className="inline-flex items-center gap-2 font-medium text-ink">
                    <Tag className="size-3.5" />
                    <span>{promoCode} · 10% OFF applied</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    aria-label="Remove promotional code"
                    className="p-1 text-ink/60 hover:text-ink"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} noValidate className="mt-2.5">
                  <div className="flex gap-2">
                    <label htmlFor="cart-promo-input" className="sr-only">
                      Promo code
                    </label>
                    <input
                      id="cart-promo-input"
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value)
                        if (promoError) setPromoError('')
                      }}
                      placeholder="Enter code (DASTAAN10)"
                      aria-invalid={Boolean(promoError)}
                      aria-describedby={promoError ? 'cart-promo-error' : undefined}
                      className="h-10 flex-1 border border-hairline bg-bg px-3 text-xs uppercase tracking-[0.08em] text-ink placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-10 border border-ink bg-ink px-5 text-[10px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
                    >
                      Apply
                    </button>
                  </div>
                  <div aria-live="polite">
                    {promoError && (
                      <p
                        id="cart-promo-error"
                        role="alert"
                        className="mt-2 text-xs text-red-700"
                      >
                        {promoError}
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Totals Breakdown */}
            <dl className="mt-6 space-y-3 text-xs">
              <div className="flex justify-between text-ink/75">
                <dt>Subtotal</dt>
                <dd>${pricing.subtotal.toFixed(2)}</dd>
              </div>

              {pricing.discount > 0 && (
                <div className="flex justify-between font-medium text-ink">
                  <dt>Promo Discount ({promoCode})</dt>
                  <dd>-${pricing.discount.toFixed(2)}</dd>
                </div>
              )}

              <div className="flex justify-between text-ink/75">
                <dt>Standard Shipping</dt>
                <dd>
                  {pricing.shipping === 0
                    ? 'Complimentary'
                    : `$${pricing.shipping.toFixed(2)}`}
                </dd>
              </div>

              <div className="flex justify-between text-ink/75">
                <dt>Estimated Tax (8%)</dt>
                <dd>${pricing.tax.toFixed(2)}</dd>
              </div>

              {selectedSample && (
                <div className="flex justify-between text-ink/75">
                  <dt>
                    Sample (
                    {COMPLIMENTARY_SAMPLES.find((s) => s.id === selectedSample)?.name ??
                      'Selected'}
                    )
                  </dt>
                  <dd>Free</dd>
                </div>
              )}

              <div className="flex justify-between border-t border-hairline pt-4 text-sm font-semibold text-ink">
                <dt>Estimated Total</dt>
                <dd>${pricing.total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Link
                href="/checkout"
                className="flex h-12 w-full items-center justify-center bg-ink text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Checkout
              </Link>
              <Link href="/shop" className="link-underline">
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* You May Also Like Row */}
      {recommendations.length > 0 && (
        <section
          aria-label="Recommended fragrances"
          className="mt-24 border-t border-hairline pt-16"
        >
          <p className="label-caps text-center text-ink/55">Complete Your Wardrobe</p>
          <h2 className="mt-2 text-center font-heading text-3xl font-normal text-ink">
            You may also like
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {recommendations.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
