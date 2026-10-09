import Link from 'next/link'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items]

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-ink/55">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-[10px] text-ink/35">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="label-caps text-ink/55 transition-opacity hover:opacity-75 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="label-caps text-ink"
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
