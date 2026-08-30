import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'

/**
 * Not-found boundary for the dashboard group.
 *
 * Without this, a `notFound()` thrown inside a dashboard segment has nowhere
 * to render and the route hangs on the loading skeleton forever.
 *
 * Note the HTTP status stays 200 for these: `loading.tsx` streams the shell
 * before the segment resolves, so the status line is already sent by the time
 * notFound() fires. That is standard Next.js streaming behaviour and harmless
 * here — the whole dashboard is `noindex` (see the group layout), so no
 * crawler is relying on the status code. What matters is that the user gets a
 * real, designed state instead of a stuck spinner.
 */
export default function DashboardNotFound() {
  return (
    <div className="max-w-lg py-8">
      <MonoLabel tone="subtle">[ 404 ]</MonoLabel>
      <h1 className="text-h2 mt-4">We could not find that</h1>
      <p className="text-body text-fg-muted mt-3">
        This program or page either does not exist, or it is not on your account.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="max-sm:w-full">
          <Link href="/dashboard">Back to overview</Link>
        </Button>
        <Button asChild variant="secondary" className="max-sm:w-full">
          <Link href="/dashboard/internships">My programs</Link>
        </Button>
      </div>
    </div>
  )
}
