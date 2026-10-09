'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAppSelector } from '@/lib/hooks'
import { readCookiePrefs, writeCookiePrefs } from '@/components/legal/cookie-preferences'

export function CookieBanner() {
  const pathname = usePathname()
  const hydrated = useAppSelector((state) => state.ui.hydrated)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    const check = () => {
      const existing = readCookiePrefs()
      setVisible(!existing)
    }
    check()
    window.addEventListener('dastaan:cookie-prefs-updated', check)
    return () => window.removeEventListener('dastaan:cookie-prefs-updated', check)
  }, [hydrated])

  if (!hydrated || !visible) return null

  const isProductPage = pathname.startsWith('/product/')

  const handleAcceptAll = () => {
    writeCookiePrefs({ essential: true, analytics: true, marketing: true })
    setVisible(false)
    toast.success('All cookie preferences accepted.')
  }

  const handleEssentialOnly = () => {
    writeCookiePrefs({ essential: true, analytics: false, marketing: false })
    setVisible(false)
    toast.success('Essential-only cookie preferences saved.')
  }

  return (
    <aside
      role="region"
      aria-label="Cookie consent"
      className={`fixed inset-x-0 z-20 border-t border-hairline bg-bg/98 px-4 py-4 shadow-sm backdrop-blur-xs ${
        isProductPage ? 'bottom-[61px] md:bottom-0' : 'bottom-0'
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 md:flex-row md:items-center">
        <p className="max-w-2xl text-xs leading-relaxed text-ink/75">
          The House of Dastaan uses cookies and local storage to preserve your shopping bag,
          remember your saved fragrances, and refine our digital flagship experience.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="h-9 bg-ink px-5 text-[10px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="h-9 border border-ink bg-transparent px-4 text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Essential only
          </button>
          <Link href="/cookies" className="link-underline px-2 py-1 text-[10px]">
            Manage
          </Link>
        </div>
      </div>
    </aside>
  )
}
