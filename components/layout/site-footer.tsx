import Link from 'next/link'
import { footerLegalLinks, footerShopLinks } from '@/data/navigation'
import { NewsletterForm } from './newsletter-form'

type FooterLink = { label: string; href: string }

function LinkColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-xs text-ink transition-opacity hover:opacity-60">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-cream">
      <div className="mx-auto max-w-[1440px] px-3 pt-16 sm:px-4 md:pt-20">
        <div className="flex flex-col gap-10 px-2 md:flex-row md:items-start md:gap-0 md:px-6">
          <div className="flex flex-1 flex-col gap-4 md:pr-10">
            <p className="max-w-xs text-xs leading-relaxed text-ink">
              Friends let friends know about best products and content.
            </p>
            <NewsletterForm />
          </div>

          <div className="flex flex-1 gap-10 md:border-l md:border-dashed md:border-ink/25 md:pl-10">
            <div className="flex-1">
              <LinkColumn title="Shop links" links={footerShopLinks} />
            </div>
            <div className="flex-1">
              <LinkColumn title="Legal links" links={footerLegalLinks} />
            </div>
          </div>
        </div>

        <div className="mx-2 mt-14 border-t border-dotted border-ink/40 md:mx-6 md:mt-20" />

        <div className="flex items-end gap-3 px-2 pt-6 md:px-6">
          <svg
            viewBox="0 0 1000 146"
            role="img"
            aria-label="DASTAAN"
            className="block h-auto w-full flex-1 overflow-hidden text-ink"
            preserveAspectRatio="xMidYMax meet"
          >
            <text
              x="0"
              y="149"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              className="fill-ink font-wordmark"
              fontSize="201"
            >
              DASTAAN
            </text>
          </svg>
          <p className="hidden shrink-0 rotate-180 pb-3 text-[10px] uppercase tracking-[0.16em] text-ink [writing-mode:vertical-rl] md:block">
            © DASTAAN 2025
          </p>
        </div>
        <p className="py-4 text-center text-[10px] uppercase tracking-[0.16em] text-ink md:hidden">
          © DASTAAN 2025
        </p>
      </div>
    </footer>
  )
}
