'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { removeItem, selectCartCount, selectSubtotal, setQty } from '@/lib/store'

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const items = useAppSelector((s) => s.cart.items)
  const subtotal = useAppSelector(selectSubtotal)
  const count = useAppSelector(selectCartCount)
  const dispatch = useAppDispatch()
  const remaining = Math.max(0, 150 - subtotal)

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
            <Link href="/shop" onClick={() => onOpenChange(false)} className="link-underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="flex h-full flex-col p-6">
            <div className="flex-1 overflow-y-auto">
              <div className="mb-6 bg-cream p-4 text-xs">
                {remaining > 0 ? (
                  <>You&apos;re {`$${remaining.toFixed(2)}`} away from free shipping.</>
                ) : (
                  'You qualify for free shipping.'
                )}
                <div className="mt-3 h-1 bg-ink/15">
                  <div
                    className="h-full bg-ink transition-[width]"
                    style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.volumeLabel}`} className="flex gap-4">
                    <div className="relative size-20 shrink-0 bg-cream">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-heading text-lg">{item.name}</p>
                          <p className="text-xs text-ink/55">{item.volumeLabel}</p>
                        </div>
                        <p className="text-sm">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-hairline">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              dispatch(
                                setQty({
                                  productId: item.productId,
                                  volumeLabel: item.volumeLabel,
                                  qty: item.qty - 1,
                                })
                              )
                            }
                            className="flex size-8 items-center justify-center"
                          >
                            <Minus />
                          </button>
                          <span className="w-7 text-center text-xs">{item.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              dispatch(
                                setQty({
                                  productId: item.productId,
                                  volumeLabel: item.volumeLabel,
                                  qty: item.qty + 1,
                                })
                              )
                            }
                            className="flex size-8 items-center justify-center"
                          >
                            <Plus />
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
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-hairline pt-5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
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
