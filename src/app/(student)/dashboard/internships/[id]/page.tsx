import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { TaskCard } from '@/components/dashboard/task-card'
import { MonoLabel } from '@/components/ui/mono-label'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/ui/status-badge'
import { getEnrollmentById } from '@/content/mock-student'
import { daysRemaining } from '@/types/enrollment'
import { formatDate, pad2 } from '@/lib/utils/format'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const enrollment = getEnrollmentById(id)
  return { title: enrollment ? enrollment.programTitle : 'Program' }
}

export default async function EnrollmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // TODO(backend): getMyEnrollment(ctx, id) — must scope by user_id in the
  // query, not filter after fetching (docs/02-TRD §6.2).
  const enrollment = getEnrollmentById(id)
  if (!enrollment) notFound()

  const days = daysRemaining(enrollment.endsAt)
  const remaining = Math.max(
    0,
    enrollment.requiredTaskCount - enrollment.approvedRequiredCount,
  )

  return (
    <>
      <Link
        href="/dashboard/internships"
        className="text-fg-muted hover:text-fg mb-6 inline-flex items-center gap-2 text-body-sm transition-colors"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All programs
      </Link>

      <DashboardPageHeader
        eyebrow="program"
        title={enrollment.programTitle}
        lede={
          remaining > 0
            ? `Complete ${remaining} more required ${remaining === 1 ? 'task' : 'tasks'} to earn your certificate.`
            : 'All required tasks approved. Your certificate is being issued.'
        }
        action={<StatusBadge status={enrollment.status} />}
      />

      <section className="border-border bg-surface mb-8 rounded-md border p-5 md:p-6">
        <Progress
          value={enrollment.approvedRequiredCount}
          max={enrollment.requiredTaskCount}
        />

        <dl className="border-border mt-5 grid grid-cols-2 gap-4 border-t pt-5 md:grid-cols-4">
          <Stat label="started" value={formatDate(enrollment.startedAt)} />
          <Stat label="ends" value={formatDate(enrollment.endsAt)} />
          <Stat label="days left" value={pad2(days)} numeric />
          <Stat
            label="tasks"
            value={`${pad2(enrollment.tasks.length)} total`}
          />
        </dl>

        {days <= 7 && enrollment.status === 'ACTIVE' && (
          <p className="border-warning/30 bg-warning-subtle text-body-sm text-fg-muted mt-5 rounded-md border p-4">
            Your window closes on {formatDate(enrollment.endsAt)}. Submissions are not accepted
            after that, and no certificate is issued for an expired enrolment.
          </p>
        )}
      </section>

      <MonoLabel as="p" tone="subtle" className="mb-4">
        tasks · self-paced, all unlocked
      </MonoLabel>

      <ul className="flex flex-col gap-4">
        {enrollment.tasks.map((task) => (
          <li key={task.id}>
            <TaskCard enrollment={enrollment} task={task} />
          </li>
        ))}
      </ul>
    </>
  )
}

function Stat({
  label,
  value,
  numeric,
}: {
  label: string
  value: string
  numeric?: boolean
}) {
  return (
    <div>
      <MonoLabel as="dt" tone="subtle">
        {label}
      </MonoLabel>
      <dd className="text-body-sm mt-1" data-numeric={numeric ? '' : undefined}>
        {value}
      </dd>
    </div>
  )
}
