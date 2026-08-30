/** Mirrors docs/04-DATABASE-SCHEMA.md §5.6 and §5.7. */

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'EXPIRED'

export type ActorKind = 'USER' | 'ADMIN' | 'SYSTEM'

export interface StatusEvent {
  id: string
  fromStatus: ApplicationStatus | null
  toStatus: ApplicationStatus
  actorKind: ActorKind
  note?: string
  createdAt: string
}

export interface Application {
  id: string
  programSlug: string
  programTitle: string
  status: ApplicationStatus
  priceAmountMinor: number
  submittedAt?: string
  decidedAt?: string
  /** Set on acceptance: decidedAt + 14 days. docs/01 FR-3.5. */
  paymentDueAt?: string
  rejectionReason?: string
  createdAt: string
  history: StatusEvent[]
}

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Not accepted',
  WITHDRAWN: 'Withdrawn',
  EXPIRED: 'Expired',
}

/**
 * Plain-language explanation per status. The dashboard should answer "what
 * happens next" without the student emailing anyone (docs/01 US-3).
 */
export const APPLICATION_STATUS_HINT: Record<ApplicationStatus, string> = {
  DRAFT: 'You have not submitted this yet. Pick up where you left off.',
  SUBMITTED: 'We have it. You will hear back within three working days.',
  UNDER_REVIEW: 'Someone is reading your application right now.',
  ACCEPTED: 'You are in. Complete payment to start the program.',
  REJECTED: 'Not accepted this time. You can apply to another program.',
  WITHDRAWN: 'You withdrew this application.',
  EXPIRED: 'The payment window closed. You can apply again.',
}
