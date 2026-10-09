'use client'

import { useEffect, useState } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/breadcrumbs'

export type LegalSection = {
  id: string
  title: string
  paragraphs: string[]
}

type LegalLayoutProps = {
  breadcrumbs: BreadcrumbItem[]
  title: string
  lastUpdated: string
  subtitle: string
  sections: readonly LegalSection[]
  children?: React.ReactNode
}

export function LegalLayout({
  breadcrumbs,
  title,
  lastUpdated,
  subtitle,
  sections,
  children,
}: LegalLayoutProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  return (
    <main className="mx-auto max-w-[1440px] px-3 py-10 sm:px-4 md:py-16">
      {/* Header */}
      <div className="mx-auto max-w-5xl border-b border-hairline pb-10">
        <Breadcrumbs items={breadcrumbs} />
        <p className="label-caps text-ink/55">Last updated: {lastUpdated}</p>
        <h1 className="mt-2 font-heading text-4xl font-normal leading-tight text-ink md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
          {subtitle}
        </p>
      </div>

      {/* Main Content + Sticky Table of Contents */}
      <div className="mx-auto mt-10 grid max-w-5xl gap-10 pb-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        {/* Mobile Jump Links */}
        <nav
          aria-label={`${title} table of contents mobile`}
          className="border border-hairline bg-cream/40 p-4 lg:hidden"
        >
          <p className="label-caps text-[10px] text-ink/55">Table of Contents</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveId(section.id)}
                className={`border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                  activeId === section.id
                    ? 'border-ink bg-ink text-white'
                    : 'border-hairline bg-bg text-ink/75'
                }`}
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Desktop Sticky TOC */}
        <aside className="hidden lg:block">
          <nav
            aria-label={`${title} table of contents`}
            className="sticky top-24 flex flex-col border-l border-hairline pl-4"
          >
            <p className="label-caps mb-3 text-[10px] text-ink/45">Table of Contents</p>
            {sections.map((section) => {
              const active = activeId === section.id
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveId(section.id)}
                  aria-current={active ? 'location' : undefined}
                  className={`py-1.5 text-xs transition-opacity hover:opacity-75 ${
                    active
                      ? 'font-medium text-ink underline underline-offset-4'
                      : 'text-ink/55'
                  }`}
                >
                  {section.title}
                </a>
              )
            })}
          </nav>
        </aside>

        {/* Readable Column (max ~720px) */}
        <div className="max-w-[720px] space-y-12">
          {children}
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 border-b border-hairline pb-10 last:border-b-0"
            >
              <h2 className="font-heading text-2xl font-normal text-ink md:text-3xl">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.paragraphs.map((para, idx) => (
                  <p key={idx} className="text-xs leading-[1.85] text-ink/70">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
