'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { signInSchema, fieldErrors, type SignInInput } from '@/lib/validation/auth'

/**
 * ⚠️ NO BACKEND.
 * TODO(backend): authClient.signIn.email({ email, password, callbackURL }).
 *
 * When wired, the failure message must stay exactly as generic as it is here.
 * "No account with that email" is an account-enumeration oracle — it lets
 * anyone test which addresses are registered (docs/02-TRD §11).
 */
export function SignInForm() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof SignInInput, string>>>({})
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

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = signInSchema.safeParse(values)
    if (!result.success) {
      setErrors(fieldErrors<SignInInput>(result.error.issues))
      return
    }

    setPending(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setPending(false)
    setFormError('Sign-in is not connected yet. The form and its validation are real; the backend is not.')
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

      <Field id="email" label="Email" required error={errors.email}>
        {(p) => (
          <Input
            {...p}
            type="email"
            autoComplete="email"
            autoFocus
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
        )}
      </Field>

      <Field id="password" label="Password" required error={errors.password}>
        {(p) => (
          <PasswordInput
            {...p}
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => set('password', e.target.value)}
          />
        )}
      </Field>

      <div className="-mt-1 text-right">
        <Link
          href="/forgot-password"
          className="text-caption text-fg-muted hover:text-fg underline underline-offset-4"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Sign in
      </Button>
    </form>
  )
}
