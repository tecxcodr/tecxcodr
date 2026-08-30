/**
 * Sample certificates so all three verification states are reachable during
 * frontend development — docs/04 §9 (seed) and docs/03 §5.14.
 *
 * Shapes mirror docs/04 §5.12. `holderName` and `programTitle` are snapshots
 * by design: the verify page must render exactly what was certified, even if
 * the user later renames themselves or the program is retitled.
 *
 * ⚠️ Replaced by a database lookup (docs/04 Q7) when the backend lands.
 */

export type CertificateType = 'OFFER_LETTER' | 'COMPLETION'
export type CertificateStatus = 'ISSUED' | 'REVOKED'

export interface Certificate {
  code: string
  type: CertificateType
  status: CertificateStatus
  holderName: string
  programTitle: string
  issuedAt: string
  revokedAt?: string
  revokeReason?: string
  completedTasks: string[]
  tasksApproved: number
  tasksTotal: number
}

const CERTIFICATES: Certificate[] = [
  {
    code: 'TCX-2609-7QK4M2XR',
    type: 'COMPLETION',
    status: 'ISSUED',
    holderName: 'Aarav Sharma',
    programTitle: 'Web Development',
    issuedAt: '2026-09-14',
    completedTasks: [
      'Responsive portfolio with a working contact form',
      'Data-driven dashboard consuming a public API',
    ],
    tasksApproved: 2,
    tasksTotal: 3,
  },
  {
    code: 'TCX-2608-3JH9WD5N',
    type: 'COMPLETION',
    status: 'REVOKED',
    holderName: 'Sample Revoked',
    programTitle: 'Python Programming',
    issuedAt: '2026-08-02',
    revokedAt: '2026-08-19',
    revokeReason: 'Submitted work was found to be copied from another repository.',
    completedTasks: ['Command-line tool with real argument handling'],
    tasksApproved: 2,
    tasksTotal: 3,
  },
]

/** Codes are compared case-insensitively; people retype these from printouts. */
export function getCertificateByCode(code: string): Certificate | undefined {
  const normalised = code.trim().toUpperCase()
  return CERTIFICATES.find((c) => c.code === normalised)
}

/** `TCX-YYMM-XXXXXXXX`, Crockford base32 body. docs/04 §5.12. */
export const CERTIFICATE_CODE_PATTERN = /^TCX-\d{4}-[0-9A-HJKMNP-TV-Z]{8}$/i
