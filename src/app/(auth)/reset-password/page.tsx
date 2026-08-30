import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { ResetForm } from './reset-form'

export const metadata: Metadata = { title: 'Set a new password' }

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <AuthShell
      eyebrow="password reset"
      title="Set a new password"
      lede="Choose something you are not using anywhere else."
    >
      <ResetForm token={token} />
    </AuthShell>
  )
}
