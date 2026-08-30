import { Badge } from '@/components/ui/badge'
import { APPLICATION_STATUS_LABEL, type ApplicationStatus } from '@/types/application'
import {
  ENROLLMENT_STATUS_LABEL,
  SUBMISSION_STATUS_LABEL,
  type EnrollmentStatus,
  type SubmissionStatus,
} from '@/types/enrollment'
import { PAYMENT_STATUS_LABEL, type PaymentStatus } from '@/types/payment'

type Tone = 'neutral' | 'success' | 'warning' | 'destructive' | 'info'

/**
 * The status → tone table from docs/03-DESIGN-SYSTEM.md §5.5, in one place.
 *
 * Colour is never the only signal: every badge renders its text label, so the
 * meaning survives greyscale, colour-blindness and a screen reader.
 */
const TONE: Record<string, Tone> = {
  // application
  DRAFT: 'neutral',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'info',
  ACCEPTED: 'success',
  REJECTED: 'destructive',
  WITHDRAWN: 'neutral',
  EXPIRED: 'warning',
  // submission
  APPROVED: 'success',
  CHANGES_REQUESTED: 'warning',
  // enrolment
  ACTIVE: 'success',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  // payment
  CREATED: 'neutral',
  PENDING: 'info',
  PAID: 'success',
  FAILED: 'destructive',
  REFUNDED: 'neutral',
}

type AnyStatus = ApplicationStatus | SubmissionStatus | EnrollmentStatus | PaymentStatus

const LABEL: Record<string, string> = {
  ...APPLICATION_STATUS_LABEL,
  ...SUBMISSION_STATUS_LABEL,
  ...ENROLLMENT_STATUS_LABEL,
  ...PAYMENT_STATUS_LABEL,
}

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  return (
    <Badge tone={TONE[status] ?? 'neutral'} className={className}>
      {LABEL[status] ?? status}
    </Badge>
  )
}
