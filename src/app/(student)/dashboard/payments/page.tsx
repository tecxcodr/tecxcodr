import Link from 'next/link'
import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { MonoLabel } from '@/components/ui/mono-label'
import { StatusBadge } from '@/components/ui/status-badge'
import { MOCK_PAYMENTS } from '@/content/mock-student'
import { formatDate, formatPrice } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Payments' }

/**
 * docs/03-DESIGN-SYSTEM.md §5.6: below `md` the table becomes stacked cards
 * rather than scrolling horizontally. A horizontally scrolling data table on
 * a phone is a failure mode, not a fallback.
 */
export default function PaymentsPage() {
  const payments = MOCK_PAYMENTS

  return (
    <>
      <DashboardPageHeader
        eyebrow="billing"
        title="Payments"
        lede="Every enrolment payment and its receipt. Refunds follow the published policy."
      />

      {payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          body="You are only charged once an application is accepted and you choose to enrol."
          action={
            <Button asChild>
              <Link href="/programs">Browse programs</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="border-border hidden overflow-hidden rounded-md border md:block">
            <table className="w-full">
              <caption className="sr-only">Your payment history</caption>
              <thead className="bg-bg-subtle border-border border-b">
                <tr>
                  <Th>Program</Th>
                  <Th>Date</Th>
                  <Th>Amount</Th>
                  <Th>Method</Th>
                  <Th>Status</Th>
                  <Th>Receipt</Th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-border hover:bg-bg-subtle border-b last:border-0">
                    <Td>{payment.programTitle}</Td>
                    <Td>{formatDate(payment.paidAt ?? payment.createdAt)}</Td>
                    <Td numeric>{formatPrice(payment.amountMinor, payment.currency)}</Td>
                    <Td>{payment.method ?? '—'}</Td>
                    <Td>
                      <StatusBadge status={payment.status} />
                    </Td>
                    <Td>
                      {payment.receiptNumber ? (
                        <span className="font-mono text-mono-sm">{payment.receiptNumber}</span>
                      ) : (
                        <span className="text-fg-subtle">—</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="flex flex-col gap-3 md:hidden">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="border-border bg-surface rounded-md border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-body-sm text-fg font-medium">{payment.programTitle}</p>
                  <StatusBadge status={payment.status} />
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-3">
                  <Cell label="amount" value={formatPrice(payment.amountMinor, payment.currency)} />
                  <Cell label="date" value={formatDate(payment.paidAt ?? payment.createdAt)} />
                  <Cell label="method" value={payment.method ?? '—'} />
                  <Cell label="receipt" value={payment.receiptNumber ?? '—'} mono />
                </dl>

                {payment.failureReason && (
                  <p className="text-caption text-fg-muted border-border mt-3 border-t pt-3">
                    {payment.failureReason}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="border-border mt-8 flex flex-wrap items-center gap-4 border-t pt-6">
            {/* TODO(backend): GET /api/payments/:id/receipt — docs/06 §3. */}
            <Button variant="secondary" size="sm" disabled>
              <Download aria-hidden className="size-4" />
              Download receipts
            </Button>
            <MonoLabel tone="subtle">
              receipts not wired up yet ·{' '}
              <Link href="/refund-policy" className="underline underline-offset-4">
                refund policy
              </Link>
            </MonoLabel>
          </div>
        </>
      )}
    </>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 text-left">
      <MonoLabel tone="subtle">{children}</MonoLabel>
    </th>
  )
}

function Td({ children, numeric }: { children: React.ReactNode; numeric?: boolean }) {
  return (
    <td className="text-body-sm text-fg-muted px-4 py-4" data-numeric={numeric ? '' : undefined}>
      {children}
    </td>
  )
}

function Cell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <MonoLabel as="dt" tone="subtle">
        {label}
      </MonoLabel>
      <dd className={`text-body-sm text-fg-muted mt-0.5 ${mono ? 'font-mono text-mono-sm' : ''}`}>
        {value}
      </dd>
    </div>
  )
}
