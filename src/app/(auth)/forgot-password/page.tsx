import Link from 'next/link'
import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { ForgotForm } from './forgot-form'

export const metadata: Metadata = { title: 'Reset your password' }

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="password reset"
      title="Reset your password"
      lede="Enter your email and we will send you a link to set a new one."
      footer={
        <p className="text-body-sm text-fg-muted">
          Remembered it?{' '}
          <Link href="/sign-in" className="text-fg underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      }
    >
      <ForgotForm />
    </AuthShell>
  )
}
