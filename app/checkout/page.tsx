'use client'

import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { useAppSelector } from '@/lib/hooks'
import { selectSubtotal } from '@/lib/store'

export default function CheckoutPage() {
  const items = useAppSelector((state) => state.cart.items)
  const subtotal = useAppSelector(selectSubtotal)
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <Breadcrumbs items={[{ label: 'Shopping Bag', href: '/cart' }, { label: 'Checkout' }]} />
      <div className="flex items-end justify-between border-b border-hairline pb-5">
        <div>
          <p className="label-caps text-ink/55">Checkout</p>
          <h1 className="mt-3 font-heading text-4xl font-normal">Complete your order</h1>
        </div>
        <Link href="/shop" className="link-underline">
          Continue shopping
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-heading text-2xl">Your bag is empty</p>
          <Link href="/shop" className="link-underline mt-5">
            Return to collection
          </Link>
        </div>
      ) : (
        <div className="py-10">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.volumeLabel}`}
                className="flex justify-between border-b border-hairline pb-4 text-sm"
              >
                <span>
                  {item.name} · {item.volumeLabel} × {item.qty}
                </span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link
            href="/order-confirmation"
            className="mt-8 flex h-12 w-full items-center justify-center bg-ink text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Continue to payment
          </Link>
          <p className="mt-3 text-center text-xs text-ink/55">
            Payment connection required to complete checkout.
          </p>
        </div>
      )}
    </main>
  )
}
