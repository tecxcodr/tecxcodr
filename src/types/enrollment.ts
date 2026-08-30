/** Mirrors docs/04-DATABASE-SCHEMA.md §5.10 and §5.11. */

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'

export type SubmissionStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'CHANGES_REQUESTED'

export interface TaskSubmission {
  id: string
  attempt: number
  repoUrl: string
  demoUrl?: string
  notes?: string
  status: SubmissionStatus
  feedback?: string
  submittedAt: string
  reviewedAt?: string
}

/** A program task joined with this enrolment's latest submission (docs/04 Q5). */
export interface EnrollmentTask {
  id: string
  position: number
  title: string
  brief: string
  requirements: string[]
  estimatedHours: number
  isRequired: boolean
  latestSubmission?: TaskSubmission
  /** All attempts, newest first. Empty when never submitted. */
  attempts: TaskSubmission[]
}

export interface Enrollment {
  id: string
  programSlug: string
  programTitle: string
  status: EnrollmentStatus
  startedAt: string
  endsAt: string
  completedAt?: string
  /** Snapshot at enrolment — changing the program rule cannot un-complete. */
  requiredTaskCount: number
  approvedRequiredCount: number
  tasks: EnrollmentTask[]
}

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under review',
  APPROVED: 'Approved',
  CHANGES_REQUESTED: 'Changes requested',
}

export const ENROLLMENT_STATUS_LABEL: Record<EnrollmentStatus, string> = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
}

/** Whole days remaining, floored at 0. Negative windows read as expired. */
export function daysRemaining(endsAt: string, now: Date = new Date()): number {
  const ms = new Date(endsAt).getTime() - now.getTime()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

export function canSubmit(enrollment: Enrollment, task: EnrollmentTask): boolean {
  if (enrollment.status !== 'ACTIVE') return false
  if (task.latestSubmission?.status === 'APPROVED') return false
  // A submission awaiting review is not resubmittable — docs/04 §6.4.
  if (
    task.latestSubmission?.status === 'SUBMITTED' ||
    task.latestSubmission?.status === 'UNDER_REVIEW'
  ) {
    return false
  }
  return true
}
