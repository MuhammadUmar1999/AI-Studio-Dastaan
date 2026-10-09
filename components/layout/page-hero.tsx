import { Breadcrumbs, type BreadcrumbItem } from './breadcrumbs'

type PageHeroProps = {
  eyebrow?: string
  title: string
  subtitle: string
  breadcrumbs?: BreadcrumbItem[]
  children?: React.ReactNode
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  children,
}: PageHeroProps) {
  return (
    <section className="mx-auto max-w-[1440px] px-3 py-14 sm:px-4 md:py-24">
      <div className="mx-auto max-w-3xl border-b border-hairline pb-10">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && <p className="label-caps text-ink/55">{eyebrow}</p>}
        <h1 className="mt-2 font-heading text-4xl font-normal leading-tight text-ink md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">
          {subtitle}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
