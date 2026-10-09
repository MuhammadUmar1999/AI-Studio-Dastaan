import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, Cormorant_Garamond, Inter, Italiana } from 'next/font/google'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { CookieBanner } from '@/components/layout/cookie-banner'
import { StoreProvider } from '@/components/providers/store-provider'
import { Toaster } from 'sonner'
import './globals.css'

const Analytics = () => null

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const italiana = Italiana({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-italiana',
  display: 'swap',
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-bodoni',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DASTAAN | Luxury Perfume',
  description:
    'DASTAAN is a luxury perfume house. Discover fragrances that turn every drop into a memory.',
  openGraph: {
    title: 'DASTAAN | Luxury Perfume',
    description:
      'DASTAAN is a luxury perfume house. Discover fragrances that turn every drop into a memory.',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${italiana.variable} ${cormorant.variable} ${bodoni.variable}`}
    >
      <body>
        <StoreProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CookieBanner />
          <Toaster position="bottom-right" />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </StoreProvider>
      </body>
    </html>
  )
}
