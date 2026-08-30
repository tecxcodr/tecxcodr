import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { MonoLabel } from '@/components/ui/mono-label'
import { ThemeToggle } from '@/components/ui/theme-toggle'

/**
 * Minimal, self-contained chrome — docs/02-TRD.md §3.1.
 *
 * The audience here is a recruiter who has never seen Tecxcodr and will only
 * ever see this one page. It must load fast and look institutional, so it gets
 * no marketing nav, no motion runtime, and no footer sitemap.
 */
export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border border-b">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span aria-hidden className="text-fg-subtle">
              /
            </span>
            <MonoLabel>certificate verification</MonoLabel>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-border border-t">
        <div className="container-page flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between">
          <MonoLabel tone="subtle">
            verification is public · no account required
          </MonoLabel>
          <Link href="/" className="text-caption text-fg-muted hover:text-fg">
            About Tecxcodr
          </Link>
        </div>
      </footer>
    </div>
  )
}
