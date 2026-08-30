import type { Application } from '@/types/application'
import type { Enrollment } from '@/types/enrollment'
import type { Payment, StudentCertificate } from '@/types/payment'
import { getProgramBySlug } from '@/content/programs'

/**
 * ⚠️ MOCK DATA — there is no backend, no auth and no database yet.
 *
 * Shapes mirror docs/04 exactly, so wiring the real repository later is a
 * data-source swap and not a component rewrite. Deliberately covers every
 * state the UI must handle, including the awkward ones (rejected, expired,
 * changes-requested, failed payment) — docs/04 §9.
 */

export const MOCK_STUDENT = {
  id: 'usr_demo',
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  emailVerified: true,
  phone: '9876543210',
  city: 'Pune',
  state: 'Maharashtra',
  college: 'Vishwakarma Institute of Technology',
  degree: 'B.Tech',
  branch: 'Computer Science',
  currentYear: 3,
  graduationYear: 2028,
  experienceLevel: 'INTERMEDIATE' as const,
  primarySkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
  githubUrl: 'https://github.com/aarav-demo',
  linkedinUrl: 'https://linkedin.com/in/aarav-demo',
  portfolioUrl: '',
}

const webDev = getProgramBySlug('web-development')

export const MOCK_ENROLLMENT: Enrollment = {
  id: 'enr_demo_1',
  programSlug: 'web-development',
  programTitle: 'Web Development',
  status: 'ACTIVE',
  startedAt: '2026-08-12',
  endsAt: '2026-09-09',
  requiredTaskCount: 2,
  approvedRequiredCount: 1,
  tasks: (webDev?.tasks ?? []).map((task, i) => {
    const base = {
      id: task.id,
      position: task.position,
      title: task.title,
      brief: task.brief,
      requirements: task.requirements,
      estimatedHours: task.estimatedHours,
      isRequired: task.isRequired,
    }

    // Task 1 approved, task 2 needs changes, task 3 untouched — so every
    // task-card state is reachable on one screen.
    if (i === 0) {
      const submission = {
        id: 'sub_1',
        attempt: 1,
        repoUrl: 'https://github.com/aarav-demo/portfolio',
        demoUrl: 'https://aarav-demo.vercel.app',
        status: 'APPROVED' as const,
        feedback:
          'Clean responsive work and the form actually handles its failure states, which most submissions skip. Lighthouse is at 96 on mobile. Approved.',
        submittedAt: '2026-08-18',
        reviewedAt: '2026-08-20',
      }
      return { ...base, latestSubmission: submission, attempts: [submission] }
    }

    if (i === 1) {
      const submission = {
        id: 'sub_2',
        attempt: 1,
        repoUrl: 'https://github.com/aarav-demo/api-dashboard',
        status: 'CHANGES_REQUESTED' as const,
        feedback:
          'Search, filter and pagination work individually but reset each other — filtering while on page 3 drops you back to unfiltered results. Also no cancellation on unmount, so a fast search fires overlapping requests. Fix those two and resubmit.',
        submittedAt: '2026-08-26',
        reviewedAt: '2026-08-28',
      }
      return { ...base, latestSubmission: submission, attempts: [submission] }
    }

    return { ...base, attempts: [] }
  }),
}

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_1',
    programSlug: 'web-development',
    programTitle: 'Web Development',
    status: 'ACCEPTED',
    priceAmountMinor: 79900,
    submittedAt: '2026-08-06',
    decidedAt: '2026-08-09',
    createdAt: '2026-08-05',
    history: [
      { id: 'h1', fromStatus: null, toStatus: 'DRAFT', actorKind: 'USER', createdAt: '2026-08-05' },
      { id: 'h2', fromStatus: 'DRAFT', toStatus: 'SUBMITTED', actorKind: 'USER', createdAt: '2026-08-06' },
      { id: 'h3', fromStatus: 'SUBMITTED', toStatus: 'UNDER_REVIEW', actorKind: 'ADMIN', createdAt: '2026-08-08' },
      { id: 'h4', fromStatus: 'UNDER_REVIEW', toStatus: 'ACCEPTED', actorKind: 'ADMIN', note: 'Enrolled on 12 Aug.', createdAt: '2026-08-09' },
    ],
  },
  {
    id: 'app_2',
    programSlug: 'data-science',
    programTitle: 'Data Science',
    status: 'ACCEPTED',
    priceAmountMinor: 79900,
    submittedAt: '2026-08-24',
    decidedAt: '2026-08-27',
    paymentDueAt: '2026-09-10',
    createdAt: '2026-08-24',
    history: [
      { id: 'h5', fromStatus: null, toStatus: 'DRAFT', actorKind: 'USER', createdAt: '2026-08-24' },
      { id: 'h6', fromStatus: 'DRAFT', toStatus: 'SUBMITTED', actorKind: 'USER', createdAt: '2026-08-24' },
      { id: 'h7', fromStatus: 'SUBMITTED', toStatus: 'ACCEPTED', actorKind: 'ADMIN', createdAt: '2026-08-27' },
    ],
  },
  {
    id: 'app_3',
    programSlug: 'java-programming',
    programTitle: 'Java Programming',
    status: 'REJECTED',
    priceAmountMinor: 79900,
    submittedAt: '2026-07-14',
    decidedAt: '2026-07-17',
    rejectionReason:
      'The application did not show enough prior Java experience for the level these tasks assume.',
    createdAt: '2026-07-14',
    history: [
      { id: 'h8', fromStatus: null, toStatus: 'DRAFT', actorKind: 'USER', createdAt: '2026-07-14' },
      { id: 'h9', fromStatus: 'DRAFT', toStatus: 'SUBMITTED', actorKind: 'USER', createdAt: '2026-07-14' },
      { id: 'h10', fromStatus: 'SUBMITTED', toStatus: 'REJECTED', actorKind: 'ADMIN', createdAt: '2026-07-17' },
    ],
  },
  {
    id: 'app_4',
    programSlug: 'android-development',
    programTitle: 'Android Development',
    status: 'DRAFT',
    priceAmountMinor: 79900,
    createdAt: '2026-08-29',
    history: [
      { id: 'h11', fromStatus: null, toStatus: 'DRAFT', actorKind: 'USER', createdAt: '2026-08-29' },
    ],
  },
]

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    programTitle: 'Web Development',
    amountMinor: 79900,
    currency: 'INR',
    status: 'PAID',
    method: 'UPI',
    receiptNumber: 'TCX-INV-2026-000417',
    createdAt: '2026-08-12',
    paidAt: '2026-08-12',
  },
  {
    id: 'pay_2',
    programTitle: 'Data Science',
    amountMinor: 79900,
    currency: 'INR',
    status: 'FAILED',
    method: 'Card',
    failureReason: 'The bank declined the transaction. No money was taken.',
    createdAt: '2026-08-28',
  },
]

export const MOCK_CERTIFICATES: StudentCertificate[] = [
  {
    id: 'cert_1',
    code: 'TCX-2608-4RM7XB2K',
    type: 'OFFER_LETTER',
    programTitle: 'Web Development',
    issuedAt: '2026-08-12',
    status: 'ISSUED',
  },
]

export function getEnrollmentById(id: string): Enrollment | undefined {
  return MOCK_ENROLLMENT.id === id ? MOCK_ENROLLMENT : undefined
}

export function getApplicationById(id: string): Application | undefined {
  return MOCK_APPLICATIONS.find((a) => a.id === id)
}
