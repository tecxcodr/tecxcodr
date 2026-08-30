'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { MonoLabel } from '@/components/ui/mono-label'
import { fieldErrors, resetPasswordSchema, type ResetPasswordInput } from '@/lib/validation/auth'

/**
 * ⚠️ NO BACKEND.
 * TODO(backend): authClient.resetPassword({ newPassword, token }). The token
 * is single-use with a 1-hour TTL, and using it must invalidate every existing
 * session for that user (docs/05 §3).
 */
export function ResetForm({ token }: { token?: string }) {
  const [values, setValues] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordInput, string>>>({})
  const [done, setDone] = useState(false)
  const [pending, setPending] = useState(false)

  const set = (key: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  // A reset link with no token is not a form to fill in — it is a dead link,
  // and saying so beats letting someone type a password that goes nowhere.
  if (!token) {
    return (
      <div className="border-border bg-surface rounded-md border p-6">
        <h2 className="text-h4">This reset link is not valid</h2>
        <p className="text-body-sm text-fg-muted mt-2">
          It may have expired, already been used, or been copied incompletely. Reset links last
          one hour and work once.
        </p>
        <Button asChild className="mt-5 w-full">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    )
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = resetPasswordSchema.safeParse(values)
    if (!result.success) {
      setErrors(fieldErrors<ResetPasswordInput>(result.error.issues))
      return
    }

    setPending(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setPending(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="border-border bg-surface rounded-md border p-6 text-center">
        <CheckCircle2 aria-hidden className="text-success mx-auto size-6" />
        <h2 className="text-h4 mt-4">Password updated</h2>
        <p className="text-body-sm text-fg-muted mt-2">
          You have been signed out everywhere else. Sign in with your new password.
        </p>
        <Button asChild className="mt-5 w-full">
          <Link href="/sign-in">Go to sign in</Link>
        </Button>
        <MonoLabel as="p" tone="subtle" className="mt-4">
          nothing was changed — auth not wired up yet
        </MonoLabel>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field
        id="password"
        label="New password"
        required
        help="At least 8 characters."
        error={errors.password}
      >
        {(p) => (
          <PasswordInput
            {...p}
            autoComplete="new-password"
            autoFocus
            value={values.password}
            onChange={(e) => set('password', e.target.value)}
          />
        )}
      </Field>

      <Field
        id="confirmPassword"
        label="Confirm new password"
        required
        error={errors.confirmPassword}
      >
        {(p) => (
          <PasswordInput
            {...p}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => set('confirmPassword', e.target.value)}
          />
        )}
      </Field>

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Set new password
      </Button>
    </form>
  )
}
