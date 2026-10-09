'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { mainNav } from '@/data/navigation'
import { useAppSelector } from '@/lib/hooks'
import { selectCartCount } from '@/lib/store'
import { cn } from '@/lib/utils'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { SearchDialog } from './search-dialog'

const iconButton =
  'inline-flex size-9 items-center justify-center text-ink transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink'

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const open = () => setCartOpen(true)
    window.addEventListener('dastaan:open-cart', open)
    return () => window.removeEventListener('dastaan:open-cart', open)
  }, [])

  const count = useAppSelector(selectCartCount)
  const wishlistCount = useAppSelector((state) => state.wishlist.ids.length)
  const hydrated = useAppSelector((state) => state.ui.hydrated)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hairline bg-bg">
        <div className="relative mx-auto flex h-14 max-w-[1440px] items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-1 sm:gap-3">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger className={iconButton} aria-label="Open menu">
                <Menu className="size-[18px]" strokeWidth={1.5} />
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] max-w-sm rounded-none bg-bg p-0">
                <SheetHeader className="border-b border-hairline p-6">
                  <SheetTitle className="font-heading text-2xl font-normal tracking-[0.08em]">
                    DASTAAN
                  </SheetTitle>
                  <SheetDescription className="sr-only">Site navigation</SheetDescription>
                </SheetHeader>
                <nav aria-label="Primary" className="flex flex-col px-6 py-8">
                  {mainNav.map((item) => {
                    const isActive =
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'border-b border-hairline py-4 font-heading text-3xl font-light transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink',
                          isActive && 'underline decoration-1 underline-offset-8'
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 px-1 text-ink transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
              aria-label="Search"
            >
              <Search className="size-[16px]" strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden text-xs sm:inline">Search</span>
            </button>
          </div>
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-heading text-xl font-medium tracking-[0.08em] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
            aria-label="DASTAAN home"
          >
            DASTAAN
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/wishlist"
              className={`${iconButton} relative`}
              aria-label={hydrated ? `Wishlist, ${wishlistCount} items` : 'Wishlist'}
            >
              <Heart className="size-[18px]" strokeWidth={1.5} />
              {hydrated && wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-3.5 items-center justify-center bg-ink text-[9px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className={`${iconButton} relative`}
              aria-label={hydrated ? `Bag, ${count} items` : 'Bag'}
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
              {hydrated && count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-3.5 items-center justify-center bg-ink text-[9px] text-white">
                  {count}
                </span>
              )}
            </button>
            <Link href="/account" className={iconButton} aria-label="Account">
              <User className="size-[18px]" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
