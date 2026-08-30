import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { MonoLabel } from '@/components/ui/mono-label'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export const metadata: Metadata = {
  title: { default: 'Sign in', template: '%s — Tecxcodr' },
  robots: { index: false, follow: false },
}

/**
 * Minimal auth chrome — docs/02-TRD.md §3.1.
 *
 * No marketing nav and no motion runtime: a sign-in page has exactly one job,
 * and every extra link on it is a way to not sign in.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border border-b">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="flex flex-1 items-center justify-center px-5 py-12 md:py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="border-border border-t">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5">
          <MonoLabel tone="subtle">tecxcodr</MonoLabel>
          <div className="flex gap-5">
            <Link href="/terms" className="text-caption text-fg-muted hover:text-fg">
              Terms
            </Link>
            <Link href="/privacy" className="text-caption text-fg-muted hover:text-fg">
              Privacy
            </Link>
            <Link href="/contact" className="text-caption text-fg-muted hover:text-fg">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
