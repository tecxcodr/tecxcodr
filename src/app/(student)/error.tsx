'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO(backend): Sentry.captureException with the request id.
    console.error(error)
  }, [error])

  return (
    <div className="max-w-lg py-8">
      <MonoLabel tone="subtle">[ error ]</MonoLabel>
      <h1 className="text-h2 mt-4">This page did not load</h1>
      <p className="text-body text-fg-muted mt-3">
        Your data is safe — this is a display problem on our side. Try again, and send us the
        reference below if it persists.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset} className="max-sm:w-full">
          Try again
        </Button>
        <Button asChild variant="secondary" className="max-sm:w-full">
          <Link href="/dashboard">Back to overview</Link>
        </Button>
      </div>

      {error.digest && (
        <p className="text-caption text-fg-subtle mt-6">
          reference: <code className="font-mono text-mono-sm">{error.digest}</code>
        </p>
      )}
    </div>
  )
}
