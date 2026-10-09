'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { useAppSelector } from '@/lib/hooks'
import { getOrders, type OrderRecord } from '@/lib/account'
import { getSampleById } from '@/lib/pricing'

export function OrderConfirmation({ initialOrderId }: { initialOrderId?: string }) {
  const searchParams = useSearchParams()
  const hydrated = useAppSelector((state) => state.ui.hydrated)
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [loaded, setLoaded] = useState(false)

  const paramOrderId = searchParams.get('orderId') ?? initialOrderId ?? ''

  useEffect(() => {
    if (!hydrated) return
    const orders = getOrders()
    if (orders.length === 0) {
      setOrder(null)
      setLoaded(true)
      return
    }
    const matched = paramOrderId
      ? orders.find((item) => item.id.toUpperCase() === paramOrderId.toUpperCase())
      : undefined
    setOrder(matched ?? orders[0] ?? null)
    setLoaded(true)
  }, [hydrated, paramOrderId])

  if (!hydrated || !loaded) {
    return (
      <div className="mx-auto max-w-4xl px-3 py-16 sm:px-4">
        <div className="h-96 w-full animate-pulse bg-tile/60" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-3 py-16 sm:px-4 md:py-24">
        <Breadcrumbs items={[{ label: 'Order Confirmation' }]} />
        <div className="mt-8 border border-hairline bg-cream/30 px-6 py-20 text-center">
          <p className="label-caps text-ink/55">No Recent Orders Found</p>
          <h1 className="mt-3 font-heading text-3xl font-normal text-ink md:text-4xl">
            We could not locate an order on this device
          </h1>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-ink/60">
            Explore our collection of small-batch Eau de Parfums, conditioning body mists,
            and discovery coffrets to place your first order.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center bg-ink px-8 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Explore the shop
            </Link>
            <Link href="/account?tab=orders" className="link-underline">
              View account orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const sample = getSampleById(order.sample ?? null)
  const formattedCreatedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-4xl px-3 py-12 sm:px-4 md:py-20">
      <Breadcrumbs items={[{ label: 'Order Confirmation' }]} />

      {/* Confirmation Hero Header */}
      <div className="border border-hairline bg-cream/40 p-8 text-center md:p-12">
        <div className="mx-auto flex size-11 items-center justify-center border border-ink bg-bg text-ink">
          <CheckCircle2 className="size-5" strokeWidth={1.5} />
        </div>
        <p className="label-caps mt-4 text-ink/60">
          Order #{order.id} · {order.status}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-normal text-ink md:text-5xl">
          Thank you for your order
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-ink/65">
          A confirmation has been dispatched to{' '}
          <span className="font-medium text-ink">{order.contact.email}</span>. Our cellar is
          now preparing your flacons for regulated courier dispatch.
        </p>
      </div>

      {/* Key Metadata Bar */}
      <div className="mt-6 grid grid-cols-2 gap-4 border border-hairline bg-bg p-6 sm:grid-cols-4">
        <div>
          <p className="label-caps text-[10px] text-ink/55">Order Number</p>
          <p className="mt-1 font-mono text-xs font-medium text-ink">{order.id}</p>
        </div>
        <div>
          <p className="label-caps text-[10px] text-ink/55">Date Placed</p>
          <p className="mt-1 text-xs font-medium text-ink">{formattedCreatedDate}</p>
        </div>
        <div>
          <p className="label-caps text-[10px] text-ink/55">Estimated Delivery</p>
          <p className="mt-1 text-xs font-medium text-ink">{order.estimatedDelivery}</p>
        </div>
        <div>
          <p className="label-caps text-[10px] text-ink/55">Status</p>
          <span className="mt-1 inline-block border border-ink px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-ink">
            {order.status}
          </span>
        </div>
      </div>

      {/* Items + Details Grid */}
      <div className="mt-8 grid gap-8 md:grid-cols-[1.25fr_0.75fr]">
        {/* Left: Ordered Items */}
        <section
          aria-label="Ordered items"
          className="border border-hairline bg-bg p-6 md:p-8"
        >
          <h2 className="font-heading text-2xl font-normal text-ink">
            Fragrances Ordered
          </h2>

          <div className="mt-6 divide-y divide-hairline border-t border-hairline">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.volumeLabel}`}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative size-16 shrink-0 bg-cream"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-heading text-xl text-ink hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink/60">
                      {item.volumeLabel} × {item.qty}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-ink">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            ))}

            {sample && (
              <div className="flex items-center justify-between py-4 text-xs">
                <span className="inline-flex items-center gap-2 text-ink/75">
                  <Sparkles className="size-3.5 text-ink" />
                  <span>Complimentary Sample: {sample.name}</span>
                </span>
                <span className="label-caps text-[10px] text-ink">Included</span>
              </div>
            )}
          </div>

          {/* Totals */}
          <dl className="mt-6 space-y-2.5 border-t border-hairline pt-5 text-xs">
            <div className="flex justify-between text-ink/75">
              <dt>Subtotal</dt>
              <dd>${order.totals.subtotal.toFixed(2)}</dd>
            </div>
            {order.totals.discount > 0 && (
              <div className="flex justify-between font-medium text-ink">
                <dt>
                  Promotional Discount{order.promoCode ? ` (${order.promoCode})` : ''}
                </dt>
                <dd>-${order.totals.discount.toFixed(2)}</dd>
              </div>
            )}
            <div className="flex justify-between text-ink/75">
              <dt>Shipping ({order.delivery.label})</dt>
              <dd>
                {order.totals.shipping === 0
                  ? 'Complimentary'
                  : `$${order.totals.shipping.toFixed(2)}`}
              </dd>
            </div>
            <div className="flex justify-between text-ink/75">
              <dt>Estimated Tax (8%)</dt>
              <dd>${order.totals.tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-t border-hairline pt-3 text-sm font-semibold text-ink">
              <dt>Total Paid</dt>
              <dd>${order.totals.total.toFixed(2)}</dd>
            </div>
          </dl>
        </section>

        {/* Right: Shipping, Delivery & Payment */}
        <aside className="space-y-6 border border-hairline bg-cream/30 p-6 md:p-8">
          <div>
            <p className="label-caps text-[10px] text-ink/55">Shipping Address</p>
            <p className="mt-2 text-xs font-medium text-ink">{order.address.fullName}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink/70">
              {order.address.streetAddress}
              <br />
              {order.address.city}, {order.address.postalCode}
              <br />
              {order.address.country}
            </p>
          </div>

          <div className="border-t border-hairline pt-5">
            <p className="label-caps text-[10px] text-ink/55">Contact Details</p>
            <p className="mt-2 text-xs text-ink/75">{order.contact.email}</p>
            <p className="mt-1 text-xs text-ink/75">{order.contact.phone}</p>
          </div>

          <div className="border-t border-hairline pt-5">
            <p className="label-caps text-[10px] text-ink/55">Delivery Method</p>
            <p className="mt-2 text-xs font-medium text-ink">{order.delivery.label}</p>
            <p className="mt-1 text-xs text-ink/65">
              {order.delivery.eta} · Est. {order.estimatedDelivery}
            </p>
          </div>

          <div className="border-t border-hairline pt-5">
            <p className="label-caps text-[10px] text-ink/55">Payment Method</p>
            <p className="mt-2 text-xs font-medium text-ink">{order.paymentMethod}</p>
          </div>
        </aside>
      </div>

      {/* Footer Actions */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
        <Link
          href="/account?tab=orders"
          className="inline-flex h-12 items-center justify-center bg-ink px-8 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          View order in account
        </Link>
        <Link href="/shop" className="link-underline">
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
