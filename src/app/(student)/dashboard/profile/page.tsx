import Link from 'next/link'
import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { ProfileForm } from './profile-form'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return (
    <>
      <DashboardPageHeader
        eyebrow="account"
        title="Profile"
        lede="This prefills future applications. Applications you have already submitted keep the answers you gave at the time."
      />

      <div className="max-w-2xl">
        <ProfileForm />

        <section className="border-border mt-12 border-t pt-8">
          <MonoLabel as="p" tone="subtle">
            [ account ]
          </MonoLabel>

          <div className="mt-4 flex flex-col gap-3">
            <Button variant="secondary" disabled className="max-sm:w-full sm:self-start">
              Change password
            </Button>
            <Button variant="ghost" disabled className="text-destructive max-sm:w-full sm:self-start">
              Delete account
            </Button>
            <p className="text-caption text-fg-subtle max-w-prose">
              Deleting your account removes your profile and applications. Certificates already
              issued stay verifiable — see the{' '}
              <Link href="/privacy" className="text-fg underline underline-offset-4">
                privacy policy
              </Link>{' '}
              for why.
            </p>
            <MonoLabel tone="subtle">account actions need auth · not wired up yet</MonoLabel>
          </div>
        </section>
      </div>
    </>
  )
}
