'use client'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { subscribeNewsletter } from '@/app/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Subscribe"
      className="flex size-10 shrink-0 items-center justify-center bg-ink text-white transition-opacity hover:opacity-80 disabled:opacity-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <Send className="size-4" strokeWidth={1.5} />
    </button>
  )
}

export function NewsletterForm() {
  const [state, action] = useActionState(subscribeNewsletter, { ok: false })

  useEffect(() => {
    if (state.ok) toast.success('You are on the list.')
    else if (state.error) toast.error(state.error)
  }, [state])

  return (
    <div>
      <form action={action} noValidate className="flex w-full max-w-sm items-stretch">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="Enter email address.."
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? 'newsletter-error' : undefined}
          className="h-10 min-w-0 flex-1 border border-hairline bg-white/70 px-3 text-xs text-ink placeholder:text-muted focus-visible:border-ink focus-visible:outline-none"
        />
        <SubmitButton />
      </form>
      <div aria-live="polite">
        {state.error && (
          <p id="newsletter-error" className="mt-2 text-xs text-red-700" role="alert">
            {state.error}
          </p>
        )}
      </div>
    </div>
  )
}
