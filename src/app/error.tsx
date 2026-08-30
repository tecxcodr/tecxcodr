'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'

/**
 * Root error boundary. docs/03-DESIGN-SYSTEM.md §5.14: plain-language message,
 * a retry, a way home, and a reference the user can quote to support.
 *
 * Never a stack trace and never a raw error string — `error.digest` is the
 * server-side correlation id and is the only technical detail shown.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO(backend): report to Sentry with the request id — docs/02-TRD §9.4.
    console.error(error)
  }, [error])

  return (
    <div className="container-page flex min-h-dvh items-center py-20">
      <div className="max-w-lg">
        <MonoLabel tone="subtle">[ error ]</MonoLabel>
        <h1 className="text-h1 mt-4">Something broke on our side</h1>
        <p className="text-body text-fg-muted mt-4">
          This is our fault, not yours. Try again — if it keeps happening, send us the reference
          below and we will look into it.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} className="max-sm:w-full">
            Try again
          </Button>
          <Button asChild variant="secondary" className="max-sm:w-full">
            <Link href="/">Go home</Link>
          </Button>
        </div>

        {error.digest && (
          <p className="text-caption text-fg-subtle mt-8">
            reference: <code className="font-mono text-mono-sm">{error.digest}</code>
          </p>
        )}
      </div>
    </div>
  )
}
