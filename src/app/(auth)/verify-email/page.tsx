import Link from 'next/link'
import type { Metadata } from 'next'
import { MailCheck } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'

export const metadata: Metadata = { title: 'Verify your email' }

/**
 * Landing page after signup, and the target of the verification link.
 *
 * Verification is required before payment, not before applying (docs/00 A3) —
 * so this screen must never read like a wall. The primary action is "keep
 * going", not "go check your email and come back".
 */
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <AuthShell
      eyebrow="verify email"
      title="Confirm your email"
      lede={
        email
          ? `We sent a confirmation link to ${email}. It expires in 24 hours.`
          : 'We sent you a confirmation link. It expires in 24 hours.'
      }
      footer={
        <p className="text-body-sm text-fg-muted">
          Wrong address?{' '}
          <Link href="/dashboard/profile" className="text-fg underline underline-offset-4">
            Change it in your profile
          </Link>
        </p>
      }
    >
      <div className="border-border bg-surface rounded-md border p-6">
        <MailCheck aria-hidden className="text-fg-muted size-6" />

        <p className="text-body-sm text-fg-muted mt-4">
          You can keep browsing and even apply to a program without verifying. You only need a
          verified email before you enrol and pay.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/programs">Browse programs</Link>
          </Button>
          {/* TODO(backend): authClient.sendVerificationEmail({ email }),
              rate-limited per docs/06 §2.7. */}
          <Button variant="ghost" size="lg" disabled className="w-full">
            Resend the link
          </Button>
        </div>

        <MonoLabel as="p" tone="subtle" className="mt-4 text-center">
          email sending not wired up yet
        </MonoLabel>
      </div>
    </AuthShell>
  )
}
