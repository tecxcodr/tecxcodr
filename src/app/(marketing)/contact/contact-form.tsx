'use client'

import { useActionState, useId } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input, Textarea } from '@/components/ui/input'
import { MonoLabel } from '@/components/ui/mono-label'
import type { ContactState } from '@/lib/validation/contact'
import { submitContact } from './actions'

const initial: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial)
  const uid = useId()

  if (state.status === 'success') {
    return (
      <div className="border-border bg-surface rounded-md border p-8 text-center">
        <CheckCircle2 aria-hidden className="text-success mx-auto size-6" />
        <h2 className="text-h3 mt-4">Message sent</h2>
        <p className="text-body text-fg-muted mx-auto mt-2 max-w-sm">
          A person reads every message. You will normally hear back within two working days.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.status === 'error' && (
        // role="alert" so the summary is announced when the server rejects.
        <div
          role="alert"
          className="border-destructive/30 bg-destructive-subtle text-destructive rounded-md border px-4 py-3 text-body-sm"
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field id={`${uid}-name`} label="Your name" required error={state.status === 'error' ? state.fields?.name : undefined}>
          {(p) => <Input {...p} name="name" autoComplete="name" placeholder="Aarav Sharma" />}
        </Field>

        <Field
          id={`${uid}-email`}
          label="Email"
          required
          help="We reply to this address."
          error={state.status === 'error' ? state.fields?.email : undefined}
        >
          {(p) => (
            <Input {...p} name="email" type="email" autoComplete="email" placeholder="you@example.com" />
          )}
        </Field>
      </div>

      <Field
        id={`${uid}-subject`}
        label="Subject"
        required
        error={state.status === 'error' ? state.fields?.subject : undefined}
      >
        {(p) => <Input {...p} name="subject" placeholder="Question about the review process" />}
      </Field>

      <Field
        id={`${uid}-message`}
        label="Message"
        required
        help="The more specific the question, the more useful the answer."
        error={state.status === 'error' ? state.fields?.message : undefined}
      >
        {(p) => <Textarea {...p} name="message" rows={6} />}
      </Field>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" loading={pending} className="max-sm:w-full">
          Send message
        </Button>
        <MonoLabel tone="subtle">we reply within 02 working days</MonoLabel>
      </div>
    </form>
  )
}
