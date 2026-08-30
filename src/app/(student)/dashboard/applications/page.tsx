import Link from 'next/link'
import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { StatusTimeline } from '@/components/dashboard/status-timeline'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { MonoLabel } from '@/components/ui/mono-label'
import { StatusBadge } from '@/components/ui/status-badge'
import { MOCK_APPLICATIONS } from '@/content/mock-student'
import { APPLICATION_STATUS_HINT, type Application } from '@/types/application'
import { formatDate, formatPrice } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Applications' }

export default function ApplicationsPage() {
  const applications = MOCK_APPLICATIONS

  return (
    <>
      <DashboardPageHeader
        eyebrow="applications"
        title="Your applications"
        lede="Every status change is recorded here with its date, so you never have to email and ask where things stand."
        action={
          <Button asChild variant="secondary" className="max-sm:w-full">
            <Link href="/programs">Apply to another program</Link>
          </Button>
        }
      />

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          body="Applying is free. Pick a program and read the task briefs before you commit to anything."
          action={
            <Button asChild>
              <Link href="/programs">Browse programs</Link>
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {applications.map((app) => (
            <li key={app.id}>
              <ApplicationCard application={app} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function ApplicationCard({ application }: { application: Application }) {
  const { status } = application

  return (
    <article className="border-border bg-surface rounded-md border">
      <header className="border-border flex flex-wrap items-start justify-between gap-4 border-b px-5 py-4 md:px-6">
        <div>
          <h2 className="text-h3">{application.programTitle}</h2>
          <MonoLabel as="p" tone="subtle" className="mt-1.5">
            applied {application.submittedAt ? formatDate(application.submittedAt) : 'not yet'}
          </MonoLabel>
        </div>
        <StatusBadge status={status} />
      </header>

      <div className="grid gap-6 px-5 py-5 md:grid-cols-[1fr_1fr] md:px-6">
        <div>
          <p className="text-body-sm text-fg-muted">{APPLICATION_STATUS_HINT[status]}</p>

          {status === 'REJECTED' && application.rejectionReason && (
            <div className="border-border bg-bg-subtle mt-4 rounded-md border p-4">
              <MonoLabel as="p" tone="subtle" className="mb-2">
                reason given
              </MonoLabel>
              <p className="text-body-sm text-fg-muted">{application.rejectionReason}</p>
            </div>
          )}

          {status === 'ACCEPTED' && application.paymentDueAt && (
            <div className="border-warning/30 bg-warning-subtle mt-4 rounded-md border p-4">
              <MonoLabel as="p" tone="subtle" className="mb-2">
                enrolment
              </MonoLabel>
              <p className="text-body-sm text-fg-muted">
                {formatPrice(application.priceAmountMinor)} · pay by{' '}
                {formatDate(application.paymentDueAt)}
              </p>
              {/* TODO(backend): POST /api/payments/order then open Razorpay
                  checkout — docs/05 §5. Disabled until that exists. */}
              <Button size="sm" disabled className="mt-3 max-sm:w-full">
                Complete payment
              </Button>
              <MonoLabel as="p" tone="subtle" className="mt-2">
                payments not wired up yet
              </MonoLabel>
            </div>
          )}

          {status === 'DRAFT' && (
            <Button asChild size="sm" className="mt-4 max-sm:w-full">
              <Link href={`/apply/${application.programSlug}`}>Continue application</Link>
            </Button>
          )}
        </div>

        <div>
          <MonoLabel as="p" tone="subtle" className="mb-4">
            timeline
          </MonoLabel>
          <StatusTimeline events={application.history} />
        </div>
      </div>
    </article>
  )
}
