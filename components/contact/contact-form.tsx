'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  submitContact,
  type ContactFormState,
  type ContactSubmission,
} from '@/app/actions'

const CONTACT_STORAGE_KEY = 'dastaan-contact'

const storedSubmissionsSchema = z
  .array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      topic: z.string(),
      message: z.string(),
      createdAt: z.string(),
    })
  )
  .max(20)

function persistSubmission(entry: ContactSubmission) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY)
    const parsed = raw ? storedSubmissionsSchema.safeParse(JSON.parse(raw)) : null
    const existing = parsed?.success ? parsed.data : []
    const deduped = existing.filter((item) => item.id !== entry.id)
    const next = [entry, ...deduped].slice(0, 20)
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore storage quota errors
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full bg-ink text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {pending ? 'Sending inquiry...' : 'Send message'}
    </button>
  )
}

const initialContactState: ContactFormState = { ok: false }

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initialContactState)
  const [confirmed, setConfirmed] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    if (state.ok && state.submission) {
      persistSubmission(state.submission)
      setConfirmed(state.submission)
      toast.success('Your message has been received by our Client Concierge.')
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  if (confirmed) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-hairline bg-cream/50 p-8 md:p-10"
      >
        <p className="label-caps text-ink/55">Inquiry Received · {confirmed.id}</p>
        <h2 className="mt-3 font-heading text-3xl font-normal text-ink">
          Thank you, {confirmed.name}.
        </h2>
        <p className="mt-3 text-xs leading-relaxed text-ink/70">
          Our Client Concierge has logged your message and will respond to{' '}
          <span className="font-medium text-ink">{confirmed.email}</span> within one
          business day.
        </p>
        <button
          type="button"
          onClick={() => setConfirmed(null)}
          className="link-underline mt-6"
        >
          Send another inquiry
        </button>
      </div>
    )
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-6">
      <div>
        <label htmlFor="contact-name" className="label-caps block text-ink">
          Full Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Your full name"
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? 'error-contact-name' : undefined}
          className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
        />
        <div aria-live="polite">
          {state.fieldErrors?.name && (
            <p id="error-contact-name" className="mt-1.5 text-xs text-red-700" role="alert">
              {state.fieldErrors.name}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className="label-caps block text-ink">
          Email Address
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? 'error-contact-email' : undefined}
          className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
        />
        <div aria-live="polite">
          {state.fieldErrors?.email && (
            <p id="error-contact-email" className="mt-1.5 text-xs text-red-700" role="alert">
              {state.fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-topic" className="label-caps block text-ink">
          Topic
        </label>
        <select
          id="contact-topic"
          name="topic"
          defaultValue="order-inquiry"
          aria-invalid={Boolean(state.fieldErrors?.topic)}
          aria-describedby={state.fieldErrors?.topic ? 'error-contact-topic' : undefined}
          className="mt-2 h-11 w-full border border-hairline bg-bg px-3.5 text-xs text-ink focus-visible:border-ink focus-visible:outline-none"
        >
          <option value="order-inquiry">Order Status &amp; Dispatch</option>
          <option value="fragrance-consultation">Bespoke Fragrance Consultation</option>
          <option value="shipping-returns">Shipping, Returns &amp; Exchanges</option>
          <option value="press-partnerships">Press &amp; Private Salons</option>
          <option value="other">General Inquiry</option>
        </select>
        <div aria-live="polite">
          {state.fieldErrors?.topic && (
            <p id="error-contact-topic" className="mt-1.5 text-xs text-red-700" role="alert">
              {state.fieldErrors.topic}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="label-caps block text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="How may our Client Concierge assist you?"
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={state.fieldErrors?.message ? 'error-contact-message' : undefined}
          className="mt-2 w-full border border-hairline bg-bg p-3.5 text-xs leading-relaxed text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
        />
        <div aria-live="polite">
          {state.fieldErrors?.message && (
            <p
              id="error-contact-message"
              className="mt-1.5 text-xs text-red-700"
              role="alert"
            >
              {state.fieldErrors.message}
            </p>
          )}
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
