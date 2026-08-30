'use client'

import { useState } from 'react'
import { MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { MonoLabel } from '@/components/ui/mono-label'
import { fieldErrors, forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validation/auth'

/**
 * ⚠️ NO BACKEND.
 * TODO(backend): authClient.forgetPassword({ email, redirectTo }) with a
 * 3/hour/email rate limit (docs/06 §2.7).
 *
 * The success state is deliberately non-committal — it never confirms whether
 * an account exists for the address. That is the whole point of this screen's
 * copy, and it must survive the backend wiring (docs/02-TRD §11).
 */
export function ForgotForm() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordInput, string>>>({})
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = forgotPasswordSchema.safeParse({ email })
    if (!result.success) {
      setErrors(fieldErrors<ForgotPasswordInput>(result.error.issues))
      return
    }

    setPending(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setPending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="border-border bg-surface rounded-md border p-6 text-center">
        <MailCheck aria-hidden className="text-fg-muted mx-auto size-6" />
        <h2 className="text-h4 mt-4">Check your inbox</h2>
        <p className="text-body-sm text-fg-muted mt-2">
          If an account exists for that address, we have sent a link to reset the password. It
          expires in one hour.
        </p>
        <MonoLabel as="p" tone="subtle" className="mt-4">
          nothing was actually sent — email not wired up yet
        </MonoLabel>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field
        id="email"
        label="Email"
        required
        help="The address you signed up with."
        error={errors.email}
      >
        {(p) => (
          <Input
            {...p}
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors({})
            }}
          />
        )}
      </Field>

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Send reset link
      </Button>
    </form>
  )
}
