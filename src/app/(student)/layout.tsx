import type { Metadata } from 'next'
import Link from 'next/link'
import { DashboardSidebar, DashboardTabBar } from '@/components/dashboard/dashboard-nav'
import { Logo } from '@/components/ui/logo'
import { MonoLabel } from '@/components/ui/mono-label'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MOCK_STUDENT } from '@/content/mock-student'

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s — Tecxcodr' },
  robots: { index: false, follow: false },
}

/**
 * Student dashboard shell.
 *
 * ⚠️ NO AUTH GUARD YET. Once Better Auth lands this layout gets a
 * `requireUser()` call and middleware gains a coarse redirect (docs/02-TRD
 * §6.2). Today the route is public and reads mock data.
 *
 * Deliberately does NOT mount MotionRoot: dashboards ship zero animation JS
 * (docs/03 §6.1 rule 7).
 */
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border bg-bg/90 sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span aria-hidden className="text-fg-subtle max-sm:hidden">
              /
            </span>
            <MonoLabel className="max-sm:hidden">dashboard</MonoLabel>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard/profile"
              className="border-border bg-bg-subtle text-fg-muted hover:text-fg flex size-8 items-center justify-center rounded-full border font-mono text-mono-label transition-colors"
              aria-label="Your profile"
            >
              {MOCK_STUDENT.name.charAt(0)}
            </Link>
          </div>
        </div>
      </header>

      <div className="container-page flex flex-1 gap-10">
        <aside className="hidden w-60 shrink-0 py-8 lg:block">
          <div className="sticky top-24">
            <DashboardSidebar />

            <div className="border-border mt-8 border-t pt-4">
              <MonoLabel as="p" tone="subtle">
                demo data · no backend
              </MonoLabel>
            </div>
          </div>
        </aside>

        {/* Bottom padding clears the fixed mobile tab bar. */}
        <main id="main" className="min-w-0 flex-1 py-8 pb-28 lg:pb-8">
          {children}
        </main>
      </div>

      <DashboardTabBar />
    </div>
  )
}
