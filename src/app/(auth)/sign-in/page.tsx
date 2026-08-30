import Link from 'next/link'
import type { Metadata } from 'next'
import { AuthDivider, AuthShell } from '@/components/auth/auth-shell'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { SignInForm } from './sign-in-form'

export const metadata: Metadata = { title: 'Sign in' }

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="sign in"
      title="Welcome back"
      lede="Sign in to track your applications and submit your work."
      footer={
        <p className="text-body-sm text-fg-muted">
          Don&rsquo;t have an account?{' '}
          <Link href="/sign-up" className="text-fg underline underline-offset-4">
            Create one
          </Link>
        </p>
      }
    >
      <div className="flex flex-col gap-6">
        <OAuthButtons />
        <AuthDivider label="or with email" />
        <SignInForm />
      </div>
    </AuthShell>
  )
}
