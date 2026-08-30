/** Mirrors docs/04-DATABASE-SCHEMA.md §5.8 and §5.12. */

export type PaymentStatus = 'CREATED' | 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface Payment {
  id: string
  programTitle: string
  amountMinor: number
  currency: 'INR'
  status: PaymentStatus
  method?: string
  receiptNumber?: string
  failureReason?: string
  createdAt: string
  paidAt?: string
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  CREATED: 'Not started',
  PENDING: 'Processing',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
}

export type CertificateType = 'OFFER_LETTER' | 'COMPLETION'

export interface StudentCertificate {
  id: string
  code: string
  type: CertificateType
  programTitle: string
  issuedAt: string
  status: 'ISSUED' | 'REVOKED'
}

export const CERTIFICATE_TYPE_LABEL: Record<CertificateType, string> = {
  OFFER_LETTER: 'Offer letter',
  COMPLETION: 'Completion certificate',
}
