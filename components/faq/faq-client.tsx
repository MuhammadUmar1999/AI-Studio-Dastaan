'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export type FaqGroup = {
  id: string
  title: string
  items: FaqItem[]
}

export const faqGroups: FaqGroup[] = [
  {
    id: 'orders-shipping',
    title: 'Orders & Shipping',
    items: [
      {
        id: 'orders-1',
        question: 'When will my Dastaan order be dispatched?',
        answer:
          'Orders placed before 2:00 PM EST Monday through Friday are prepared at our atelier and dispatched within 24 hours. Standard delivery arrives within 2–4 business days.',
      },
      {
        id: 'orders-2',
        question: 'Do you offer complimentary shipping?',
        answer:
          'Yes. Complimentary Standard Delivery is included on all orders of $150 or more. For orders under $150, Standard Delivery is $12.',
      },
      {
        id: 'orders-3',
        question: 'Can I modify or cancel my order after placing it?',
        answer:
          'Because our fulfillment cellar begins preparing orders shortly after confirmation, modifications or cancellations can be requested within 2 hours of purchase by contacting our Client Concierge.',
      },
      {
        id: 'orders-4',
        question: 'Do you ship internationally?',
        answer:
          'Yes, Dastaan ships to over 35 destinations via air-regulated hazardous-goods couriers certified for fine perfumery. Duties and taxes are calculated transparently at checkout.',
      },
    ],
  },
  {
    id: 'fragrance-care',
    title: 'Fragrance Care',
    items: [
      {
        id: 'care-1',
        question: 'How should I store my Dastaan perfume to preserve its notes?',
        answer:
          'Store your flacon in a cool, dry place away from direct sunlight and extreme temperature fluctuations—such as inside its original archival cotton-rag box on a dressing table.',
      },
      {
        id: 'care-2',
        question: 'What is the concentration of Dastaan perfumes?',
        answer:
          'Our signature Eau de Parfums are compounded at 22% to 28% aromatic oil concentration and macerated for six to eight weeks, offering 8 to 12 hours of longevity on skin.',
      },
      {
        id: 'care-3',
        question: 'Why does the liquid color vary slightly between batches?',
        answer:
          'We never use synthetic dyes or UV stabilizers. Natural harvests of Florentine iris, Andalusian labdanum, and Ceylon cinnamon impart subtle seasonal variations in golden amber tint.',
      },
      {
        id: 'care-4',
        question: 'How can I make my fragrance last longer throughout the day?',
        answer:
          'Apply to moisturized pulse points—wrists, base of the throat, and inner elbows—without rubbing your wrists together, which crushes delicate top notes. Layering over our alcohol-free Body Perfume mists further extends sillage.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    items: [
      {
        id: 'returns-1',
        question: 'What is your return policy?',
        answer:
          'We accept returns on unopened, cello-sealed full-size flacons and coffrets within 14 days of delivery for a full refund to your original payment method.',
      },
      {
        id: 'returns-2',
        question: 'How can I test a fragrance before opening the full-size bottle?',
        answer:
          'Every full-size Dastaan bottle is accompanied by a complimentary matching 2 ml sample vial. Experience the sample vial on your skin first while keeping the main presentation box sealed.',
      },
      {
        id: 'returns-3',
        question: 'Are return shipping costs covered?',
        answer:
          'Complimentary prepaid return labels are provided for domestic orders. Simply keep the outer shipping carton and attach the dangerous-goods compliant label we provide.',
      },
      {
        id: 'returns-4',
        question: 'When will my refund appear on my statement?',
        answer:
          'Once your parcel arrives at our atelier and passes inspection, refunds are issued within 3 business days and typically post to your statement within 5–7 business days.',
      },
    ],
  },
  {
    id: 'gifting',
    title: 'Gifting',
    items: [
      {
        id: 'gifting-1',
        question: 'Does my order arrive in gift packaging?',
        answer:
          'Every Dastaan order is presented in our signature cream linen keepsake box tied with an ink grosgrain ribbon at no additional cost.',
      },
      {
        id: 'gifting-2',
        question: 'Can I include a personalized message card?',
        answer:
          'Yes. During checkout, you may compose a custom note that our atelier will print on heavy archival card stock and seal inside a wax-stamped envelope.',
      },
      {
        id: 'gifting-3',
        question: 'Are prices shown on the packing slip for gift orders?',
        answer:
          'No prices appear on the physical enclosure slip inside our parcels. Your itemized financial receipt is sent exclusively to the billing email address.',
      },
      {
        id: 'gifting-4',
        question: 'Which gift set do you recommend if I do not know their preferences?',
        answer:
          'The Signature Discovery Coffret (5 × 15 ml) is our most popular gift, offering a curated journey across floral, woody, oriental, and gourmand families.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments',
    items: [
      {
        id: 'payments-1',
        question: 'Which payment methods are accepted?',
        answer:
          'We accept Visa, Mastercard, American Express, Apple Pay, and Dastaan Private Client gift certificates.',
      },
      {
        id: 'payments-2',
        question: 'When is my card charged?',
        answer:
          'Your payment method is authorized at checkout and captured immediately upon order confirmation.',
      },
      {
        id: 'payments-3',
        question: 'Is my payment information secure?',
        answer:
          'All transactions are encrypted via TLS 1.3 and processed through PCI-DSS Level 1 certified gateways. Dastaan never stores raw card numbers.',
      },
      {
        id: 'payments-4',
        question: 'How do I apply a promotional code?',
        answer:
          'Promotional or private invitation codes such as DASTAAN10 can be entered in the order summary panel on the Shopping Bag or Checkout page.',
      },
    ],
  },
]

export function FaqClient() {
  const [query, setQuery] = useState('')
  const [activeHash, setActiveHash] = useState<string>('')
  const [openItems, setOpenItems] = useState<string[]>([faqGroups[0].items[0].id])

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash) return
      setActiveHash(hash)
      const targetGroup = faqGroups.find((group) => group.id === hash)
      if (targetGroup && targetGroup.items[0]) {
        const firstId = targetGroup.items[0].id
        setOpenItems((prev) => (prev.includes(firstId) ? prev : [...prev, firstId]))
        window.setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
        }, 50)
      }
    }

    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  const trimmed = query.trim().toLowerCase()

  const filteredGroups = useMemo(() => {
    if (!trimmed) return faqGroups
    return faqGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.question.toLowerCase().includes(trimmed) ||
            item.answer.toLowerCase().includes(trimmed)
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [trimmed])

  const totalMatches = useMemo(
    () => filteredGroups.reduce((sum, group) => sum + group.items.length, 0),
    [filteredGroups]
  )

  const handleJump = (groupId: string) => {
    setActiveHash(groupId)
    const group = faqGroups.find((g) => g.id === groupId)
    if (group && group.items[0]) {
      const firstId = group.items[0].id
      setOpenItems((prev) => (prev.includes(firstId) ? prev : [...prev, firstId]))
    }
    window.history.replaceState(null, '', `#${groupId}`)
    document.getElementById(groupId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 sm:px-4 md:pb-32">
      {/* Search Input */}
      <div className="relative">
        <label htmlFor="faq-search" className="sr-only">
          Search frequently asked questions
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/50"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions (e.g. returns, samples, shipping, maceration)..."
          className="h-12 w-full border border-hairline bg-bg pl-11 pr-10 text-sm text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear FAQ search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink/55 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Category Jump Pills */}
      <nav
        aria-label="FAQ categories"
        className="mt-6 flex flex-wrap gap-2 border-b border-hairline pb-6"
      >
        {faqGroups.map((group) => {
          const isCurrent = activeHash === group.id
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => handleJump(group.id)}
              className={`h-9 border px-3.5 text-[10px] uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                isCurrent
                  ? 'border-ink bg-ink text-white'
                  : 'border-hairline bg-cream/40 text-ink hover:border-ink'
              }`}
            >
              {group.title}
            </button>
          )
        })}
      </nav>

      {/* No Answers State */}
      {totalMatches === 0 ? (
        <div className="mt-10 border border-hairline bg-cream/30 p-8 text-center md:p-12">
          <h2 className="font-heading text-2xl font-normal text-ink">
            No answers found for &ldquo;{query.trim()}&rdquo;
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink/65">
            Our Client Concierge is delighted to assist with bespoke inquiries regarding
            our compositions, orders, or private appointments.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => setQuery('')}
              className="h-11 border border-ink px-6 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Reset search
            </button>
            <Link href="/contact" className="link-underline">
              Contact client care
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {filteredGroups.map((group) => (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`heading-${group.id}`}
              className="scroll-mt-24"
            >
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <h2
                  id={`heading-${group.id}`}
                  className="font-heading text-2xl font-normal text-ink md:text-3xl"
                >
                  {group.title}
                </h2>
                <span className="label-caps text-[10px] text-ink/45">
                  {group.items.length} {group.items.length === 1 ? 'question' : 'questions'}
                </span>
              </div>

              <Accordion
                value={openItems}
                onValueChange={(nextValues) => setOpenItems(nextValues as string[])}
                className="mt-2"
              >
                {group.items.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-b border-hairline"
                  >
                    <AccordionTrigger className="py-4 text-left font-sans text-sm font-medium text-ink hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="pb-3 text-xs leading-relaxed text-ink/65">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      )}

      {/* Concierge Footer Banner */}
      <div className="mt-16 border border-hairline bg-cream p-8 text-center">
        <p className="label-caps text-ink/55">Still Have a Question?</p>
        <h2 className="mt-2 font-heading text-2xl font-normal text-ink">
          Speak with a Dastaan Fragrance Specialist
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink/65">
          Available Monday through Saturday for order assistance, scent consultations, and
          gifting requests.
        </p>
        <div className="mt-5">
          <Link href="/contact" className="link-underline">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}
