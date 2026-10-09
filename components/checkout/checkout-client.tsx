'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Lock, Tag, X, Sparkles, Check } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { clear, setPromoCode } from '@/lib/store'
import {
  calculatePricing,
  DELIVERY_METHODS,
  getDeliveryMethod,
  getSampleById,
  isValidPromoCode,
  VALID_PROMO_CODE,
  type DeliveryMethodId,
} from '@/lib/pricing'
import {
  CHECKOUT_PROGRESS_SESSION_KEY,
  computeEstimatedDeliveryDate,
  generateOrderId,
  getCurrentUser,
  saveOrder,
  type OrderRecord,
  type SavedAddress,
} from '@/lib/account'

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'France',
  'United Arab Emirates',
  'Canada',
  'Germany',
  'Italy',
  'Japan',
  'Australia',
] as const

const STEPS = [
  { id: 0, key: 'contact', label: '01 · Contact' },
  { id: 1, key: 'address', label: '02 · Shipping' },
  { id: 2, key: 'delivery', label: '03 · Delivery' },
  { id: 3, key: 'payment', label: '04 · Payment' },
  { id: 4, key: 'review', label: '05 · Review' },
] as const

const contactStepSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number (at least 7 digits).')
    .regex(/^[+\d\s()-]+$/, 'Phone number may only contain digits, spaces, and + ( ) -.'),
})

const addressStepSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter the recipient’s full name.'),
  country: z.string().trim().min(2, 'Please select a destination country.'),
  city: z.string().trim().min(2, 'Please enter your city.'),
  streetAddress: z
    .string()
    .trim()
    .min(5, 'Please enter your street address and apartment/suite.'),
  postalCode: z.string().trim().min(3, 'Please enter a valid postal or ZIP code.'),
})

function passesLuhn(digits: string): boolean {
  if (!/^\d{13,19}$/.test(digits)) return false
  if (/^0+$/.test(digits)) return false
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

function isValidExpiry(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim())
  if (!match) return false
  const month = Number(match[1])
  const year2 = Number(match[2])
  if (month < 1 || month > 12) return false
  const now = new Date()
  const currentYear2 = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1
  if (year2 < currentYear2) return false
  if (year2 === currentYear2 && month < currentMonth) return false
  return true
}

const cardValidationSchema = z.object({
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((digits) => passesLuhn(digits), {
      message: 'Enter a valid card number (for demo, try 4242 4242 4242 4242).',
    }),
  cardExpiry: z
    .string()
    .trim()
    .refine((val) => isValidExpiry(val), {
      message: 'Enter a valid future expiry in MM/YY format (e.g. 08/29).',
    }),
  cardCvc: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, 'Enter a 3 or 4 digit security code (CVC).'),
})

// SessionStorage schema: strictly excludes card number, expiry, and CVC
const checkoutProgressSchema = z.object({
  step: z.number().int().min(0).max(4).default(0),
  contact: z
    .object({
      email: z.string().default(''),
      phone: z.string().default(''),
    })
    .default({ email: '', phone: '' }),
  address: z
    .object({
      fullName: z.string().default(''),
      country: z.string().default('United States'),
      city: z.string().default(''),
      streetAddress: z.string().default(''),
      postalCode: z.string().default(''),
    })
    .default({
      fullName: '',
      country: 'United States',
      city: '',
      streetAddress: '',
      postalCode: '',
    }),
  deliveryMethod: z.enum(['standard', 'express', 'same-day']).default('standard'),
  paymentType: z.enum(['card', 'cod']).default('card'),
  billingSameAsShipping: z.boolean().default(true),
  billingAddress: z
    .object({
      fullName: z.string().default(''),
      country: z.string().default('United States'),
      city: z.string().default(''),
      streetAddress: z.string().default(''),
      postalCode: z.string().default(''),
    })
    .default({
      fullName: '',
      country: 'United States',
      city: '',
      streetAddress: '',
      postalCode: '',
    }),
})

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return digits
}

export function CheckoutClient() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const hydrated = useAppSelector((state) => state.ui.hydrated)
  const items = useAppSelector((state) => state.cart.items)
  const promoCode = useAppSelector((state) => state.cart.promoCode)
  const sampleId = useAppSelector((state) => state.cart.sample)

  const isPlacingOrderRef = useRef(false)
  const [progressHydrated, setProgressHydrated] = useState(false)

  // Step state (0..4)
  const [step, setStep] = useState(0)

  // Step 1: Contact
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contactErrors, setContactErrors] = useState<{ email?: string; phone?: string }>({})

  // Step 2: Shipping Address
  const [fullName, setFullName] = useState('')
  const [country, setCountry] = useState<string>('United States')
  const [city, setCity] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [addressErrors, setAddressErrors] = useState<
    Partial<Record<'fullName' | 'country' | 'city' | 'streetAddress' | 'postalCode', string>>
  >({})

  // Step 3: Delivery
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodId>('standard')

  // Step 4: Payment (Card details held ONLY in component state, never persisted)
  const [paymentType, setPaymentType] = useState<'card' | 'cod'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardErrors, setCardErrors] = useState<{
    cardNumber?: string
    cardExpiry?: string
    cardCvc?: string
  }>({})
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
  const [billingFullName, setBillingFullName] = useState('')
  const [billingCountry, setBillingCountry] = useState('United States')
  const [billingCity, setBillingCity] = useState('')
  const [billingStreetAddress, setBillingStreetAddress] = useState('')
  const [billingPostalCode, setBillingPostalCode] = useState('')
  const [billingErrors, setBillingErrors] = useState<
    Partial<Record<'fullName' | 'country' | 'city' | 'streetAddress' | 'postalCode', string>>
  >({})

  // Step 5: Submitting
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mobile Summary Collapsible + Promo input
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  // Guard: redirect to /cart if cart is empty after hydration (unless placing order)
  useEffect(() => {
    if (!hydrated) return
    if (items.length === 0 && !isPlacingOrderRef.current) {
      router.replace('/cart')
    }
  }, [hydrated, items.length, router])

  // Hydrate non-sensitive checkout progress from sessionStorage & prefill from logged-in user
  useEffect(() => {
    if (!hydrated || progressHydrated) return

    let loadedStep = 0
    let loadedContact = { email: '', phone: '' }
    let loadedAddress = {
      fullName: '',
      country: 'United States',
      city: '',
      streetAddress: '',
      postalCode: '',
    }
    let loadedDelivery: DeliveryMethodId = 'standard'
    let loadedPaymentType: 'card' | 'cod' = 'card'
    let loadedBillingSame = true
    let loadedBillingAddress = {
      fullName: '',
      country: 'United States',
      city: '',
      streetAddress: '',
      postalCode: '',
    }

    try {
      const raw = sessionStorage.getItem(CHECKOUT_PROGRESS_SESSION_KEY)
      if (raw) {
        const parsed = checkoutProgressSchema.safeParse(JSON.parse(raw))
        if (parsed.success) {
          // If restored step is Review (4) and paymentType is card, step back to Payment (3) since card digits are not stored in sessionStorage
          loadedStep =
            parsed.data.step === 4 && parsed.data.paymentType === 'card'
              ? 3
              : parsed.data.step
          loadedContact = parsed.data.contact
          loadedAddress = parsed.data.address
          loadedDelivery = parsed.data.deliveryMethod
          loadedPaymentType = parsed.data.paymentType
          loadedBillingSame = parsed.data.billingSameAsShipping
          loadedBillingAddress = parsed.data.billingAddress
        }
      }
    } catch {
      // ignore corrupted sessionStorage
    }

    const user = getCurrentUser()
    if (user) {
      setSavedAddresses(user.addresses)
      if (!loadedContact.email) loadedContact.email = user.email
      if (!loadedContact.phone && user.phone) loadedContact.phone = user.phone
      const defaultAddr =
        user.addresses.find((a) => a.isDefault) ?? user.addresses[0]
      if (defaultAddr) {
        if (!loadedAddress.fullName) loadedAddress.fullName = defaultAddr.fullName
        if (!loadedAddress.streetAddress) {
          loadedAddress.country = defaultAddr.country
          loadedAddress.city = defaultAddr.city
          loadedAddress.streetAddress = defaultAddr.streetAddress
          loadedAddress.postalCode = defaultAddr.postalCode
        }
      } else if (!loadedAddress.fullName && user.name) {
        loadedAddress.fullName = user.name
      }
    }

    setStep(loadedStep)
    setEmail(loadedContact.email)
    setPhone(loadedContact.phone)
    setFullName(loadedAddress.fullName)
    setCountry(loadedAddress.country || 'United States')
    setCity(loadedAddress.city)
    setStreetAddress(loadedAddress.streetAddress)
    setPostalCode(loadedAddress.postalCode)
    setDeliveryMethod(loadedDelivery)
    setPaymentType(loadedPaymentType)
    setBillingSameAsShipping(loadedBillingSame)
    setBillingFullName(loadedBillingAddress.fullName)
    setBillingCountry(loadedBillingAddress.country || 'United States')
    setBillingCity(loadedBillingAddress.city)
    setBillingStreetAddress(loadedBillingAddress.streetAddress)
    setBillingPostalCode(loadedBillingAddress.postalCode)
    setProgressHydrated(true)
  }, [hydrated, progressHydrated])

  // Persist non-sensitive progress to sessionStorage
  useEffect(() => {
    if (!progressHydrated || isPlacingOrderRef.current) return
    try {
      const payload = {
        step,
        contact: { email, phone },
        address: { fullName, country, city, streetAddress, postalCode },
        deliveryMethod,
        paymentType,
        billingSameAsShipping,
        billingAddress: {
          fullName: billingFullName,
          country: billingCountry,
          city: billingCity,
          streetAddress: billingStreetAddress,
          postalCode: billingPostalCode,
        },
      }
      sessionStorage.setItem(CHECKOUT_PROGRESS_SESSION_KEY, JSON.stringify(payload))
    } catch {
      // ignore sessionStorage quota errors
    }
  }, [
    progressHydrated,
    step,
    email,
    phone,
    fullName,
    country,
    city,
    streetAddress,
    postalCode,
    deliveryMethod,
    paymentType,
    billingSameAsShipping,
    billingFullName,
    billingCountry,
    billingCity,
    billingStreetAddress,
    billingPostalCode,
  ])

  const pricing = calculatePricing(items, promoCode, deliveryMethod)
  const selectedDelivery = getDeliveryMethod(deliveryMethod)
  const selectedSample = getSampleById(sampleId)

  const focusFirstField = (fieldIds: string[]) => {
    for (const id of fieldIds) {
      const el = document.getElementById(id)
      if (el) {
        el.focus()
        break
      }
    }
  }

  const validateStep0 = (): boolean => {
    const parsed = contactStepSchema.safeParse({ email, phone })
    if (parsed.success) {
      setContactErrors({})
      return true
    }
    const errs: { email?: string; phone?: string } = {}
    const invalidIds: string[] = []
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key === 'email' && !errs.email) {
        errs.email = issue.message
        invalidIds.push('checkout-email')
      }
      if (key === 'phone' && !errs.phone) {
        errs.phone = issue.message
        invalidIds.push('checkout-phone')
      }
    }
    setContactErrors(errs)
    focusFirstField(invalidIds)
    return false
  }

  const validateStep1 = (): boolean => {
    const parsed = addressStepSchema.safeParse({
      fullName,
      country,
      city,
      streetAddress,
      postalCode,
    })
    if (parsed.success) {
      setAddressErrors({})
      return true
    }
    const errs: typeof addressErrors = {}
    const invalidIds: string[] = []
    const fieldMap: Record<string, string> = {
      fullName: 'checkout-fullName',
      country: 'checkout-country',
      city: 'checkout-city',
      streetAddress: 'checkout-streetAddress',
      postalCode: 'checkout-postalCode',
    }
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof addressErrors
      if (key && !errs[key]) {
        errs[key] = issue.message
        if (fieldMap[key]) invalidIds.push(fieldMap[key])
      }
    }
    setAddressErrors(errs)
    focusFirstField(invalidIds)
    return false
  }

  const validateStep3 = (): boolean => {
    let valid = true
    const invalidIds: string[] = []

    if (paymentType === 'card') {
      const parsedCard = cardValidationSchema.safeParse({
        cardNumber,
        cardExpiry,
        cardCvc,
      })
      if (!parsedCard.success) {
        valid = false
        const errs: typeof cardErrors = {}
        const map: Record<string, string> = {
          cardNumber: 'checkout-card-number',
          cardExpiry: 'checkout-card-expiry',
          cardCvc: 'checkout-card-cvc',
        }
        for (const issue of parsedCard.error.issues) {
          const key = issue.path[0] as keyof typeof cardErrors
          if (key && !errs[key]) {
            errs[key] = issue.message
            if (map[key]) invalidIds.push(map[key])
          }
        }
        setCardErrors(errs)
      } else {
        setCardErrors({})
      }
    } else {
      setCardErrors({})
    }

    if (!billingSameAsShipping) {
      const parsedBilling = addressStepSchema.safeParse({
        fullName: billingFullName,
        country: billingCountry,
        city: billingCity,
        streetAddress: billingStreetAddress,
        postalCode: billingPostalCode,
      })
      if (!parsedBilling.success) {
        valid = false
        const bErrs: typeof billingErrors = {}
        const map: Record<string, string> = {
          fullName: 'billing-fullName',
          country: 'billing-country',
          city: 'billing-city',
          streetAddress: 'billing-streetAddress',
          postalCode: 'billing-postalCode',
        }
        for (const issue of parsedBilling.error.issues) {
          const key = issue.path[0] as keyof typeof billingErrors
          if (key && !bErrs[key]) {
            bErrs[key] = issue.message
            if (map[key]) invalidIds.push(map[key])
          }
        }
        setBillingErrors(bErrs)
      } else {
        setBillingErrors({})
      }
    } else {
      setBillingErrors({})
    }

    if (!valid) {
      focusFirstField(invalidIds)
    }
    return valid
  }

  const handleContinue = () => {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    if (step === 3 && !validateStep3()) return
    setStep((prev) => Math.min(4, prev + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleApplyPromo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidPromoCode(promoInput)) {
      setPromoError('Invalid promotional code. Try DASTAAN10 for 10% off.')
      return
    }
    setPromoError('')
    setPromoInput('')
    dispatch(setPromoCode(VALID_PROMO_CODE))
    toast.success('Promotional code DASTAAN10 applied.')
  }

  const handlePlaceOrder = async () => {
    if (isSubmitting || items.length === 0) return
    if (!validateStep0()) {
      setStep(0)
      return
    }
    if (!validateStep1()) {
      setStep(1)
      return
    }
    if (!validateStep3()) {
      setStep(3)
      return
    }

    setIsSubmitting(true)
    isPlacingOrderRef.current = true

    // Simulate 800ms order processing delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const currentUser = getCurrentUser()
    const cleanCardDigits = cardNumber.replace(/\D/g, '')
    const last4 = cleanCardDigits.slice(-4) || '4242'

    const order: OrderRecord = {
      id: generateOrderId(),
      userId: currentUser?.id ?? null,
      items: items.map((item) => ({ ...item })),
      sample: sampleId,
      promoCode,
      address: {
        fullName: fullName.trim(),
        country: country.trim(),
        city: city.trim(),
        streetAddress: streetAddress.trim(),
        postalCode: postalCode.trim(),
      },
      contact: {
        email: email.trim(),
        phone: phone.trim(),
      },
      delivery: {
        method: deliveryMethod,
        label: selectedDelivery.label,
        eta: selectedDelivery.eta,
        price: pricing.shipping,
      },
      paymentMethod:
        paymentType === 'card' ? `Card ending in •••• ${last4}` : 'Cash on Delivery',
      totals: {
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        shipping: pricing.shipping,
        tax: pricing.tax,
        total: pricing.total,
      },
      status: 'Processing',
      createdAt: new Date().toISOString(),
      estimatedDelivery: computeEstimatedDeliveryDate(selectedDelivery.daysToAdd),
    }

    saveOrder(order)
    try {
      sessionStorage.removeItem(CHECKOUT_PROGRESS_SESSION_KEY)
    } catch {
      // ignore storage errors
    }
    dispatch(clear())
    toast.success(`Order ${order.id} confirmed.`)
    router.push(`/order-confirmation?orderId=${encodeURIComponent(order.id)}`)
  }

  if (!hydrated || (items.length === 0 && !isPlacingOrderRef.current)) {
    return (
      <div className="mx-auto max-w-[1440px] px-3 py-16 sm:px-4">
        <div className="h-96 w-full animate-pulse bg-tile/60" />
      </div>
    )
  }

  const cleanLast4 = cardNumber.replace(/\D/g, '').slice(-4)

  const renderOrderSummaryContent = () => (
    <div className="space-y-6">
      <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.volumeLabel}`}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 bg-cream">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-heading text-base text-ink">{item.name}</p>
                <p className="text-[11px] text-ink/60">
                  {item.volumeLabel} × {item.qty}
                </p>
              </div>
            </div>
            <span className="font-medium text-ink">
              ${(item.price * item.qty).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="border-y border-hairline py-4">
        {promoCode ? (
          <div className="flex items-center justify-between border border-ink bg-bg px-3 py-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-ink">
              <Tag className="size-3.5" />
              <span>{promoCode} (10% OFF)</span>
            </span>
            <button
              type="button"
              onClick={() => dispatch(setPromoCode(null))}
              aria-label="Remove promo code"
              className="p-0.5 text-ink/60 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} noValidate>
            <div className="flex gap-2">
              <label htmlFor="checkout-promo" className="sr-only">
                Promo code
              </label>
              <input
                id="checkout-promo"
                type="text"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value)
                  if (promoError) setPromoError('')
                }}
                placeholder="Promo code (DASTAAN10)"
                className="h-9 flex-1 border border-hairline bg-bg px-3 text-xs uppercase tracking-[0.08em] text-ink placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
              />
              <button
                type="submit"
                className="h-9 bg-ink px-4 text-[10px] uppercase tracking-[0.14em] text-white"
              >
                Apply
              </button>
            </div>
            <div aria-live="polite">
              {promoError && (
                <p className="mt-1.5 text-xs text-red-700" role="alert">
                  {promoError}
                </p>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Breakdown */}
      <dl className="space-y-2.5 text-xs">
        <div className="flex justify-between text-ink/75">
          <dt>Subtotal</dt>
          <dd>${pricing.subtotal.toFixed(2)}</dd>
        </div>

        {pricing.discount > 0 && (
          <div className="flex justify-between font-medium text-ink">
            <dt>Discount ({promoCode})</dt>
            <dd>-${pricing.discount.toFixed(2)}</dd>
          </div>
        )}

        <div className="flex justify-between text-ink/75">
          <dt>Shipping ({selectedDelivery.label})</dt>
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
            <dt className="inline-flex items-center gap-1">
              <Sparkles className="size-3 text-ink" />
              <span>Sample ({selectedSample.name})</span>
            </dt>
            <dd>Free</dd>
          </div>
        )}

        <div className="flex justify-between border-t border-hairline pt-3 text-sm font-semibold text-ink">
          <dt>Total</dt>
          <dd>${pricing.total.toFixed(2)}</dd>
        </div>
      </dl>
    </div>
  )

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          items={[
            { label: 'Shopping Bag', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />

        <div className="flex flex-col justify-between gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="label-caps text-ink/55">Private Client Checkout</p>
            <h1 className="mt-2 font-heading text-4xl font-normal text-ink md:text-5xl">
              Complete Your Order
            </h1>
          </div>
          <Link href="/cart" className="link-underline">
            Return to bag
          </Link>
        </div>

        {/* Mobile Collapsible Order Summary */}
        <div className="mt-6 border border-hairline bg-cream/40 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen((prev) => !prev)}
            aria-expanded={mobileSummaryOpen}
            className="flex w-full items-center justify-between px-4 py-3.5 text-xs"
          >
            <span className="inline-flex items-center gap-2 font-medium uppercase tracking-[0.12em] text-ink">
              <span>{mobileSummaryOpen ? 'Hide' : 'Show'} order summary</span>
              {mobileSummaryOpen ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </span>
            <span className="text-sm font-semibold text-ink">
              ${pricing.total.toFixed(2)}
            </span>
          </button>
          {mobileSummaryOpen && (
            <div className="border-t border-hairline p-4">
              {renderOrderSummaryContent()}
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <nav aria-label="Checkout steps" className="mt-8 border-b border-hairline pb-5">
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {STEPS.map((s) => {
              const isCurrent = step === s.id
              const isCompleted = step > s.id
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    disabled={s.id > step}
                    onClick={() => {
                      if (s.id < step) setStep(s.id)
                    }}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`flex w-full items-center justify-between border px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.13em] transition-colors ${
                      isCurrent
                        ? 'border-ink bg-ink text-white'
                        : isCompleted
                        ? 'border-ink/40 bg-cream/60 text-ink hover:border-ink'
                        : 'cursor-not-allowed border-hairline bg-bg text-ink/40'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isCompleted && <Check className="size-3 shrink-0" />}
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* Main Checkout Grid */}
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.35fr_0.85fr] lg:gap-16">
          {/* Left Active Step Panel */}
          <div>
            {/* STEP 0: CONTACT */}
            {step === 0 && (
              <section aria-labelledby="step-contact-heading" className="space-y-6">
                <div>
                  <p className="label-caps text-ink/55">Step 01 of 05</p>
                  <h2
                    id="step-contact-heading"
                    className="mt-1 font-heading text-3xl font-normal text-ink"
                  >
                    Contact Information
                  </h2>
                  <p className="mt-1 text-xs text-ink/60">
                    We will use these details exclusively to send your order confirmation and
                    courier tracking updates.
                  </p>
                </div>

                <div className="space-y-5 border border-hairline p-6 md:p-8">
                  <div>
                    <label htmlFor="checkout-email" className="label-caps block text-ink">
                      Email Address
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (contactErrors.email)
                          setContactErrors((prev) => ({ ...prev, email: undefined }))
                      }}
                      placeholder="patron@example.com"
                      aria-invalid={Boolean(contactErrors.email)}
                      aria-describedby={
                        contactErrors.email ? 'error-checkout-email' : undefined
                      }
                      className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                    />
                    <div aria-live="polite">
                      {contactErrors.email && (
                        <p
                          id="error-checkout-email"
                          role="alert"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {contactErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-phone" className="label-caps block text-ink">
                      Telephone Number
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        if (contactErrors.phone)
                          setContactErrors((prev) => ({ ...prev, phone: undefined }))
                      }}
                      placeholder="+1 (212) 555-0148"
                      aria-invalid={Boolean(contactErrors.phone)}
                      aria-describedby={
                        contactErrors.phone ? 'error-checkout-phone' : undefined
                      }
                      className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                    />
                    <div aria-live="polite">
                      {contactErrors.phone && (
                        <p
                          id="error-checkout-phone"
                          role="alert"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {contactErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* STEP 1: SHIPPING ADDRESS */}
            {step === 1 && (
              <section aria-labelledby="step-address-heading" className="space-y-6">
                <div>
                  <p className="label-caps text-ink/55">Step 02 of 05</p>
                  <h2
                    id="step-address-heading"
                    className="mt-1 font-heading text-3xl font-normal text-ink"
                  >
                    Shipping Address
                  </h2>
                  <p className="mt-1 text-xs text-ink/60">
                    Fine perfumery orders require a physical street address for regulated
                    courier delivery.
                  </p>
                </div>

                {savedAddresses.length > 0 && (
                  <div className="border border-hairline bg-cream/35 p-4">
                    <p className="label-caps text-[10px] text-ink/55">
                      Saved Account Addresses
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setFullName(addr.fullName)
                            setCountry(addr.country)
                            setCity(addr.city)
                            setStreetAddress(addr.streetAddress)
                            setPostalCode(addr.postalCode)
                            setAddressErrors({})
                          }}
                          className="border border-hairline bg-bg px-3 py-1.5 text-left text-xs text-ink transition-colors hover:border-ink"
                        >
                          <span className="font-medium">{addr.label}:</span>{' '}
                          {addr.streetAddress}, {addr.city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-5 border border-hairline p-6 md:p-8">
                  <div>
                    <label htmlFor="checkout-fullName" className="label-caps block text-ink">
                      Full Name
                    </label>
                    <input
                      id="checkout-fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value)
                        if (addressErrors.fullName)
                          setAddressErrors((p) => ({ ...p, fullName: undefined }))
                      }}
                      placeholder="Recipient full name"
                      aria-invalid={Boolean(addressErrors.fullName)}
                      aria-describedby={
                        addressErrors.fullName ? 'error-checkout-fullName' : undefined
                      }
                      className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                    />
                    <div aria-live="polite">
                      {addressErrors.fullName && (
                        <p
                          id="error-checkout-fullName"
                          role="alert"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {addressErrors.fullName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="checkout-country" className="label-caps block text-ink">
                        Country / Region
                      </label>
                      <select
                        id="checkout-country"
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value)
                          if (addressErrors.country)
                            setAddressErrors((p) => ({ ...p, country: undefined }))
                        }}
                        aria-invalid={Boolean(addressErrors.country)}
                        className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink focus-visible:border-ink focus-visible:outline-none"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="checkout-city" className="label-caps block text-ink">
                        City
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value)
                          if (addressErrors.city)
                            setAddressErrors((p) => ({ ...p, city: undefined }))
                        }}
                        placeholder="New York"
                        aria-invalid={Boolean(addressErrors.city)}
                        aria-describedby={
                          addressErrors.city ? 'error-checkout-city' : undefined
                        }
                        className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                      />
                      <div aria-live="polite">
                        {addressErrors.city && (
                          <p
                            id="error-checkout-city"
                            role="alert"
                            className="mt-1.5 text-xs text-red-700"
                          >
                            {addressErrors.city}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-[1.4fr_0.6fr]">
                    <div>
                      <label
                        htmlFor="checkout-streetAddress"
                        className="label-caps block text-ink"
                      >
                        Street Address
                      </label>
                      <input
                        id="checkout-streetAddress"
                        type="text"
                        autoComplete="street-address"
                        value={streetAddress}
                        onChange={(e) => {
                          setStreetAddress(e.target.value)
                          if (addressErrors.streetAddress)
                            setAddressErrors((p) => ({ ...p, streetAddress: undefined }))
                        }}
                        placeholder="114 Mercer Street, Apt 4B"
                        aria-invalid={Boolean(addressErrors.streetAddress)}
                        aria-describedby={
                          addressErrors.streetAddress
                            ? 'error-checkout-streetAddress'
                            : undefined
                        }
                        className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                      />
                      <div aria-live="polite">
                        {addressErrors.streetAddress && (
                          <p
                            id="error-checkout-streetAddress"
                            role="alert"
                            className="mt-1.5 text-xs text-red-700"
                          >
                            {addressErrors.streetAddress}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-postalCode"
                        className="label-caps block text-ink"
                      >
                        Postal Code
                      </label>
                      <input
                        id="checkout-postalCode"
                        type="text"
                        autoComplete="postal-code"
                        value={postalCode}
                        onChange={(e) => {
                          setPostalCode(e.target.value)
                          if (addressErrors.postalCode)
                            setAddressErrors((p) => ({ ...p, postalCode: undefined }))
                        }}
                        placeholder="10012"
                        aria-invalid={Boolean(addressErrors.postalCode)}
                        aria-describedby={
                          addressErrors.postalCode
                            ? 'error-checkout-postalCode'
                            : undefined
                        }
                        className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                      />
                      <div aria-live="polite">
                        {addressErrors.postalCode && (
                          <p
                            id="error-checkout-postalCode"
                            role="alert"
                            className="mt-1.5 text-xs text-red-700"
                          >
                            {addressErrors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* STEP 2: DELIVERY METHOD */}
            {step === 2 && (
              <section aria-labelledby="step-delivery-heading" className="space-y-6">
                <div>
                  <p className="label-caps text-ink/55">Step 03 of 05</p>
                  <h2
                    id="step-delivery-heading"
                    className="mt-1 font-heading text-3xl font-normal text-ink"
                  >
                    Delivery Method
                  </h2>
                  <p className="mt-1 text-xs text-ink/60">
                    Standard Delivery is complimentary on orders of $150 or more after
                    promotional discounts.
                  </p>
                </div>

                <fieldset className="space-y-3">
                  <legend className="sr-only">Select delivery method</legend>
                  {DELIVERY_METHODS.map((option) => {
                    const active = deliveryMethod === option.id
                    const effectivePrice =
                      option.id === 'standard' && pricing.qualifiesForFreeShipping
                        ? 0
                        : option.price

                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-between border p-5 transition-colors ${
                          active
                            ? 'border-ink bg-cream/60'
                            : 'border-hairline bg-bg hover:border-ink/50'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="radio"
                            name="delivery-method"
                            value={option.id}
                            checked={active}
                            onChange={() => setDeliveryMethod(option.id)}
                            className="mt-1 accent-ink"
                          />
                          <div>
                            <p className="font-heading text-xl font-normal text-ink">
                              {option.label}
                            </p>
                            <p className="mt-1 text-xs text-ink/60">{option.eta}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          {effectivePrice === 0 ? (
                            <span className="label-caps text-[10px] font-medium text-ink">
                              Complimentary
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-ink">
                              ${effectivePrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </label>
                    )
                  })}
                </fieldset>
              </section>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <section aria-labelledby="step-payment-heading" className="space-y-6">
                <div>
                  <p className="label-caps text-ink/55">Step 04 of 05</p>
                  <h2
                    id="step-payment-heading"
                    className="mt-1 font-heading text-3xl font-normal text-ink"
                  >
                    Payment Method
                  </h2>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink/60">
                    <Lock className="size-3.5 text-ink" />
                    <span>
                      Demo checkout. Card details are held only in memory and never stored.
                    </span>
                  </p>
                </div>

                {/* Payment Type Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={paymentType === 'card'}
                    onClick={() => setPaymentType('card')}
                    className={`h-11 border text-[11px] uppercase tracking-[0.14em] transition-colors ${
                      paymentType === 'card'
                        ? 'border-ink bg-ink text-white'
                        : 'border-hairline bg-bg text-ink hover:border-ink'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    aria-pressed={paymentType === 'cod'}
                    onClick={() => {
                      setPaymentType('cod')
                      setCardErrors({})
                    }}
                    className={`h-11 border text-[11px] uppercase tracking-[0.14em] transition-colors ${
                      paymentType === 'cod'
                        ? 'border-ink bg-ink text-white'
                        : 'border-hairline bg-bg text-ink hover:border-ink'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>

                {paymentType === 'card' ? (
                  <div className="space-y-5 border border-hairline p-6 md:p-8">
                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="checkout-card-number"
                          className="label-caps block text-ink"
                        >
                          Card Number
                        </label>
                        <span className="text-[11px] text-muted">
                          Demo: 4242 4242 4242 4242
                        </span>
                      </div>
                      <input
                        id="checkout-card-number"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={cardNumber}
                        onChange={(e) => {
                          setCardNumber(formatCardNumber(e.target.value))
                          if (cardErrors.cardNumber)
                            setCardErrors((p) => ({ ...p, cardNumber: undefined }))
                        }}
                        placeholder="4242 4242 4242 4242"
                        aria-invalid={Boolean(cardErrors.cardNumber)}
                        aria-describedby={
                          cardErrors.cardNumber ? 'error-card-number' : undefined
                        }
                        className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 font-mono text-xs tracking-wider text-ink placeholder:font-sans placeholder:tracking-normal placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                      />
                      <div aria-live="polite">
                        {cardErrors.cardNumber && (
                          <p
                            id="error-card-number"
                            role="alert"
                            className="mt-1.5 text-xs text-red-700"
                          >
                            {cardErrors.cardNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="checkout-card-expiry"
                          className="label-caps block text-ink"
                        >
                          Expiration Date (MM/YY)
                        </label>
                        <input
                          id="checkout-card-expiry"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          value={cardExpiry}
                          onChange={(e) => {
                            setCardExpiry(formatExpiry(e.target.value))
                            if (cardErrors.cardExpiry)
                              setCardErrors((p) => ({ ...p, cardExpiry: undefined }))
                          }}
                          placeholder="08/29"
                          aria-invalid={Boolean(cardErrors.cardExpiry)}
                          aria-describedby={
                            cardErrors.cardExpiry ? 'error-card-expiry' : undefined
                          }
                          className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                        />
                        <div aria-live="polite">
                          {cardErrors.cardExpiry && (
                            <p
                              id="error-card-expiry"
                              role="alert"
                              className="mt-1.5 text-xs text-red-700"
                            >
                              {cardErrors.cardExpiry}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="checkout-card-cvc"
                          className="label-caps block text-ink"
                        >
                          Security Code (CVC)
                        </label>
                        <input
                          id="checkout-card-cvc"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          value={cardCvc}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                            setCardCvc(digits)
                            if (cardErrors.cardCvc)
                              setCardErrors((p) => ({ ...p, cardCvc: undefined }))
                          }}
                          placeholder="123"
                          aria-invalid={Boolean(cardErrors.cardCvc)}
                          aria-describedby={
                            cardErrors.cardCvc ? 'error-card-cvc' : undefined
                          }
                          className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                        />
                        <div aria-live="polite">
                          {cardErrors.cardCvc && (
                            <p
                              id="error-card-cvc"
                              role="alert"
                              className="mt-1.5 text-xs text-red-700"
                            >
                              {cardErrors.cardCvc}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-hairline bg-cream/35 p-6">
                    <h3 className="font-heading text-xl font-normal text-ink">
                      Cash on Delivery
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink/65">
                      Pay in full upon courier presentation at your shipping address. Please
                      have exact payment or card terminal readiness upon arrival.
                    </p>
                  </div>
                )}

                {/* Billing Address Same as Shipping Toggle */}
                <div className="border border-hairline p-5">
                  <label className="flex cursor-pointer items-center gap-3 text-xs text-ink">
                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                      className="size-4 accent-ink"
                    />
                    <span>Billing address is the same as shipping address</span>
                  </label>

                  {!billingSameAsShipping && (
                    <div className="mt-5 space-y-4 border-t border-hairline pt-5">
                      <p className="label-caps text-[10px] text-ink/55">Billing Address</p>
                      <div>
                        <label
                          htmlFor="billing-fullName"
                          className="label-caps block text-ink"
                        >
                          Billing Full Name
                        </label>
                        <input
                          id="billing-fullName"
                          type="text"
                          value={billingFullName}
                          onChange={(e) => setBillingFullName(e.target.value)}
                          className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                        />
                        <div aria-live="polite">
                          {billingErrors.fullName && (
                            <p className="mt-1 text-xs text-red-700" role="alert">
                              {billingErrors.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="billing-country"
                            className="label-caps block text-ink"
                          >
                            Country
                          </label>
                          <select
                            id="billing-country"
                            value={billingCountry}
                            onChange={(e) => setBillingCountry(e.target.value)}
                            className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="billing-city"
                            className="label-caps block text-ink"
                          >
                            City
                          </label>
                          <input
                            id="billing-city"
                            type="text"
                            value={billingCity}
                            onChange={(e) => setBillingCity(e.target.value)}
                            className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                          />
                          <div aria-live="polite">
                            {billingErrors.city && (
                              <p className="mt-1 text-xs text-red-700" role="alert">
                                {billingErrors.city}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
                        <div>
                          <label
                            htmlFor="billing-streetAddress"
                            className="label-caps block text-ink"
                          >
                            Street Address
                          </label>
                          <input
                            id="billing-streetAddress"
                            type="text"
                            value={billingStreetAddress}
                            onChange={(e) => setBillingStreetAddress(e.target.value)}
                            className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                          />
                          <div aria-live="polite">
                            {billingErrors.streetAddress && (
                              <p className="mt-1 text-xs text-red-700" role="alert">
                                {billingErrors.streetAddress}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="billing-postalCode"
                            className="label-caps block text-ink"
                          >
                            Postal Code
                          </label>
                          <input
                            id="billing-postalCode"
                            type="text"
                            value={billingPostalCode}
                            onChange={(e) => setBillingPostalCode(e.target.value)}
                            className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                          />
                          <div aria-live="polite">
                            {billingErrors.postalCode && (
                              <p className="mt-1 text-xs text-red-700" role="alert">
                                {billingErrors.postalCode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* STEP 4: REVIEW & PLACE ORDER */}
            {step === 4 && (
              <section aria-labelledby="step-review-heading" className="space-y-6">
                <div>
                  <p className="label-caps text-ink/55">Step 05 of 05</p>
                  <h2
                    id="step-review-heading"
                    className="mt-1 font-heading text-3xl font-normal text-ink"
                  >
                    Review Your Order
                  </h2>
                  <p className="mt-1 text-xs text-ink/60">
                    Please verify your contact, delivery, and payment details before placing
                    your order.
                  </p>
                </div>

                <div className="divide-y divide-hairline border border-hairline">
                  {/* Contact Summary */}
                  <div className="flex items-start justify-between gap-4 p-5">
                    <div>
                      <p className="label-caps text-[10px] text-ink/55">Contact</p>
                      <p className="mt-1 text-xs font-medium text-ink">{email}</p>
                      <p className="text-xs text-ink/65">{phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="link-underline text-[10px]"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Shipping Address Summary */}
                  <div className="flex items-start justify-between gap-4 p-5">
                    <div>
                      <p className="label-caps text-[10px] text-ink/55">Shipping Address</p>
                      <p className="mt-1 text-xs font-medium text-ink">{fullName}</p>
                      <p className="text-xs text-ink/65">
                        {streetAddress}, {city}, {postalCode}, {country}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="link-underline text-[10px]"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Delivery Summary */}
                  <div className="flex items-start justify-between gap-4 p-5">
                    <div>
                      <p className="label-caps text-[10px] text-ink/55">Delivery Method</p>
                      <p className="mt-1 text-xs font-medium text-ink">
                        {selectedDelivery.label} (
                        {pricing.shipping === 0
                          ? 'Complimentary'
                          : `$${pricing.shipping.toFixed(2)}`}
                        )
                      </p>
                      <p className="text-xs text-ink/65">{selectedDelivery.eta}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="link-underline text-[10px]"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Payment Summary */}
                  <div className="flex items-start justify-between gap-4 p-5">
                    <div>
                      <p className="label-caps text-[10px] text-ink/55">Payment</p>
                      <p className="mt-1 text-xs font-medium text-ink">
                        {paymentType === 'card'
                          ? `Card ending in •••• ${cleanLast4 || '4242'}`
                          : 'Cash on Delivery'}
                      </p>
                      <p className="text-xs text-ink/65">
                        {billingSameAsShipping
                          ? 'Billing address same as shipping'
                          : `Billing: ${billingStreetAddress}, ${billingCity}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="link-underline text-[10px]"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Items in Review */}
                <div className="border border-hairline p-5">
                  <p className="label-caps text-[10px] text-ink/55">
                    Items in Your Order ({items.reduce((s, i) => s + i.qty, 0)})
                  </p>
                  <div className="mt-4 divide-y divide-hairline">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.volumeLabel}`}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 bg-cream">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-heading text-lg text-ink">{item.name}</p>
                            <p className="text-xs text-ink/60">
                              {item.volumeLabel} × {item.qty}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-ink">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Step Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-hairline pt-6">
              {step > 0 ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleBack}
                  className="h-12 border border-ink bg-transparent px-7 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white disabled:opacity-50"
                >
                  Back
                </button>
              ) : (
                <Link href="/cart" className="link-underline">
                  ← Back to bag
                </Link>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="h-12 bg-ink px-9 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="h-12 min-w-[210px] bg-ink px-9 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {isSubmitting ? 'Placing order...' : `Place order · $${pricing.total.toFixed(2)}`}
                </button>
              )}
            </div>
          </div>

          {/* Right Sticky Order Summary (Desktop) */}
          <aside
            aria-label="Order summary"
            className="hidden border border-hairline bg-cream/30 p-6 md:p-8 lg:sticky lg:top-24 lg:block"
          >
            <h2 className="mb-6 font-heading text-2xl font-normal text-ink">
              Order Summary
            </h2>
            {renderOrderSummaryContent()}
          </aside>
        </div>
      </div>
    </div>
  )
}
