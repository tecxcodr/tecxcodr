import Link from 'next/link'
import type { Metadata } from 'next'
import { AuthDivider, AuthShell } from '@/components/auth/auth-shell'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { SignUpForm } from './sign-up-form'

export const metadata: Metadata = { title: 'Create an account' }

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="sign up"
      title="Create your account"
      lede="Free. You only pay if you apply, get accepted, and choose to enrol."
      footer={
        <p className="text-body-sm text-fg-muted">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-fg underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="flex flex-col gap-6">
        <OAuthButtons />
        <AuthDivider label="or with email" />
        <SignUpForm />
      </div>
    </AuthShell>
  )
}
