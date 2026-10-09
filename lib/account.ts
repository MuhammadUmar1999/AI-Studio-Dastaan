import { z } from 'zod'
import { cartItemSchema } from '@/components/providers/store-provider'

export const USERS_STORAGE_KEY = 'dastaan-users'
export const AUTH_STORAGE_KEY = 'dastaan-auth'
export const ORDERS_STORAGE_KEY = 'dastaan-orders'
export const NOTIFY_STORAGE_KEY = 'dastaan-notify'
export const CHECKOUT_PROGRESS_SESSION_KEY = 'dastaan-checkout-progress'

export const MAX_SAVED_ADDRESSES = 5

export const addressSchema = z.object({
  id: z.string(),
  label: z.string().trim().min(1).default('Home'),
  fullName: z.string().trim().min(2, 'Please enter your full name.'),
  country: z.string().trim().min(2, 'Please select a country.'),
  city: z.string().trim().min(2, 'Please enter your city.'),
  streetAddress: z.string().trim().min(5, 'Please enter your street address.'),
  postalCode: z.string().trim().min(3, 'Please enter a valid postal code.'),
  isDefault: z.boolean().default(false),
})

export type SavedAddress = z.infer<typeof addressSchema>

export const storedUserSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().default(''),
  passwordHash: z.string().min(1),
  addresses: z.array(addressSchema).max(MAX_SAVED_ADDRESSES).default([]),
  createdAt: z.string(),
})

export type StoredUser = z.infer<typeof storedUserSchema>

export const storedUsersArraySchema = z.array(storedUserSchema)

export const authSessionSchema = z.object({
  id: z.string().min(1),
  email: z.string().trim().email(),
})

export type AuthSession = z.infer<typeof authSessionSchema>

export const orderAddressSchema = z.object({
  fullName: z.string(),
  country: z.string(),
  city: z.string(),
  streetAddress: z.string(),
  postalCode: z.string(),
})

export const orderContactSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
})

export const orderDeliverySchema = z.object({
  method: z.enum(['standard', 'express', 'same-day']),
  label: z.string(),
  eta: z.string(),
  price: z.number().nonnegative(),
})

export const orderTotalsSchema = z.object({
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().nonnegative(),
})

export const orderSchema = z.object({
  id: z.string().regex(/^DST-\d{6}$/),
  userId: z.string().nullable(),
  items: z.array(cartItemSchema).min(1),
  sample: z.string().nullable().optional().default(null),
  promoCode: z.string().nullable().optional().default(null),
  address: orderAddressSchema,
  contact: orderContactSchema,
  delivery: orderDeliverySchema,
  paymentMethod: z.string(),
  totals: orderTotalsSchema,
  status: z.enum(['Processing', 'Dispatched', 'Delivered']).default('Processing'),
  createdAt: z.string(),
  estimatedDelivery: z.string(),
})

export type OrderRecord = z.infer<typeof orderSchema>

export const ordersArraySchema = z.array(orderSchema)

export const notifyEntrySchema = z.object({
  email: z.string().trim().email(),
  productId: z.string(),
  productSlug: z.string(),
  createdAt: z.string(),
})

export type NotifyEntry = z.infer<typeof notifyEntrySchema>

export const notifyArraySchema = z.array(notifyEntrySchema)

export async function hashPasswordSha256(password: string): Promise<string> {
  const normalized = password.trim()
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(normalized)
    const buffer = await window.crypto.subtle.digest('SHA-256', encoded)
    return Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }
  // Deterministic fallback if SubtleCrypto is unavailable
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i)
    hash |= 0
  }
  return `sha256-fallback-${Math.abs(hash).toString(16)}`
}

export function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dastaan:auth-updated'))
  }
}

export function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = storedUsersArraySchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

export function saveStoredUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch {
    // ignore storage errors
  }
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = authSessionSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function setAuthSession(session: AuthSession | null): void {
  if (typeof window === 'undefined') return
  try {
    if (!session) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } else {
      const clean: AuthSession = { id: session.id, email: session.email }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(clean))
    }
    notifyAuthChange()
  } catch {
    // ignore storage errors
  }
}

export function getCurrentUser(): StoredUser | null {
  const session = getAuthSession()
  if (!session) return null
  const users = getStoredUsers()
  return users.find((u) => u.id === session.id) ?? null
}

export function updateCurrentUser(
  updater: (user: StoredUser) => StoredUser
): StoredUser | null {
  const session = getAuthSession()
  if (!session) return null
  const users = getStoredUsers()
  const idx = users.findIndex((u) => u.id === session.id)
  if (idx === -1) return null
  const updated = updater(users[idx])
  users[idx] = updated
  saveStoredUsers(users)
  if (updated.email !== session.email) {
    setAuthSession({ id: updated.id, email: updated.email })
  } else {
    notifyAuthChange()
  }
  return updated
}

export function getOrders(): OrderRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = ordersArraySchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

export function saveOrder(order: OrderRecord): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getOrders().filter((o) => o.id !== order.id)
    const next = [order, ...existing]
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore storage errors
  }
}

export function getUserOrders(userId: string, userEmail?: string): OrderRecord[] {
  const normalizedEmail = userEmail?.trim().toLowerCase()
  return getOrders().filter(
    (order) =>
      order.userId === userId ||
      (order.userId === null &&
        Boolean(normalizedEmail) &&
        order.contact.email.trim().toLowerCase() === normalizedEmail)
  )
}

export function generateOrderId(): string {
  const digits = Math.floor(100000 + Math.random() * 900000)
  return `DST-${digits}`
}

export function computeEstimatedDeliveryDate(daysToAdd: number): string {
  const date = new Date()
  date.setDate(date.getDate() + Math.max(0, daysToAdd))
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function saveNotifyRequest(entry: NotifyEntry): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(NOTIFY_STORAGE_KEY)
    const parsed = raw ? notifyArraySchema.safeParse(JSON.parse(raw)) : null
    const existing = parsed?.success ? parsed.data : []
    const deduped = existing.filter(
      (item) =>
        !(
          item.email.toLowerCase() === entry.email.toLowerCase() &&
          item.productId === entry.productId
        )
    )
    const next = [entry, ...deduped].slice(0, 50)
    localStorage.setItem(NOTIFY_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore storage errors
  }
}

export function validateInternalRedirect(rawRedirect: string | null | undefined): string | null {
  if (!rawRedirect) return null
  const trimmed = rawRedirect.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('://')) {
    return null
  }
  return trimmed
}
