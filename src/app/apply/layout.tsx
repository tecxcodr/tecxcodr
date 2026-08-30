import Link from 'next/link'
import { X } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { MonoLabel } from '@/components/ui/mono-label'

/**
 * Focused-flow chrome. No marketing nav, no footer sitemap, no motion runtime:
 * once someone starts applying, every link that is not "finish" or "leave" is
 * a leak. docs/02-TRD.md §3.1.
 */
export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span aria-hidden className="text-fg-subtle">
              /
            </span>
            <MonoLabel>application</MonoLabel>
          </div>

          <Link
            href="/programs"
            className="text-fg-muted hover:text-fg inline-flex items-center gap-2 text-body-sm transition-colors"
          >
            <span className="max-sm:sr-only">Save and exit</span>
            <X aria-hidden className="size-4" />
          </Link>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  )
}
