import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, Check, SearchX, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { getCertificateByCode, type Certificate } from '@/content/certificates'
import { formatDate, pad2 } from '@/lib/utils/format'

/** Cached at the edge; purged on revoke. docs/02-TRD.md §3.3, §8. */
export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>
}): Promise<Metadata> {
  const { code } = await params
  const certificate = getCertificateByCode(code)

  if (!certificate) {
    return { title: 'Certificate not found', robots: { index: false } }
  }

  return {
    title: `${certificate.holderName} — ${certificate.programTitle}`,
    description: `Tecxcodr certificate ${certificate.code}. Issued to ${certificate.holderName} for the ${certificate.programTitle} program.`,
    alternates: { canonical: `/verify/${certificate.code}` },
  }
}

/**
 * Three designed states — VALID, REVOKED, NOT FOUND — and never a 404.
 * docs/01 FR-6.5 and docs/03 §5.14: a revoked or mistyped code must still land
 * on a page that looks intentional, because this is the only Tecxcodr surface
 * most recruiters will ever see.
 *
 * Only public columns are rendered. No email, phone, payment or user id.
 */
export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const certificate = getCertificateByCode(code)

  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto w-full max-w-2xl">
        {!certificate ? (
          <NotFoundState code={code} />
        ) : certificate.status === 'REVOKED' ? (
          <RevokedState certificate={certificate} />
        ) : (
          <ValidState certificate={certificate} />
        )}

        <div className="border-border mt-10 border-t pt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/verify">Check another certificate</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function CertificateShell({
  tone,
  badge,
  children,
}: {
  tone: 'success' | 'destructive' | 'neutral'
  badge: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <article className="border-border bg-surface rounded-md border">
      <header
        className={
          'border-border flex items-center justify-between gap-4 border-b px-6 py-4 md:px-8 ' +
          (tone === 'success'
            ? 'bg-success-subtle'
            : tone === 'destructive'
              ? 'bg-destructive-subtle'
              : 'bg-bg-subtle')
        }
      >
        <MonoLabel tone="subtle">tecxcodr.com/verify</MonoLabel>
        {badge}
      </header>
      <div className="px-6 py-8 md:px-8 md:py-10">{children}</div>
    </article>
  )
}

function ValidState({ certificate }: { certificate: Certificate }) {
  return (
    <CertificateShell
      tone="success"
      badge={
        <Badge tone="success">
          <ShieldCheck aria-hidden className="mr-1.5 size-3" />
          Valid
        </Badge>
      }
    >
      <MonoLabel as="p" tone="subtle">
        {certificate.code}
      </MonoLabel>

      <h1 className="text-h1 mt-3">{certificate.holderName}</h1>
      <p className="text-body-lg text-fg-muted mt-2">
        {certificate.programTitle} ·{' '}
        {certificate.type === 'COMPLETION' ? 'Completion certificate' : 'Offer letter'}
      </p>

      <dl className="border-border mt-8 grid grid-cols-2 gap-6 border-t pt-8">
        <div>
          <MonoLabel as="dt" tone="subtle">
            issued
          </MonoLabel>
          <dd className="text-body mt-1">{formatDate(certificate.issuedAt)}</dd>
        </div>
        <div>
          <MonoLabel as="dt" tone="subtle">
            tasks approved
          </MonoLabel>
          <dd className="text-body mt-1" data-numeric>
            {pad2(certificate.tasksApproved)} / {pad2(certificate.tasksTotal)}
          </dd>
        </div>
      </dl>

      <div className="border-border mt-8 border-t pt-8">
        <MonoLabel as="p" tone="subtle" className="mb-4">
          completed tasks
        </MonoLabel>
        <ul className="flex flex-col gap-3">
          {certificate.completedTasks.map((task) => (
            <li key={task} className="text-body text-fg-muted flex gap-3">
              <Check aria-hidden className="text-success mt-1 size-4 shrink-0" />
              {task}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-caption text-fg-subtle border-border mt-8 border-t pt-6">
        This certificate records project work reviewed by a person at Tecxcodr. It is not a
        degree, a qualification, or a statement about the holder&rsquo;s employability.
      </p>
    </CertificateShell>
  )
}

function RevokedState({ certificate }: { certificate: Certificate }) {
  return (
    <CertificateShell
      tone="destructive"
      badge={
        <Badge tone="destructive">
          <AlertTriangle aria-hidden className="mr-1.5 size-3" />
          Revoked
        </Badge>
      }
    >
      <MonoLabel as="p" tone="subtle">
        {certificate.code}
      </MonoLabel>

      <h1 className="text-h1 mt-3">This certificate has been revoked</h1>
      <p className="text-body text-fg-muted mt-3 max-w-prose">
        It was issued on {formatDate(certificate.issuedAt)} and revoked on{' '}
        {certificate.revokedAt ? formatDate(certificate.revokedAt) : 'a later date'}. It should
        not be treated as valid.
      </p>

      {certificate.revokeReason && (
        <div className="border-border bg-bg-subtle mt-6 rounded-md border p-4">
          <MonoLabel as="p" tone="subtle">
            reason
          </MonoLabel>
          <p className="text-body-sm text-fg-muted mt-2">{certificate.revokeReason}</p>
        </div>
      )}

      <p className="text-caption text-fg-subtle mt-8">
        Revoked certificates stay listed rather than disappearing, so a check always returns a
        definite answer.
      </p>
    </CertificateShell>
  )
}

function NotFoundState({ code }: { code: string }) {
  return (
    <CertificateShell tone="neutral" badge={<Badge>Not found</Badge>}>
      <SearchX aria-hidden className="text-fg-subtle size-6" />
      <h1 className="text-h1 mt-4">No certificate matches this code</h1>
      <p className="text-body text-fg-muted mt-3 max-w-prose">
        We have no record of{' '}
        <code className="text-fg font-mono text-mono-sm break-all">{code}</code>. Check for a typo
        — codes look like <code className="font-mono text-mono-sm">TCX-2609-7QK4M2XR</code>.
      </p>
      <p className="text-body-sm text-fg-muted mt-4">
        If the code was copied correctly and still does not resolve, the certificate was not
        issued by Tecxcodr.
      </p>
    </CertificateShell>
  )
}
