'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, Sparkles, Tag } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { FreeShippingProgress } from './free-shipping-progress'
import { products } from '@/data/products'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  changeVolume,
  removeItem,
  selectCartCount,
  setQty,
} from '@/lib/store'
import { calculatePricing, getSampleById } from '@/lib/pricing'

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const items = useAppSelector((s) => s.cart.items)
  const promoCode = useAppSelector((s) => s.cart.promoCode)
  const sampleId = useAppSelector((s) => s.cart.sample)
  const count = useAppSelector(selectCartCount)
  const dispatch = useAppDispatch()

  const pricing = calculatePricing(items, promoCode, 'standard')
  const selectedSample = getSampleById(sampleId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md bg-bg p-0">
        <SheetHeader className="border-b border-hairline p-6">
          <SheetTitle className="font-heading text-2xl font-normal">
            Your bag <span className="font-sans text-sm">({count})</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Shopping bag contents</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-[70vh] flex-col items-center justify-center gap-5 p-6 text-center">
            <p className="font-heading text-2xl">Your bag is empty</p>
            <Link
              href="/shop"
              onClick={() => onOpenChange(false)}
              className="link-underline"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="flex h-full flex-col p-6">
            <div className="flex-1 overflow-y-auto pr-1">
              <FreeShippingProgress
                afterDiscountSubtotal={pricing.afterDiscount}
                className="mb-6"
              />

              <div className="flex flex-col gap-5">
                {items.map((item) => {
                  const catalogProduct = products.find((p) => p.id === item.productId)
                  const volumeOptions = catalogProduct?.volumes ?? [
                    { label: item.volumeLabel, price: item.price },
                  ]

                  return (
                    <div
                      key={`${item.productId}-${item.volumeLabel}`}
                      className="flex gap-4 border-b border-hairline pb-5 last:border-b-0"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="relative size-20 shrink-0 bg-cream"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2">
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={() => onOpenChange(false)}
                              className="font-heading text-lg hover:underline"
                            >
                              {item.name}
                            </Link>
                            {volumeOptions.length > 1 ? (
                              <div className="mt-1">
                                <label
                                  htmlFor={`drawer-vol-${item.productId}-${item.volumeLabel}`}
                                  className="sr-only"
                                >
                                  Volume for {item.name}
                                </label>
                                <select
                                  id={`drawer-vol-${item.productId}-${item.volumeLabel}`}
                                  value={item.volumeLabel}
                                  onChange={(e) => {
                                    const nextVol = volumeOptions.find(
                                      (v) => v.label === e.target.value
                                    )
                                    if (!nextVol) return
                                    dispatch(
                                      changeVolume({
                                        productId: item.productId,
                                        oldVolumeLabel: item.volumeLabel,
                                        newVolumeLabel: nextVol.label,
                                        newPrice: nextVol.price,
                                      })
                                    )
                                  }}
                                  className="h-7 border border-hairline bg-bg px-2 text-[11px] text-ink focus-visible:border-ink focus-visible:outline-none"
                                >
                                  {volumeOptions.map((v) => (
                                    <option key={v.label} value={v.label}>
                                      {v.label} · ${v.price}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <p className="text-xs text-ink/55">{item.volumeLabel}</p>
                            )}
                          </div>
                          <p className="text-sm font-medium">
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-hairline">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
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
                              className="flex size-8 items-center justify-center disabled:opacity-35"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs">{item.qty}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
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
                              className="flex size-8 items-center justify-center disabled:opacity-35"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() =>
                              dispatch(
                                removeItem({
                                  productId: item.productId,
                                  volumeLabel: item.volumeLabel,
                                })
                              )
                            }
                            className="text-ink/55 hover:text-ink"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {(selectedSample || promoCode) && (
                <div className="mt-4 space-y-2 border-t border-hairline pt-4 text-xs">
                  {selectedSample && (
                    <div className="flex items-center justify-between text-ink/75">
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-ink" />
                        Sample: {selectedSample.name}
                      </span>
                      <span className="label-caps text-[9px] text-ink/60">Free</span>
                    </div>
                  )}
                  {promoCode && pricing.discount > 0 && (
                    <div className="flex items-center justify-between text-ink">
                      <span className="inline-flex items-center gap-1.5">
                        <Tag className="size-3.5" />
                        Promo: {promoCode} (10% off)
                      </span>
                      <span>-${pricing.discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-hairline pt-5">
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between text-ink/75">
                  <dt>Subtotal</dt>
                  <dd>${pricing.subtotal.toFixed(2)}</dd>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-ink">
                    <dt>Discount ({promoCode})</dt>
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
                <div className="flex justify-between border-t border-hairline pt-2.5 text-sm font-semibold text-ink">
                  <dt>Total</dt>
                  <dd>${pricing.total.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href="/cart"
                  onClick={() => onOpenChange(false)}
                  className="flex h-12 w-full items-center justify-center border border-ink bg-transparent text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  View bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => onOpenChange(false)}
                  className="flex h-12 w-full items-center justify-center bg-ink text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

