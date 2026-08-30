import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { MonoLabel } from '@/components/ui/mono-label'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/ui/status-badge'
import { MOCK_ENROLLMENT } from '@/content/mock-student'
import { daysRemaining } from '@/types/enrollment'
import { formatDate, pad2 } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'My internship' }

export default function InternshipsPage() {
  // One enrolment today; a list because docs/00 P3 allows applying to another
  // program while enrolled, so more than one can exist over time.
  const enrollments = [MOCK_ENROLLMENT]

  return (
    <>
      <DashboardPageHeader
        eyebrow="programs"
        title="My internship"
        lede="Your enrolled programs, their deadlines and how far through you are."
      />

      {enrollments.length === 0 ? (
        <EmptyState
          title="No active enrolment"
          body="Once an application is accepted and paid, the program opens here with its tasks."
          action={
            <Button asChild>
              <Link href="/programs">Browse programs</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {enrollments.map((enrollment) => {
            const days = daysRemaining(enrollment.endsAt)
            return (
              <li
                key={enrollment.id}
                className="border-border bg-surface rounded-md border p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-h3">{enrollment.programTitle}</h2>
                  <StatusBadge status={enrollment.status} />
                </div>

                <Progress
                  value={enrollment.approvedRequiredCount}
                  max={enrollment.requiredTaskCount}
                  className="mt-5"
                />

                <dl className="border-border mt-5 grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <MonoLabel as="dt" tone="subtle">
                      started
                    </MonoLabel>
                    <dd className="text-body-sm mt-1">{formatDate(enrollment.startedAt)}</dd>
                  </div>
                  <div>
                    <MonoLabel as="dt" tone="subtle">
                      days left
                    </MonoLabel>
                    <dd className="text-body-sm mt-1" data-numeric>
                      {pad2(days)}
                    </dd>
                  </div>
                </dl>

                <Button asChild className="mt-5 w-full">
                  <Link href={`/dashboard/internships/${enrollment.id}`}>
                    Open program
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
