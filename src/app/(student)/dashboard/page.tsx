import Link from 'next/link'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { MonoLabel } from '@/components/ui/mono-label'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/ui/status-badge'
import { MOCK_APPLICATIONS, MOCK_ENROLLMENT, MOCK_STUDENT } from '@/content/mock-student'
import { daysRemaining } from '@/types/enrollment'
import { formatDate, formatPrice, pad2 } from '@/lib/utils/format'

export default function DashboardOverviewPage() {
  const enrollment = MOCK_ENROLLMENT
  const days = daysRemaining(enrollment.endsAt)

  // The single most important thing on this page: an accepted application
  // with an unpaid enrolment window closing. Surfaced before anything else.
  const awaitingPayment = MOCK_APPLICATIONS.filter(
    (a) => a.status === 'ACCEPTED' && a.paymentDueAt,
  )

  const nextTask = enrollment.tasks.find(
    (t) => t.latestSubmission?.status !== 'APPROVED',
  )

  const firstName = MOCK_STUDENT.name.split(' ')[0] ?? MOCK_STUDENT.name

  return (
    <>
      <DashboardPageHeader
        eyebrow={`${formatDate(new Date())}`}
        title={`Hello, ${firstName}`}
        lede="Everything that needs your attention, in one place."
      />

      {awaitingPayment.length > 0 && (
        <section aria-labelledby="action-heading" className="mb-8">
          <h2 id="action-heading" className="sr-only">
            Needs your attention
          </h2>
          <ul className="flex flex-col gap-3">
            {awaitingPayment.map((app) => (
              <li
                key={app.id}
                className="border-warning/30 bg-warning-subtle flex flex-wrap items-center gap-4 rounded-md border p-4 md:p-5"
              >
                <AlertCircle aria-hidden className="text-warning size-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm text-fg font-medium">
                    {app.programTitle} — accepted, awaiting payment
                  </p>
                  <p className="text-caption text-fg-muted mt-1">
                    {formatPrice(app.priceAmountMinor)} · complete by{' '}
                    {app.paymentDueAt ? formatDate(app.paymentDueAt) : '—'} or the place is
                    released.
                  </p>
                </div>
                <Button asChild size="sm" className="max-sm:w-full">
                  <Link href="/dashboard/applications">Complete payment</Link>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="program-heading">
          <h2 id="program-heading" className="sr-only">
            Current program
          </h2>

          {enrollment.status === 'ACTIVE' ? (
            <div className="border-border bg-surface rounded-md border p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <MonoLabel tone="subtle">current program</MonoLabel>
                  <h3 className="text-h3 mt-2">{enrollment.programTitle}</h3>
                </div>
                <StatusBadge status={enrollment.status} />
              </div>

              <Progress
                value={enrollment.approvedRequiredCount}
                max={enrollment.requiredTaskCount}
                className="mt-6"
              />

              <dl className="border-border mt-6 grid grid-cols-2 gap-4 border-t pt-5">
                <div>
                  <MonoLabel as="dt" tone="subtle">
                    days remaining
                  </MonoLabel>
                  <dd className="text-h3 mt-1 font-mono" data-numeric>
                    {pad2(days)}
                  </dd>
                </div>
                <div>
                  <MonoLabel as="dt" tone="subtle">
                    ends
                  </MonoLabel>
                  <dd className="text-body mt-1">{formatDate(enrollment.endsAt)}</dd>
                </div>
              </dl>

              {nextTask && (
                <div className="border-border mt-6 border-t pt-5">
                  <MonoLabel as="p" tone="subtle">
                    next up · task {pad2(nextTask.position)}
                  </MonoLabel>
                  <p className="text-body text-fg mt-2">{nextTask.title}</p>
                  {nextTask.latestSubmission?.status === 'CHANGES_REQUESTED' && (
                    <p className="text-body-sm text-warning mt-2">
                      Changes were requested — read the feedback and resubmit.
                    </p>
                  )}
                </div>
              )}

              <Button asChild className="mt-6 max-sm:w-full">
                <Link href={`/dashboard/internships/${enrollment.id}`}>
                  Open program
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <EmptyState
              title="You are not enrolled in a program yet"
              body="Once you are accepted and enrolled, your tasks and progress appear here."
              action={
                <Button asChild>
                  <Link href="/programs">Browse programs</Link>
                </Button>
              }
            />
          )}
        </section>

        <section aria-labelledby="apps-heading">
          <h2 id="apps-heading" className="sr-only">
            Recent applications
          </h2>

          <div className="border-border bg-surface rounded-md border p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <MonoLabel tone="subtle">applications</MonoLabel>
              <Link
                href="/dashboard/applications"
                className="text-caption text-fg-muted hover:text-fg underline underline-offset-4"
              >
                View all
              </Link>
            </div>

            <ul className="mt-4 flex flex-col gap-3">
              {MOCK_APPLICATIONS.slice(0, 4).map((app) => (
                <li
                  key={app.id}
                  className="border-border flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-body-sm text-fg-muted min-w-0 truncate">
                    {app.programTitle}
                  </span>
                  <StatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  )
}
