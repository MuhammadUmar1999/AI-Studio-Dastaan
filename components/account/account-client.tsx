'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Check,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ProductTile } from '@/components/product/product-tile'
import { products, type Product } from '@/data/products'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addItem } from '@/lib/store'
import { getSampleById } from '@/lib/pricing'
import {
  addressSchema,
  getCurrentUser,
  getStoredUsers,
  getUserOrders,
  hashPasswordSha256,
  MAX_SAVED_ADDRESSES,
  saveStoredUsers,
  setAuthSession,
  updateCurrentUser,
  validateInternalRedirect,
  type OrderRecord,
  type SavedAddress,
  type StoredUser,
} from '@/lib/account'

type AccountTab = 'profile' | 'addresses' | 'orders' | 'wishlist'

const VALID_TABS: readonly AccountTab[] = ['profile', 'addresses', 'orders', 'wishlist']

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

const signInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
})

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name (at least 2 characters).'),
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z.string().trim().max(30, 'Phone number is too long.'),
})

export function AccountClient({
  initialTab,
  initialRedirect,
}: {
  initialTab?: string
  initialRedirect?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const hydrated = useAppSelector((state) => state.ui.hydrated)
  const wishlistIds = useAppSelector((state) => state.wishlist.ids)

  const [user, setUser] = useState<StoredUser | null>(null)
  const [userOrders, setUserOrders] = useState<OrderRecord[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Auth mode when logged out
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin')
  const [showPassword, setShowPassword] = useState(false)

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signInError, setSignInError] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regError, setRegError] = useState('')

  // Active tab when logged in
  const rawTabParam = searchParams.get('tab') ?? initialTab ?? 'profile'
  const activeTab: AccountTab = VALID_TABS.includes(rawTabParam as AccountTab)
    ? (rawTabParam as AccountTab)
    : 'profile'

  // Profile form state
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileError, setProfileError] = useState('')

  // Address form state
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addrLabel, setAddrLabel] = useState('Home')
  const [addrFullName, setAddrFullName] = useState('')
  const [addrCountry, setAddrCountry] = useState('United States')
  const [addrCity, setAddrCity] = useState('')
  const [addrStreet, setAddrStreet] = useState('')
  const [addrPostal, setAddrPostal] = useState('')
  const [addrDefault, setAddrDefault] = useState(false)
  const [addrError, setAddrError] = useState('')

  // Load user & orders after hydration
  useEffect(() => {
    if (!hydrated) return
    const sync = () => {
      const current = getCurrentUser()
      setUser(current)
      if (current) {
        setProfileName(current.name)
        setProfileEmail(current.email)
        setProfilePhone(current.phone)
        setUserOrders(getUserOrders(current.id, current.email))
      } else {
        setUserOrders([])
      }
    }
    sync()
    window.addEventListener('dastaan:auth-updated', sync)
    return () => window.removeEventListener('dastaan:auth-updated', sync)
  }, [hydrated])

  const handleTabChange = (nextTab: AccountTab) => {
    if (nextTab === 'orders' && user) {
      setUserOrders(getUserOrders(user.id, user.email))
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', nextTab)
    params.delete('redirect')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const completeAuthRedirect = (authenticatedUser: StoredUser) => {
    setUser(authenticatedUser)
    setProfileName(authenticatedUser.name)
    setProfileEmail(authenticatedUser.email)
    setProfilePhone(authenticatedUser.phone)
    setUserOrders(getUserOrders(authenticatedUser.id, authenticatedUser.email))

    const redirectParam = validateInternalRedirect(
      searchParams.get('redirect') ?? initialRedirect
    )
    if (redirectParam) {
      router.push(redirectParam)
      return
    }
    const requestedTab = searchParams.get('tab') ?? initialTab
    if (requestedTab && VALID_TABS.includes(requestedTab as AccountTab)) {
      router.replace(`${pathname}?tab=${requestedTab}`, { scroll: false })
    }
  }

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSignInError('')
    const parsed = signInSchema.safeParse({
      email: signInEmail,
      password: signInPassword,
    })
    if (!parsed.success) {
      setSignInError(parsed.error.issues[0]?.message ?? 'Please check your credentials.')
      return
    }

    const users = getStoredUsers()
    const cleanEmail = parsed.data.email.toLowerCase()
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail)
    const passwordHash = await hashPasswordSha256(parsed.data.password)

    if (!existing || existing.passwordHash !== passwordHash) {
      setSignInError('Invalid email or password. Please try again.')
      return
    }

    setAuthSession({ id: existing.id, email: existing.email })
    setSignInPassword('')
    toast.success(`Welcome back, ${existing.name}.`)
    completeAuthRedirect(existing)
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRegError('')
    const parsed = registerSchema.safeParse({
      name: regName,
      email: regEmail,
      password: regPassword,
    })
    if (!parsed.success) {
      setRegError(parsed.error.issues[0]?.message ?? 'Please review the fields below.')
      return
    }

    const users = getStoredUsers()
    const cleanEmail = parsed.data.email.toLowerCase()
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setRegError('An account with this email address is already registered.')
      return
    }

    const passwordHash = await hashPasswordSha256(parsed.data.password)
    const newUser: StoredUser = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      name: parsed.data.name,
      email: cleanEmail,
      phone: '',
      passwordHash,
      addresses: [],
      createdAt: new Date().toISOString(),
    }

    saveStoredUsers([newUser, ...users])
    setAuthSession({ id: newUser.id, email: newUser.email })
    setRegPassword('')
    toast.success(`Account created. Welcome to the House of Dastaan, ${newUser.name}.`)
    completeAuthRedirect(newUser)
  }

  const handleLogout = () => {
    setAuthSession(null)
    setUser(null)
    setSelectedOrderId(null)
    toast.success('You have been signed out.')
  }

  const handleSaveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return
    setProfileError('')

    const parsed = profileSchema.safeParse({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
    })
    if (!parsed.success) {
      setProfileError(parsed.error.issues[0]?.message ?? 'Please review your profile details.')
      return
    }

    const cleanEmail = parsed.data.email.toLowerCase()
    const otherUsers = getStoredUsers().filter((u) => u.id !== user.id)
    if (otherUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setProfileError('That email address is already used by another account.')
      return
    }

    const updated = updateCurrentUser((current) => ({
      ...current,
      name: parsed.data.name,
      email: cleanEmail,
      phone: parsed.data.phone,
    }))
    if (updated) {
      setUser(updated)
      toast.success('Your profile has been updated.')
    }
  }

  const openAddAddress = () => {
    if (!user) return
    setEditingAddressId(null)
    setAddrLabel('Home')
    setAddrFullName(user.name)
    setAddrCountry('United States')
    setAddrCity('')
    setAddrStreet('')
    setAddrPostal('')
    setAddrDefault(user.addresses.length === 0)
    setAddrError('')
    setShowAddressForm(true)
  }

  const openEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id)
    setAddrLabel(addr.label)
    setAddrFullName(addr.fullName)
    setAddrCountry(addr.country)
    setAddrCity(addr.city)
    setAddrStreet(addr.streetAddress)
    setAddrPostal(addr.postalCode)
    setAddrDefault(addr.isDefault)
    setAddrError('')
    setShowAddressForm(true)
  }

  const handleSaveAddress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return
    setAddrError('')

    if (!editingAddressId && user.addresses.length >= MAX_SAVED_ADDRESSES) {
      setAddrError(`You may save up to ${MAX_SAVED_ADDRESSES} addresses.`)
      return
    }

    const candidate: SavedAddress = {
      id: editingAddressId ?? `addr_${Date.now().toString(36)}`,
      label: addrLabel.trim() || 'Home',
      fullName: addrFullName,
      country: addrCountry,
      city: addrCity,
      streetAddress: addrStreet,
      postalCode: addrPostal,
      isDefault: addrDefault,
    }

    const parsed = addressSchema.safeParse(candidate)
    if (!parsed.success) {
      setAddrError(parsed.error.issues[0]?.message ?? 'Please complete all address fields.')
      return
    }

    const updated = updateCurrentUser((current) => {
      let nextList = editingAddressId
        ? current.addresses.map((a) => (a.id === editingAddressId ? parsed.data : a))
        : [...current.addresses, parsed.data]

      if (parsed.data.isDefault || nextList.length === 1) {
        nextList = nextList.map((a) => ({
          ...a,
          isDefault: a.id === parsed.data.id,
        }))
      } else if (!nextList.some((a) => a.isDefault) && nextList[0]) {
        nextList[0] = { ...nextList[0], isDefault: true }
      }

      return {
        ...current,
        addresses: nextList.slice(0, MAX_SAVED_ADDRESSES),
      }
    })

    if (updated) {
      setUser(updated)
      setShowAddressForm(false)
      setEditingAddressId(null)
      toast.success(editingAddressId ? 'Address updated.' : 'New address saved.')
    }
  }

  const handleDeleteAddress = (id: string) => {
    const updated = updateCurrentUser((current) => {
      const remaining = current.addresses.filter((a) => a.id !== id)
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true }
      }
      return { ...current, addresses: remaining }
    })
    if (updated) {
      setUser(updated)
      toast.success('Address removed.')
    }
  }

  const handleSetDefaultAddress = (id: string) => {
    const updated = updateCurrentUser((current) => ({
      ...current,
      addresses: current.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    }))
    if (updated) {
      setUser(updated)
      toast.success('Default shipping address updated.')
    }
  }

  const handleReorder = (order: OrderRecord) => {
    for (const item of order.items) {
      dispatch(addItem(item))
    }
    window.dispatchEvent(new CustomEvent('dastaan:open-cart'))
    toast.success(`Added ${order.items.length} fragrance line(s) from ${order.id} to your bag.`)
  }

  const savedProducts = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter((item): item is Product => Boolean(item))

  const selectedOrder = selectedOrderId
    ? userOrders.find((o) => o.id === selectedOrderId) ?? null
    : null

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1440px] px-3 py-16 sm:px-4">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="h-12 w-64 animate-pulse bg-tile/60" />
          <div className="h-80 w-full animate-pulse bg-tile/60" />
        </div>
      </div>
    )
  }

  // LOGGED OUT VIEW
  if (!user) {
    return (
      <div className="mx-auto max-w-[1440px] px-3 py-12 sm:px-4 md:py-20">
        <div className="mx-auto max-w-md">
          <Breadcrumbs items={[{ label: 'Account' }]} />

          <p className="label-caps text-ink/55">Private Client Portal</p>
          <h1 className="mt-2 font-heading text-4xl font-normal text-ink">
            {authMode === 'signin' ? 'Sign In' : 'Create an Account'}
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-ink/60">
            Access your saved addresses, fragrance order history, and personal wishlist.
          </p>

          {/* Sign In / Register Mode Switcher */}
          <div
            role="tablist"
            aria-label="Account authentication"
            className="mt-8 grid grid-cols-2 border border-hairline"
          >
            <button
              type="button"
              role="tab"
              aria-selected={authMode === 'signin'}
              onClick={() => {
                setAuthMode('signin')
                setSignInError('')
              }}
              className={`h-11 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                authMode === 'signin'
                  ? 'bg-ink text-white'
                  : 'bg-cream/35 text-ink hover:bg-cream'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={authMode === 'register'}
              onClick={() => {
                setAuthMode('register')
                setRegError('')
              }}
              className={`h-11 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                authMode === 'register'
                  ? 'bg-ink text-white'
                  : 'bg-cream/35 text-ink hover:bg-cream'
              }`}
            >
              Register
            </button>
          </div>

          {authMode === 'signin' ? (
            <form
              onSubmit={handleSignIn}
              noValidate
              className="mt-6 space-y-5 border border-hairline p-6 md:p-8"
            >
              <div>
                <label htmlFor="signin-email" className="label-caps block text-ink">
                  Email Address
                </label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  value={signInEmail}
                  onChange={(e) => {
                    setSignInEmail(e.target.value)
                    if (signInError) setSignInError('')
                  }}
                  placeholder="patron@example.com"
                  className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                />
              </div>

              <div>
                <label htmlFor="signin-password" className="label-caps block text-ink">
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={signInPassword}
                    onChange={(e) => {
                      setSignInPassword(e.target.value)
                      if (signInError) setSignInError('')
                    }}
                    placeholder="Enter your password"
                    className="h-11 w-full border border-hairline bg-bg pl-3.5 pr-10 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/55 hover:text-ink"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div aria-live="polite">
                {signInError && (
                  <p role="alert" className="text-xs text-red-700">
                    {signInError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="h-12 w-full bg-ink text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
              >
                Sign in
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegister}
              noValidate
              className="mt-6 space-y-5 border border-hairline p-6 md:p-8"
            >
              <p className="border border-hairline bg-cream/60 px-3.5 py-2.5 text-[11px] text-ink/80">
                Demo account. Stored on this device only.
              </p>

              <div>
                <label htmlFor="reg-name" className="label-caps block text-ink">
                  Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value)
                    if (regError) setRegError('')
                  }}
                  placeholder="Your full name"
                  className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="label-caps block text-ink">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value)
                    if (regError) setRegError('')
                  }}
                  placeholder="patron@example.com"
                  className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="label-caps block text-ink">
                  Password (min. 6 characters)
                </label>
                <div className="relative mt-2">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value)
                      if (regError) setRegError('')
                    }}
                    placeholder="Create a password"
                    className="h-11 w-full border border-hairline bg-bg pl-3.5 pr-10 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/55 hover:text-ink"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div aria-live="polite">
                {regError && (
                  <p role="alert" className="text-xs text-red-700">
                    {regError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="h-12 w-full bg-ink text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
              >
                Create account
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  // LOGGED IN VIEW
  return (
    <div className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[{ label: 'Account' }]} />

        <div className="flex flex-col justify-between gap-4 border-b border-hairline pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="label-caps text-ink/55">Private Client Suite</p>
            <h1 className="mt-2 font-heading text-4xl font-normal text-ink md:text-5xl">
              Welcome, {user.name}
            </h1>
            <p className="mt-1 text-xs text-ink/60">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center gap-2 self-start border border-hairline px-4 text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink sm:self-auto"
          >
            <LogOut className="size-3.5" strokeWidth={1.5} />
            <span>Sign out</span>
          </button>
        </div>

        {/* Account Navigation Tabs (?tab=profile|addresses|orders|wishlist) */}
        <div
          role="tablist"
          aria-label="Account sections"
          className="mt-6 flex flex-wrap gap-2 border-b border-hairline pb-6"
        >
          {(
            [
              { id: 'profile', label: 'Profile' },
              { id: 'addresses', label: `Addresses (${user.addresses.length})` },
              { id: 'orders', label: `Orders (${userOrders.length})` },
              { id: 'wishlist', label: `Wishlist (${savedProducts.length})` },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleTabChange(tab.id)}
                className={`h-10 border px-5 text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? 'border-ink bg-ink text-white'
                    : 'border-hairline bg-bg text-ink/75 hover:border-ink'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <section aria-label="Profile settings" className="mt-10 max-w-xl">
            <h2 className="font-heading text-3xl font-normal text-ink">
              Personal Details
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              Update your name, email address, and telephone number used to prefill
              checkout.
            </p>

            <form
              onSubmit={handleSaveProfile}
              noValidate
              className="mt-6 space-y-5 border border-hairline p-6 md:p-8"
            >
              <div>
                <label htmlFor="profile-name" className="label-caps block text-ink">
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink focus-visible:border-ink focus-visible:outline-none"
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="label-caps block text-ink">
                  Email Address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink focus-visible:border-ink focus-visible:outline-none"
                />
              </div>

              <div>
                <label htmlFor="profile-phone" className="label-caps block text-ink">
                  Telephone Number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+1 (212) 555-0148"
                  className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
                />
              </div>

              <div aria-live="polite">
                {profileError && (
                  <p role="alert" className="text-xs text-red-700">
                    {profileError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="h-11 bg-ink px-8 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
              >
                Save changes
              </button>
            </form>
          </section>
        )}

        {/* TAB 2: ADDRESSES */}
        {activeTab === 'addresses' && (
          <section aria-label="Saved addresses" className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-3xl font-normal text-ink">
                  Saved Addresses
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Manage up to {MAX_SAVED_ADDRESSES} shipping destinations. Your default
                  address prefills automatically during checkout.
                </p>
              </div>

              {!showAddressForm && user.addresses.length < MAX_SAVED_ADDRESSES && (
                <button
                  type="button"
                  onClick={openAddAddress}
                  className="inline-flex h-10 items-center gap-2 bg-ink px-5 text-[10px] uppercase tracking-[0.14em] text-white"
                >
                  <Plus className="size-3.5" />
                  <span>Add address</span>
                </button>
              )}
            </div>

            {showAddressForm && (
              <form
                onSubmit={handleSaveAddress}
                noValidate
                className="mt-6 max-w-2xl space-y-5 border border-ink bg-cream/30 p-6 md:p-8"
              >
                <h3 className="font-heading text-2xl font-normal text-ink">
                  {editingAddressId ? 'Edit Address' : 'New Shipping Address'}
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="addr-label" className="label-caps block text-ink">
                      Address Label
                    </label>
                    <input
                      id="addr-label"
                      type="text"
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      placeholder="Home, Atelier, Office..."
                      className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="addr-fullname" className="label-caps block text-ink">
                      Recipient Full Name
                    </label>
                    <input
                      id="addr-fullname"
                      type="text"
                      value={addrFullName}
                      onChange={(e) => setAddrFullName(e.target.value)}
                      className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="addr-country" className="label-caps block text-ink">
                      Country
                    </label>
                    <select
                      id="addr-country"
                      value={addrCountry}
                      onChange={(e) => setAddrCountry(e.target.value)}
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
                    <label htmlFor="addr-city" className="label-caps block text-ink">
                      City
                    </label>
                    <input
                      id="addr-city"
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
                  <div>
                    <label htmlFor="addr-street" className="label-caps block text-ink">
                      Street Address
                    </label>
                    <input
                      id="addr-street"
                      type="text"
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="addr-postal" className="label-caps block text-ink">
                      Postal Code
                    </label>
                    <input
                      id="addr-postal"
                      type="text"
                      value={addrPostal}
                      onChange={(e) => setAddrPostal(e.target.value)}
                      className="mt-1.5 h-10 w-full border border-hairline bg-bg px-3 text-xs text-ink"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink">
                  <input
                    type="checkbox"
                    checked={addrDefault}
                    onChange={(e) => setAddrDefault(e.target.checked)}
                    className="size-4 accent-ink"
                  />
                  <span>Set as default shipping address</span>
                </label>

                <div aria-live="polite">
                  {addrError && (
                    <p role="alert" className="text-xs text-red-700">
                      {addrError}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="h-10 bg-ink px-6 text-[10px] uppercase tracking-[0.14em] text-white"
                  >
                    Save address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false)
                      setEditingAddressId(null)
                    }}
                    className="h-10 border border-hairline bg-bg px-5 text-[10px] uppercase tracking-[0.14em] text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {user.addresses.length === 0 && !showAddressForm ? (
              <div className="mt-8 border border-hairline bg-cream/30 p-10 text-center">
                <p className="font-heading text-2xl text-ink">No saved addresses yet</p>
                <p className="mt-1.5 text-xs text-ink/60">
                  Add a default shipping address for faster checkout.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {user.addresses.map((addr) => (
                  <article
                    key={addr.id}
                    className="flex flex-col justify-between border border-hairline bg-bg p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-xl text-ink">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="label-caps border border-ink bg-cream px-2 py-0.5 text-[9px] text-ink">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs font-medium text-ink">{addr.fullName}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink/65">
                        {addr.streetAddress}
                        <br />
                        {addr.city}, {addr.postalCode}
                        <br />
                        {addr.country}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-hairline pt-4 text-[10px] uppercase tracking-[0.12em]">
                      <button
                        type="button"
                        onClick={() => openEditAddress(addr)}
                        className="inline-flex items-center gap-1 text-ink hover:underline"
                      >
                        <Edit3 className="size-3" />
                        <span>Edit</span>
                      </button>

                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="inline-flex items-center gap-1 text-ink/70 hover:text-ink hover:underline"
                        >
                          <Check className="size-3" />
                          <span>Set default</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="ml-auto inline-flex items-center gap-1 text-ink/55 hover:text-ink"
                      >
                        <Trash2 className="size-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <section aria-label="Order history" className="mt-10">
            <h2 className="font-heading text-3xl font-normal text-ink">Order History</h2>
            <p className="mt-1 text-xs text-ink/60">
              View past orders placed with your account or replenish your favorite flacons.
            </p>

            {userOrders.length === 0 ? (
              <div className="mt-8 border border-hairline bg-cream/30 p-12 text-center">
                <p className="font-heading text-2xl text-ink">
                  You have not placed any orders yet
                </p>
                <p className="mt-2 text-xs text-ink/60">
                  Orders placed while signed into your account will appear here.
                </p>
                <div className="mt-6">
                  <Link
                    href="/shop"
                    className="inline-flex h-11 items-center justify-center bg-ink px-7 text-[11px] uppercase tracking-[0.14em] text-white"
                  >
                    Explore the shop
                  </Link>
                </div>
              </div>
            ) : selectedOrder ? (
              <div className="mt-6 border border-hairline bg-bg p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-5">
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderId(null)}
                      className="link-underline text-[10px]"
                    >
                      ← Back to all orders
                    </button>
                    <h3 className="mt-3 font-heading text-2xl font-normal text-ink">
                      Order {selectedOrder.id}
                    </h3>
                    <p className="mt-1 text-xs text-ink/60">
                      Placed on{' '}
                      {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      · Est. delivery {selectedOrder.estimatedDelivery}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="border border-ink px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-ink">
                      {selectedOrder.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleReorder(selectedOrder)}
                      className="inline-flex h-10 items-center gap-2 bg-ink px-5 text-[10px] uppercase tracking-[0.14em] text-white"
                    >
                      <ShoppingBag className="size-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>

                {/* Items in Order Detail */}
                <div className="mt-6 divide-y divide-hairline">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.volumeLabel}`}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative size-14 bg-cream">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-heading text-lg text-ink hover:underline"
                          >
                            {item.name}
                          </Link>
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
                  {selectedOrder.sample && (
                    <div className="flex items-center justify-between py-3 text-xs text-ink/75">
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-ink" />
                        <span>
                          Complimentary Sample:{' '}
                          {getSampleById(selectedOrder.sample)?.name ?? selectedOrder.sample}
                        </span>
                      </span>
                      <span>Free</span>
                    </div>
                  )}
                </div>

                {/* Address + Totals in Order Detail */}
                <div className="mt-6 grid gap-6 border-t border-hairline pt-6 sm:grid-cols-2">
                  <div>
                    <p className="label-caps text-[10px] text-ink/55">Shipping Address</p>
                    <p className="mt-2 text-xs font-medium text-ink">
                      {selectedOrder.address.fullName}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink/65">
                      {selectedOrder.address.streetAddress}, {selectedOrder.address.city},{' '}
                      {selectedOrder.address.postalCode}, {selectedOrder.address.country}
                    </p>
                    <p className="mt-2 text-xs text-ink/65">
                      Delivery: {selectedOrder.delivery.label} ({selectedOrder.paymentMethod})
                    </p>
                  </div>

                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between text-ink/70">
                      <dt>Subtotal</dt>
                      <dd>${selectedOrder.totals.subtotal.toFixed(2)}</dd>
                    </div>
                    {selectedOrder.totals.discount > 0 && (
                      <div className="flex justify-between font-medium text-ink">
                        <dt>Discount</dt>
                        <dd>-${selectedOrder.totals.discount.toFixed(2)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between text-ink/70">
                      <dt>Shipping</dt>
                      <dd>
                        {selectedOrder.totals.shipping === 0
                          ? 'Complimentary'
                          : `$${selectedOrder.totals.shipping.toFixed(2)}`}
                      </dd>
                    </div>
                    <div className="flex justify-between text-ink/70">
                      <dt>Tax</dt>
                      <dd>${selectedOrder.totals.tax.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-hairline pt-2 text-sm font-semibold text-ink">
                      <dt>Total</dt>
                      <dd>${selectedOrder.totals.total.toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div className="mt-6 divide-y divide-hairline border border-hairline">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium text-ink">
                          {order.id}
                        </span>
                        <span className="border border-ink px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-ink">
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink/60">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        · {order.items.reduce((s, i) => s + i.qty, 0)} item(s) · Total:{' '}
                        <strong className="font-medium text-ink">
                          ${order.totals.total.toFixed(2)}
                        </strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        className="h-9 border border-hairline bg-bg px-4 text-[10px] uppercase tracking-[0.14em] text-ink hover:border-ink"
                      >
                        View details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="inline-flex h-9 items-center gap-1.5 bg-ink px-4 text-[10px] uppercase tracking-[0.14em] text-white"
                      >
                        <ShoppingBag className="size-3" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 4: WISHLIST PREVIEW */}
        {activeTab === 'wishlist' && (
          <section aria-label="Wishlist preview" className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-3xl font-normal text-ink">
                  Saved Fragrances
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  A preview of your saved creations. Manage your full wardrobe on the
                  dedicated Wishlist page.
                </p>
              </div>
              <Link href="/wishlist" className="link-underline">
                Open full wishlist ({savedProducts.length})
              </Link>
            </div>

            {savedProducts.length === 0 ? (
              <div className="mt-8 border border-hairline bg-cream/30 p-12 text-center">
                <p className="font-heading text-2xl text-ink">
                  Your wishlist is currently empty
                </p>
                <div className="mt-5">
                  <Link href="/shop" className="link-underline">
                    Explore the collection
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {savedProducts.slice(0, 4).map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
