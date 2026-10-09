'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
})

export type NewsletterState = {
  ok: boolean
  error?: string
}

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const result = newsletterSchema.safeParse({ email: formData.get('email') })
  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues[0]?.message || 'Enter a valid email address.',
    }
  }
  const email = result.data.email.toLowerCase()
  const cookieStore = await cookies()
  if (cookieStore.get('dastaan-newsletter')?.value === email) {
    return { ok: false, error: 'This email is already subscribed.' }
  }
  cookieStore.set('dastaan-newsletter', email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 60 * 24 * 365,
  })
  return { ok: true }
}

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  topic: z.enum(
    [
      'order-inquiry',
      'fragrance-consultation',
      'shipping-returns',
      'press-partnerships',
      'other',
    ],
    { message: 'Please select an inquiry topic.' }
  ),
  message: z
    .string()
    .trim()
    .min(10, 'Please enter a message of at least 10 characters.'),
})

export type ContactSubmission = {
  id: string
  name: string
  email: string
  topic: string
  message: string
  createdAt: string
}

export type ContactFormState = {
  ok: boolean
  error?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'topic' | 'message', string>>
  submission?: ContactSubmission
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    topic: String(formData.get('topic') ?? ''),
    message: String(formData.get('message') ?? ''),
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: ContactFormState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (
        (key === 'name' || key === 'email' || key === 'topic' || key === 'message') &&
        !fieldErrors[key]
      ) {
        fieldErrors[key] = issue.message
      }
    }
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Please review the highlighted fields.',
      fieldErrors,
    }
  }

  const submission: ContactSubmission = {
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    name: parsed.data.name,
    email: parsed.data.email,
    topic: parsed.data.topic,
    message: parsed.data.message,
    createdAt: new Date().toISOString(),
  }

  return {
    ok: true,
    submission,
  }
}
