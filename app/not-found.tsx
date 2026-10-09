import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 Not Found | Dastaan',
  description: 'The page you are looking for has moved or no longer exists.',
}

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="label-caps text-ink/50">404</p>
      <h1 className="font-heading text-5xl font-normal">Page not found</h1>
      <p className="max-w-sm text-sm text-ink/60">
        The page you are looking for has moved or no longer exists.
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="bg-ink px-7 py-3 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Back to home
        </Link>
        <Link
          href="/shop"
          className="border border-ink px-7 py-3 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Shop
        </Link>
      </div>
    </main>
  )
}
