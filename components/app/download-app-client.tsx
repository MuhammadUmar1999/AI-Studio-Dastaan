'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Smartphone, Sparkles, Bell, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import type { ScentFamily } from '@/data/products'

const WAITLIST_KEY = 'dastaan-app-waitlist'

const waitlistSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
})

const storedWaitlistSchema = z.array(
  z.object({
    email: z.string().email(),
    joinedAt: z.string(),
  })
)

type QuizQuestion = {
  id: string
  prompt: string
  options: { label: string; detail: string; family: ScentFamily }[]
}

const quizQuestions: readonly QuizQuestion[] = [
  {
    id: 'hour',
    prompt: '01 · Which hour feels most like yours?',
    options: [
      {
        label: 'First light in a walled garden',
        detail: 'Dew on citrus leaves & cool stone',
        family: 'fresh',
      },
      {
        label: 'Golden hour on warm cliffs',
        detail: 'Sun-bleached wood & resinous air',
        family: 'oriental',
      },
      {
        label: 'Midnight in a quiet library',
        detail: 'Smoked cedar, leather & shadows',
        family: 'woody',
      },
      {
        label: 'Dusk beneath blooming jasmine',
        detail: 'Velvet petals & powdered iris',
        family: 'floral',
      },
    ],
  },
  {
    id: 'texture',
    prompt: '02 · Which tactile material draws you in?',
    options: [
      {
        label: 'Raw unbleached linen',
        detail: 'Crisp, airy, and effortless',
        family: 'fresh',
      },
      {
        label: 'Crushed silk velvet',
        detail: 'Romantic, plush, and enveloping',
        family: 'floral',
      },
      {
        label: 'Charred Atlas cedarwood',
        detail: 'Architectural, dry, and grounded',
        family: 'woody',
      },
      {
        label: 'Spun dark caramel & suede',
        detail: 'Rich, spiced, and addictive',
        family: 'gourmand',
      },
    ],
  },
  {
    id: 'note',
    prompt: '03 · Choose a signature botanical note:',
    options: [
      {
        label: 'Ceylon Cinnamon & Labdanum',
        detail: 'Warm molten amber & spice',
        family: 'oriental',
      },
      {
        label: 'Florentine Iris & Damask Rose',
        detail: 'Luminous petals & soft musk',
        family: 'floral',
      },
      {
        label: 'Haitian Vetiver & Black Cardamom',
        detail: 'Smoky roots & cool spice',
        family: 'woody',
      },
      {
        label: 'Ripe Black Fig & Roasted Tonka',
        detail: 'Creamy fruit & dark vanilla',
        family: 'gourmand',
      },
    ],
  },
] as const

const familyDescriptions: Record<
  ScentFamily,
  { title: string; notes: string; copy: string; productSlug: string; productName: string }
> = {
  woody: {
    title: 'Woody',
    notes: 'Atlas Cedar · Haitian Vetiver · Cashmere Wood',
    copy: 'You gravitate toward architectural restraint, dry woods, and smoky vetiver that leave a composed, authoritative trail.',
    productSlug: 'memoire-sauvage',
    productName: 'Memoire Sauvage',
  },
  floral: {
    title: 'Floral',
    notes: 'Night Jasmine · Florentine Iris · Centifolia Rose',
    copy: 'Your signature is luminous and poetic—layering rare blossoms over velvet sandalwood and skin musk.',
    productSlug: 'ashes-of-moonlight',
    productName: 'Ashes of Moonlight',
  },
  oriental: {
    title: 'Oriental',
    notes: 'Golden Labdanum · Ceylon Cinnamon · Solar Amber',
    copy: 'You seek warmth and depth: resinous amber, sacred spices, and honeyed woods that glow well into the night.',
    productSlug: 'gold-dust',
    productName: 'Gold Dust',
  },
  fresh: {
    title: 'Fresh',
    notes: 'Moroccan Neroli · Calabrian Bergamot · Petitgrain',
    copy: 'Crisp, sunlit, and clarifying—your ideal compositions evoke citrus groves and morning air on linen.',
    productSlug: 'neroli-botanica',
    productName: 'Neroli Botanica',
  },
  gourmand: {
    title: 'Gourmand',
    notes: 'Ripe Black Fig · Dark Praline · Roasted Tonka',
    copy: 'Sensual and magnetic, you favor rich botanical sweetness balanced by saffron, patchouli, and dry woods.',
    productSlug: 'crimson-mirage',
    productName: 'Crimson Mirage',
  },
}

export function DownloadAppClient() {
  const [answers, setAnswers] = useState<Record<string, ScentFamily>>({})
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [joinedEmail, setJoinedEmail] = useState<string | null>(null)

  const allAnswered = quizQuestions.every((q) => Boolean(answers[q.id]))

  const computedFamily: ScentFamily = (() => {
    const counts: Partial<Record<ScentFamily, number>> = {}
    for (const q of quizQuestions) {
      const fam = answers[q.id]
      if (fam) counts[fam] = (counts[fam] ?? 0) + 1
    }
    let best: ScentFamily = answers[quizQuestions[2].id] ?? 'woody'
    let max = 0
    for (const [fam, count] of Object.entries(counts) as [ScentFamily, number][]) {
      if (count > max) {
        max = count
        best = fam
      }
    }
    return best
  })()

  const activeResult = familyDescriptions[computedFamily]

  const handleStoreButton = (platform: 'App Store' | 'Google Play') => {
    toast(`Coming soon to ${platform}. Join the private waitlist below for early access.`)
  }

  const handleWaitlistSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = waitlistSchema.safeParse({ email })
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message ?? 'Please enter a valid email address.')
      return
    }
    const cleanEmail = parsed.data.email.toLowerCase()
    setEmailError('')
    try {
      const raw = localStorage.getItem(WAITLIST_KEY)
      const existing = raw ? storedWaitlistSchema.safeParse(JSON.parse(raw)) : null
      const list = existing?.success ? existing.data : []
      if (!list.some((item) => item.email === cleanEmail)) {
        list.unshift({ email: cleanEmail, joinedAt: new Date().toISOString() })
        localStorage.setItem(WAITLIST_KEY, JSON.stringify(list.slice(0, 50)))
      }
    } catch {
      // ignore storage errors
    }
    setJoinedEmail(cleanEmail)
    setEmail('')
    toast.success('You have been added to the Dastaan App private waitlist.')
  }

  return (
    <div className="mx-auto max-w-[1440px] px-3 pb-24 sm:px-4 md:pb-32">
      {/* Hero with CSS Phone Mockup */}
      <section className="mx-auto grid max-w-5xl items-center gap-12 border-b border-hairline pb-20 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div>
          <p className="label-caps text-ink/55">Private Client Mobile Experience</p>
          <h2 className="mt-3 font-heading text-3xl font-normal leading-tight text-ink md:text-5xl">
            Your olfactory wardrobe, in the palm of your hand.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/65">
            Designed exclusively for patrons of the House, the Dastaan Private Client app
            pairs algorithmic scent profiling with cellar-batch reservation and effortless
            flacon replenishment.
          </p>

          <ul className="mt-8 space-y-4 text-xs text-ink/75">
            <li className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={1.5} />
              <span>
                <strong className="font-medium text-ink">Bespoke Scent Profiling:</strong> Map
                your skin chemistry and seasonal layering rituals.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Bell className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={1.5} />
              <span>
                <strong className="font-medium text-ink">First-Batch Allocations:</strong>{' '}
                48-hour priority access when numbered cellar editions finish maceration.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={1.5} />
              <span>
                <strong className="font-medium text-ink">Digital Bottle Certificate:</strong>{' '}
                Verify batch harvest notes, maceration dates, and refill history.
              </span>
            </li>
          </ul>

          {/* App Store & Google Play Buttons */}
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleStoreButton('App Store')}
              className="inline-flex h-12 items-center gap-3 bg-ink px-6 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Smartphone className="size-4" strokeWidth={1.5} aria-hidden="true" />
              <span>App Store</span>
            </button>
            <button
              type="button"
              onClick={() => handleStoreButton('Google Play')}
              className="inline-flex h-12 items-center gap-3 border border-ink bg-transparent px-6 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Smartphone className="size-4" strokeWidth={1.5} aria-hidden="true" />
              <span>Google Play</span>
            </button>
          </div>
        </div>

        {/* Pure CSS Phone Mockup */}
        <div className="flex justify-center">
          <div
            aria-label="Dastaan Private Client mobile app interface preview"
            className="relative w-full max-w-[300px] border-2 border-ink bg-bg p-3 shadow-sm"
          >
            {/* Speaker notch */}
            <div className="mx-auto mb-3 h-1 w-14 bg-ink/20" />

            <div className="border border-hairline bg-cream/40 p-5">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <span className="font-heading text-sm tracking-[0.14em] text-ink">
                  DASTAAN
                </span>
                <span className="label-caps text-[9px] text-ink/55">Private Client</span>
              </div>

              <div className="mt-5 bg-tile-warm p-4 text-center">
                <p className="label-caps text-[9px] text-ink/55">Current Signature</p>
                <p className="mt-1 font-heading text-2xl text-ink">
                  {allAnswered ? activeResult.productName : 'Ashes of Moonlight'}
                </p>
                <p className="mt-1 text-[10px] text-ink/65">
                  Batch #2025-09 · 26% Extrait
                </p>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex justify-between border-b border-hairline pb-2 text-[11px]">
                  <span className="text-ink/55">Olfactory Family</span>
                  <span className="font-medium text-ink">
                    {allAnswered ? activeResult.title : 'Floral Amber'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-hairline pb-2 text-[11px]">
                  <span className="text-ink/55">Evening Layering</span>
                  <span className="font-medium text-ink">Saffron Silk Mist</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink/55">Salon Access</span>
                  <span className="font-medium text-ink">New York · Paris</span>
                </div>
              </div>

              <div className="mt-5 bg-ink py-2.5 text-center text-[9px] uppercase tracking-[0.16em] text-white">
                Replenish Flacon
              </div>
            </div>

            {/* Home bar */}
            <div className="mx-auto mt-3 h-1 w-20 bg-ink/30" />
          </div>
        </div>
      </section>

      {/* Interactive Scent-Profile Quiz Preview */}
      <section
        aria-label="Scent profile quiz preview"
        className="mx-auto max-w-4xl border-b border-hairline py-20"
      >
        <div className="text-center">
          <p className="label-caps text-ink/55">Interactive Preview</p>
          <h2 className="mt-2 font-heading text-3xl font-normal text-ink md:text-4xl">
            Discover Your Scent Profile
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink/60">
            Answer three questions from our in-app consultation to reveal your signature
            Dastaan olfactory family.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {quizQuestions.map((question) => (
            <fieldset key={question.id} className="border border-hairline p-6 md:p-8">
              <legend className="label-caps px-2 text-ink">{question.prompt}</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {question.options.map((opt) => {
                  const selected = answers[question.id] === opt.family
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: opt.family }))
                      }
                      className={`flex flex-col items-start border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                        selected
                          ? 'border-ink bg-ink text-white'
                          : 'border-hairline bg-cream/25 text-ink hover:border-ink'
                      }`}
                    >
                      <span className="font-heading text-lg font-normal">
                        {opt.label}
                      </span>
                      <span
                        className={`mt-1 text-[11px] ${
                          selected ? 'text-white/75' : 'text-ink/60'
                        }`}
                      >
                        {opt.detail}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {/* Quiz Result Card */}
        {allAnswered && (
          <div
            role="region"
            aria-live="polite"
            aria-label="Your scent profile result"
            className="mt-10 border border-ink bg-cream p-8 text-center md:p-12"
          >
            <p className="label-caps text-ink/60">Consultation Result</p>
            <h3 className="mt-2 font-heading text-3xl font-normal text-ink md:text-4xl">
              Your scent family: {activeResult.title}
            </h3>
            <p className="label-caps mt-2 text-[10px] text-ink/70">{activeResult.notes}</p>
            <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-ink/75">
              {activeResult.copy}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-6">
              <Link
                href={`/shop?scent=${computedFamily}`}
                className="inline-flex h-11 items-center justify-center bg-ink px-7 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
              >
                Explore {activeResult.title} perfumes
              </Link>
              <Link
                href={`/product/${activeResult.productSlug}`}
                className="link-underline"
              >
                Discover {activeResult.productName}
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Early-Access Waitlist Form */}
      <section aria-label="App early access waitlist" className="mx-auto max-w-xl pt-20 text-center">
        <p className="label-caps text-ink/55">Private Beta</p>
        <h2 className="mt-2 font-heading text-3xl font-normal text-ink md:text-4xl">
          Request Early Access
        </h2>
        <p className="mt-3 text-xs leading-relaxed text-ink/65">
          Leave your email address to receive your private invitation code when the Dastaan
          iOS and Android applications launch this season.
        </p>

        {joinedEmail ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-8 border border-hairline bg-cream/60 p-6"
          >
            <p className="font-heading text-2xl text-ink">You are on the private list.</p>
            <p className="mt-1.5 text-xs text-ink/65">
              We have reserved an invitation for{' '}
              <span className="font-medium text-ink">{joinedEmail}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleWaitlistSubmit} noValidate className="mt-7">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="waitlist-email" className="sr-only">
                Email address for app early access
              </label>
              <input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError('')
                }}
                placeholder="Enter your email address..."
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'waitlist-error' : undefined}
                className="h-12 flex-1 border border-hairline bg-bg px-4 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
              />
              <button
                type="submit"
                className="h-12 bg-ink px-8 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Join waitlist
              </button>
            </div>
            <div aria-live="polite">
              {emailError && (
                <p id="waitlist-error" className="mt-2 text-left text-xs text-red-700" role="alert">
                  {emailError}
                </p>
              )}
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
