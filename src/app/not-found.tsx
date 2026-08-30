import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { MonoLabel } from '@/components/ui/mono-label'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border border-b">
        <div className="container-page flex h-16 items-center">
          <Logo />
        </div>
      </header>

      <main id="main" className="container-page flex flex-1 items-center py-20">
        <div className="max-w-lg">
          <MonoLabel tone="subtle">[ 404 ]</MonoLabel>
          <h1 className="text-h1 mt-4">This page does not exist</h1>
          <p className="text-body text-fg-muted mt-4">
            The link may be out of date, or the address may have a typo in it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/programs">Browse programs</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
