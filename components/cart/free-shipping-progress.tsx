'use client'

import { FREE_SHIPPING_THRESHOLD } from '@/lib/pricing'

type FreeShippingProgressProps = {
  afterDiscountSubtotal: number
  className?: string
}

export function FreeShippingProgress({
  afterDiscountSubtotal,
  className = '',
}: FreeShippingProgressProps) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscountSubtotal)
  const percent = Math.min(
    100,
    Math.round((afterDiscountSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  )

  return (
    <div
      className={`border border-hairline bg-cream p-4 text-xs ${className}`}
      role="region"
      aria-label="Free shipping progress"
    >
      <p className="text-ink/85" aria-live="polite">
        {remaining > 0 ? (
          <>
            You&apos;re <span className="font-medium text-ink">${remaining.toFixed(2)}</span>{' '}
            away from complimentary standard shipping.
          </>
        ) : (
          <span className="font-medium text-ink">
            You qualify for complimentary standard shipping ($150+ threshold met).
          </span>
        )}
      </p>
      <div
        className="mt-3 h-1 w-full bg-ink/15"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward $150 complimentary shipping"
      >
        <div
          className="h-full bg-ink transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
