import type { CartItem, RootState } from './store'

export const FREE_SHIPPING_THRESHOLD = 150
export const VALID_PROMO_CODE = 'DASTAAN10'
export const PROMO_DISCOUNT_RATE = 0.1
export const TAX_RATE = 0.08

export type DeliveryMethodId = 'standard' | 'express' | 'same-day'

export type DeliveryMethodOption = {
  id: DeliveryMethodId
  label: string
  price: number
  eta: string
  daysToAdd: number
}

export const DELIVERY_METHODS: readonly DeliveryMethodOption[] = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    price: 9,
    eta: '3–5 business days',
    daysToAdd: 4,
  },
  {
    id: 'express',
    label: 'Express Courier',
    price: 19,
    eta: '1–2 business days',
    daysToAdd: 2,
  },
  {
    id: 'same-day',
    label: 'Same-Day Atelier Courier',
    price: 29,
    eta: 'Same evening (orders before 2 PM)',
    daysToAdd: 0,
  },
] as const

export type ComplimentarySample = {
  id: string
  name: string
  notes: string
}

export const COMPLIMENTARY_SAMPLES: readonly ComplimentarySample[] = [
  {
    id: 'ashes-of-moonlight-2ml',
    name: 'Ashes of Moonlight · 2 ml',
    notes: 'Night Jasmine · Coral Rose · Warm Amber',
  },
  {
    id: 'gold-dust-2ml',
    name: 'Gold Dust · 2 ml',
    notes: 'Ceylon Cinnamon · Smoked Oud · Labdanum',
  },
  {
    id: 'luminous-iris-2ml',
    name: 'Luminous Iris · 2 ml',
    notes: 'Florentine Orris · White Tea · Skin Musk',
  },
] as const

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function getDeliveryMethod(id: DeliveryMethodId): DeliveryMethodOption {
  return DELIVERY_METHODS.find((m) => m.id === id) ?? DELIVERY_METHODS[0]
}

export function getSampleById(id: string | null): ComplimentarySample | undefined {
  if (!id) return undefined
  return COMPLIMENTARY_SAMPLES.find((s) => s.id === id)
}

export function isValidPromoCode(code: string): boolean {
  return code.trim().toUpperCase() === VALID_PROMO_CODE
}

export function calculateSubtotal(items: readonly CartItem[]): number {
  return roundCurrency(items.reduce((sum, item) => sum + item.price * item.qty, 0))
}

export function calculateDiscount(subtotal: number, promoCode: string | null): number {
  if (!promoCode || !isValidPromoCode(promoCode) || subtotal <= 0) return 0
  return roundCurrency(subtotal * PROMO_DISCOUNT_RATE)
}

export function calculateShipping(
  subtotalAfterDiscount: number,
  deliveryMethod: DeliveryMethodId = 'standard',
  hasItems = true
): number {
  if (!hasItems || subtotalAfterDiscount <= 0) return 0
  if (deliveryMethod === 'standard' && subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD) {
    return 0
  }
  const method = getDeliveryMethod(deliveryMethod)
  return method.price
}

export function calculateTax(subtotalAfterDiscount: number): number {
  if (subtotalAfterDiscount <= 0) return 0
  return roundCurrency(subtotalAfterDiscount * TAX_RATE)
}

export type PricingBreakdown = {
  subtotal: number
  discount: number
  afterDiscount: number
  shipping: number
  tax: number
  total: number
  qualifiesForFreeShipping: boolean
  amountToFreeShipping: number
  progressPercent: number
}

export function calculatePricing(
  items: readonly CartItem[],
  promoCode: string | null,
  deliveryMethod: DeliveryMethodId = 'standard'
): PricingBreakdown {
  const hasItems = items.length > 0
  const subtotal = calculateSubtotal(items)
  const discount = calculateDiscount(subtotal, promoCode)
  const afterDiscount = roundCurrency(Math.max(0, subtotal - discount))
  const qualifiesForFreeShipping = afterDiscount >= FREE_SHIPPING_THRESHOLD
  const amountToFreeShipping = roundCurrency(
    Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount)
  )
  const progressPercent = Math.min(
    100,
    Math.round((afterDiscount / FREE_SHIPPING_THRESHOLD) * 100)
  )
  const shipping = calculateShipping(afterDiscount, deliveryMethod, hasItems)
  const tax = calculateTax(afterDiscount)
  const total = roundCurrency(afterDiscount + shipping + tax)

  return {
    subtotal,
    discount,
    afterDiscount,
    shipping,
    tax,
    total,
    qualifiesForFreeShipping,
    amountToFreeShipping,
    progressPercent,
  }
}

export function selectPricing(
  state: RootState,
  deliveryMethod: DeliveryMethodId = 'standard'
): PricingBreakdown {
  return calculatePricing(state.cart.items, state.cart.promoCode, deliveryMethod)
}
