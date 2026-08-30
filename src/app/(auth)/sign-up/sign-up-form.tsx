'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { MonoLabel } from '@/components/ui/mono-label'
import { fieldErrors, signUpSchema, type SignUpInput } from '@/lib/validation/auth'
import { cn } from '@/lib/utils/cn'

/**
 * ⚠️ NO BACKEND.
 * TODO(backend): authClient.signUp.email({ name, email, password }) then send
 * the verification mail. Email verification is required before payment, not
 * before applying (docs/00 A3).
 *
 * Note this is the standalone signup. The apply flow has its own inline
 * signup as step 1 (docs/00 A1) — most students arrive that way.
 */
export function SignUpForm() {
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpInput, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const set = (key: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setFormError(null)
    setErrors((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const longEnough = values.password.length >= 8

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = signUpSchema.safeParse({ ...values, terms })
    if (!result.success) {
      setErrors(fieldErrors<SignUpInput>(result.error.issues))
      return
    }

    setPending(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setPending(false)
    setFormError('Sign-up is not connected yet. The form and its validation are real; the backend is not.')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {formError && (
        <p
          role="alert"
          className="border-border bg-bg-subtle text-body-sm text-fg-muted rounded-md border px-4 py-3"
        >
          {formError}
        </p>
      )}

      <Field id="name" label="Your name" required error={errors.name}>
        {(p) => (
          <Input
            {...p}
            autoComplete="name"
            autoFocus
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
          />
        )}
      </Field>

      <Field
        id="email"
        label="Email"
        required
        help="You will need to verify this before you can enrol."
        error={errors.email}
      >
        {(p) => (
          <Input
            {...p}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
        )}
      </Field>

      <Field id="password" label="Password" required error={errors.password}>
        {(p) => (
          <PasswordInput
            {...p}
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => set('password', e.target.value)}
          />
        )}
      </Field>

      {/* Live requirement feedback, aria-live so it is announced rather than
          only turning green. */}
      <p
        aria-live="polite"
        className={cn(
          'flex items-center gap-2 -mt-2',
          longEnough ? 'text-success' : 'text-fg-subtle',
        )}
      >
        <Check aria-hidden className={cn('size-3.5', !longEnough && 'opacity-40')} />
        <MonoLabel tone={longEnough ? 'default' : 'subtle'} className={longEnough ? 'text-success' : undefined}>
          at least 8 characters
        </MonoLabel>
      </p>

      <div>
        <Checkbox
          id="terms"
          checked={terms}
          onCheckedChange={(v) => {
            setTerms(v)
            setErrors((prev) => {
              const next = { ...prev }
              delete next.terms
              return next
            })
          }}
          aria-invalid={errors.terms ? true : undefined}
          aria-describedby={errors.terms ? 'terms-error' : undefined}
          label={
            <>
              I agree to the{' '}
              <Link href="/terms" className="text-fg underline underline-offset-4">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-fg underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </>
          }
        />
        {errors.terms && (
          <p id="terms-error" className="text-caption text-destructive mt-1 ml-[30px]">
            {errors.terms}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Create account
      </Button>
    </form>
  )
}
