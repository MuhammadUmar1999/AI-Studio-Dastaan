'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export const COOKIE_PREFS_KEY = 'dastaan-cookie-prefs'

export const cookiePrefsSchema = z.object({
  essential: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  updatedAt: z.string(),
})

export type CookiePrefs = z.infer<typeof cookiePrefsSchema>

export function readCookiePrefs(): CookiePrefs | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(COOKIE_PREFS_KEY)
    if (!raw) return null
    const parsed = cookiePrefsSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function writeCookiePrefs(prefs: Omit<CookiePrefs, 'updatedAt'>): CookiePrefs {
  const payload: CookiePrefs = {
    ...prefs,
    essential: true,
    updatedAt: new Date().toISOString(),
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(payload))
      window.dispatchEvent(new CustomEvent('dastaan:cookie-prefs-updated'))
    } catch {
      // ignore storage errors
    }
  }
  return payload
}

export function CookiePreferences() {
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const sync = () => {
      const stored = readCookiePrefs()
      if (stored) {
        setAnalytics(stored.analytics)
        setMarketing(stored.marketing)
      }
    }
    sync()
    window.addEventListener('dastaan:cookie-prefs-updated', sync)
    return () => window.removeEventListener('dastaan:cookie-prefs-updated', sync)
  }, [])

  const handleSave = () => {
    writeCookiePrefs({
      essential: true,
      analytics,
      marketing,
    })
    toast.success('Your cookie preferences have been saved.')
  }

  return (
    <section
      aria-label="Cookie preference controls"
      className="border border-hairline bg-cream/40 p-6 md:p-8"
    >
      <p className="label-caps text-ink/55">Privacy Controls</p>
      <h2 className="mt-2 font-heading text-2xl font-normal text-ink">
        Manage Cookie Preferences
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-ink/65">
        Customize how Dastaan uses storage and cookies on this browser. Essential storage is
        always active to maintain your shopping bag and wishlist.
      </p>

      <div className="mt-6 divide-y divide-hairline border-y border-hairline">
        {/* Essential */}
        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <p className="text-xs font-medium text-ink">Essential Boutique Storage</p>
            <p className="mt-1 text-xs text-ink/60">
              Required for your shopping bag, wishlist, checkout state, and security.
            </p>
          </div>
          <span className="label-caps border border-hairline bg-bg px-3 py-1.5 text-[10px] text-ink/60">
            Always Active
          </span>
        </div>

        {/* Analytics */}
        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <label
              htmlFor="toggle-analytics"
              className="cursor-pointer text-xs font-medium text-ink"
            >
              Atelier Analytics
            </label>
            <p className="mt-1 text-xs text-ink/60">
              Helps us understand how visitors navigate our fragrance collections and journal.
            </p>
          </div>
          <button
            id="toggle-analytics"
            type="button"
            role="switch"
            aria-checked={analytics}
            onClick={() => setAnalytics((prev) => !prev)}
            className={`h-8 min-w-[76px] border px-3 text-[10px] uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              analytics
                ? 'border-ink bg-ink text-white'
                : 'border-hairline bg-bg text-ink/70'
            }`}
          >
            {analytics ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Marketing */}
        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <label
              htmlFor="toggle-marketing"
              className="cursor-pointer text-xs font-medium text-ink"
            >
              Personalized Invitations &amp; Marketing
            </label>
            <p className="mt-1 text-xs text-ink/60">
              Tailors campaign previews and limited-edition coffret recommendations.
            </p>
          </div>
          <button
            id="toggle-marketing"
            type="button"
            role="switch"
            aria-checked={marketing}
            onClick={() => setMarketing((prev) => !prev)}
            className={`h-8 min-w-[76px] border px-3 text-[10px] uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              marketing
                ? 'border-ink bg-ink text-white'
                : 'border-hairline bg-bg text-ink/70'
            }`}
          >
            {marketing ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="h-11 bg-ink px-7 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Save preferences
        </button>
      </div>
    </section>
  )
}
