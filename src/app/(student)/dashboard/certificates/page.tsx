import Link from 'next/link'
import type { Metadata } from 'next'
import { Download, ExternalLink } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { MonoLabel } from '@/components/ui/mono-label'
import { StatusBadge } from '@/components/ui/status-badge'
import { MOCK_CERTIFICATES, MOCK_ENROLLMENT } from '@/content/mock-student'
import { CERTIFICATE_TYPE_LABEL } from '@/types/payment'
import { formatDate, pad2 } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Certificates' }

export default function CertificatesPage() {
  const certificates = MOCK_CERTIFICATES
  const enrollment = MOCK_ENROLLMENT
  const remaining = Math.max(
    0,
    enrollment.requiredTaskCount - enrollment.approvedRequiredCount,
  )

  return (
    <>
      <DashboardPageHeader
        eyebrow="credentials"
        title="Certificates"
        lede="Each one has a public verification page anyone can check without an account."
      />

      {certificates.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          body="Your offer letter is issued when you enrol, and your completion certificate when the required tasks are approved."
          action={
            <Button asChild>
              <Link href="/programs">Browse programs</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {certificates.map((certificate) => (
            <li
              key={certificate.id}
              className="border-border bg-surface rounded-md border p-5 md:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <MonoLabel tone="subtle">{certificate.code}</MonoLabel>
                <StatusBadge status={certificate.status === 'ISSUED' ? 'APPROVED' : 'REJECTED'} />
              </div>

              <h2 className="text-h3 mt-3">{certificate.programTitle}</h2>
              <p className="text-body-sm text-fg-muted mt-1">
                {CERTIFICATE_TYPE_LABEL[certificate.type]}
              </p>

              <dl className="border-border mt-5 border-t pt-4">
                <MonoLabel as="dt" tone="subtle">
                  issued
                </MonoLabel>
                <dd className="text-body-sm mt-1">{formatDate(certificate.issuedAt)}</dd>
              </dl>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button asChild variant="secondary" size="sm" className="max-sm:w-full">
                  <Link href={`/verify/${certificate.code}`}>
                    View public page
                    <ExternalLink aria-hidden className="size-3.5" />
                  </Link>
                </Button>
                {/* TODO(backend): GET /api/certificates/:id/download issues a
                    5-minute signed URL after an ownership check (docs/05 §7). */}
                <Button variant="ghost" size="sm" disabled className="max-sm:w-full">
                  <Download aria-hidden className="size-3.5" />
                  Download
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <section className="border-border bg-bg-subtle mt-8 rounded-md border p-5 md:p-6">
          <MonoLabel as="p" tone="subtle">
            completion certificate
          </MonoLabel>
          <p className="text-body text-fg-muted mt-2 max-w-prose">
            {pad2(remaining)} more required {remaining === 1 ? 'task needs' : 'tasks need'} to be
            approved on {enrollment.programTitle} before your completion certificate can be issued.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-4 max-sm:w-full">
            <Link href={`/dashboard/internships/${enrollment.id}`}>Go to tasks</Link>
          </Button>
        </section>
      )}
    </>
  )
}
