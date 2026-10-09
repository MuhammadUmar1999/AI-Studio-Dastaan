import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OrderConfirmation } from '@/components/checkout/order-confirmation-client'

export const metadata: Metadata = {
  title: 'Order Confirmation | Dastaan',
  description: 'Thank you for your order with the House of Dastaan.',
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams

  return (
    <main>
      <Suspense
        fallback={
          <div className="mx-auto max-w-4xl px-3 py-16 sm:px-4">
            <div className="h-96 w-full animate-pulse bg-tile/60" />
          </div>
        }
      >
        <OrderConfirmation initialOrderId={orderId} />
      </Suspense>
    </main>
  )
}

