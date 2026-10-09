'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const sections = [
  { id: 'delivery-options', label: '01 · Delivery Options' },
  { id: 'international', label: '02 · International & Customs' },
  { id: 'returns-policy', label: '03 · 14-Day Returns Policy' },
  { id: 'return-steps', label: '04 · Return Steps' },
  { id: 'refunds', label: '05 · Refunds & Exchanges' },
] as const

export function ShippingClient() {
  const [activeId, setActiveId] = useState<string>(sections[0].id)

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
  }, [])

  return (
    <div className="mx-auto max-w-[1440px] px-3 pb-24 sm:px-4 md:pb-32">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        {/* Mobile Jump Links */}
        <nav
          aria-label="Shipping and returns sections mobile"
          className="border border-hairline bg-cream/40 p-4 lg:hidden"
        >
          <p className="label-caps text-[10px] text-ink/55">Jump to section</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveId(section.id)}
                className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                  activeId === section.id
                    ? 'border-ink bg-ink text-white'
                    : 'border-hairline bg-bg text-ink/75'
                }`}
              >
                {section.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Desktop Sticky Anchor Menu */}
        <aside className="hidden lg:block">
          <nav
            aria-label="Shipping and returns sections"
            className="sticky top-24 flex flex-col border-l border-hairline pl-4"
          >
            <p className="label-caps mb-3 text-[10px] text-ink/45">On This Page</p>
            {sections.map((section) => {
              const active = activeId === section.id
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveId(section.id)}
                  aria-current={active ? 'location' : undefined}
                  className={`py-2 text-xs transition-opacity hover:opacity-75 ${
                    active
                      ? 'font-medium text-ink underline underline-offset-4'
                      : 'text-ink/55'
                  }`}
                >
                  {section.label}
                </a>
              )
            })}
          </nav>
        </aside>

        {/* Content Column */}
        <div className="max-w-[720px] space-y-16">
          {/* 1. Delivery Options */}
          <section id="delivery-options" className="scroll-mt-24">
            <p className="label-caps text-ink/55">01 · Dispatch &amp; Tiers</p>
            <h2 className="mt-2 font-heading text-3xl font-normal text-ink">
              Delivery Options
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              All Dastaan orders of <strong className="font-medium text-ink">$150 or more</strong>{' '}
              qualify for complimentary Standard Delivery. Because fine perfumes contain alcohol,
              parcels are transported via regulated surface or certified air couriers.
            </p>

            <div className="mt-6 overflow-x-auto border border-hairline">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-hairline bg-cream/60">
                    <th className="label-caps px-4 py-3 text-[10px] text-ink">Service</th>
                    <th className="label-caps px-4 py-3 text-[10px] text-ink">Estimated ETA</th>
                    <th className="label-caps px-4 py-3 text-[10px] text-ink">Fee</th>
                    <th className="label-caps px-4 py-3 text-[10px] text-ink">
                      Orders $150+
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  <tr>
                    <td className="px-4 py-3.5 font-medium text-ink">Standard Delivery</td>
                    <td className="px-4 py-3.5 text-ink/70">2–4 business days</td>
                    <td className="px-4 py-3.5 text-ink/70">$12.00</td>
                    <td className="px-4 py-3.5 font-medium text-ink">Complimentary</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5 font-medium text-ink">Express Courier</td>
                    <td className="px-4 py-3.5 text-ink/70">1–2 business days</td>
                    <td className="px-4 py-3.5 text-ink/70">$25.00</td>
                    <td className="px-4 py-3.5 text-ink/70">$15.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5 font-medium text-ink">
                      Same-Day Atelier Courier
                    </td>
                    <td className="px-4 py-3.5 text-ink/70">
                      Same evening (orders before 1 PM)
                    </td>
                    <td className="px-4 py-3.5 text-ink/70">$35.00</td>
                    <td className="px-4 py-3.5 text-ink/70">$25.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. International Shipping & Customs */}
          <section
            id="international"
            className="scroll-mt-24 border-t border-hairline pt-12"
          >
            <p className="label-caps text-ink/55">02 · Global Dispatch</p>
            <h2 className="mt-2 font-heading text-3xl font-normal text-ink">
              International Shipping &amp; Customs
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              We ship to over 35 countries across North America, Europe, the Middle East, and
              Asia-Pacific via DHL Express Dangerous Goods service. International transit
              typically requires 4–7 business days from dispatch.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              Import duties, local VAT, and customs clearance fees are calculated at checkout
              on a Delivered Duty Paid (DDP) basis for most destinations, ensuring your parcel
              arrives at your door without unexpected courier surcharges.
            </p>
          </section>

          {/* 3. 14-Day Returns Policy */}
          <section
            id="returns-policy"
            className="scroll-mt-24 border-t border-hairline pt-12"
          >
            <p className="label-caps text-ink/55">03 · Try Before Unsealing</p>
            <h2 className="mt-2 font-heading text-3xl font-normal text-ink">
              14-Day Returns Policy
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              Every full-size Dastaan fragrance order includes a complimentary matching 2 ml
              sample vial so you may experience the composition on your skin before opening the
              full-size flacon.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              If the fragrance is not your ideal match, you may return the unopened,
              cello-sealed full-size presentation box within 14 calendar days of delivery for a
              full refund or exchange. Opened full-size bottles and bespoke engraved flacons
              cannot be returned due to international health and safety regulations.
            </p>
          </section>

          {/* 4. Return Steps */}
          <section
            id="return-steps"
            className="scroll-mt-24 border-t border-hairline pt-12"
          >
            <p className="label-caps text-ink/55">04 · Process</p>
            <h2 className="mt-2 font-heading text-3xl font-normal text-ink">
              How to Initiate a Return
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  step: '01',
                  title: 'Request Return Authorization',
                  body: 'Contact our Client Concierge with your order number within 14 days of delivery to receive a Return Merchandise Authorization (RMA) and prepaid label.',
                },
                {
                  step: '02',
                  title: 'Preserve Original Sealing',
                  body: 'Ensure the outer cream linen presentation box remains completely sealed in its protective cellophane wrap.',
                },
                {
                  step: '03',
                  title: 'Pack in Original Carton',
                  body: 'Place the sealed box inside the original shipping carton, which bears the required regulatory markings for fine perfumery transport.',
                },
                {
                  step: '04',
                  title: 'Hand Off to Courier',
                  body: 'Affix the prepaid return label and drop the parcel at any authorized courier point or schedule a complimentary home collection.',
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="border border-hairline bg-cream/30 p-5"
                >
                  <span className="font-display text-2xl text-ink">{item.step}</span>
                  <h3 className="mt-2 font-heading text-xl font-normal text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/65">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* 5. Refunds */}
          <section
            id="refunds"
            className="scroll-mt-24 border-t border-hairline pt-12"
          >
            <p className="label-caps text-ink/55">05 · Reimbursement</p>
            <h2 className="mt-2 font-heading text-3xl font-normal text-ink">
              Refunds &amp; Exchanges
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              Once your return parcel arrives at our atelier and passes quality verification,
              we will notify you by email and initiate a refund to your original payment method
              within 3 business days. Depending on your financial institution, funds typically
              appear on your statement within 5–7 business days.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <Link href="/contact" className="link-underline">
                Contact client concierge
              </Link>
              <Link href="/faq#returns" className="link-underline">
                View returns FAQ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
