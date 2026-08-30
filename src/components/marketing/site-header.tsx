'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { MonoLabel } from '@/components/ui/mono-label'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MAIN_NAV } from '@/lib/constants/site'
import { cn } from '@/lib/utils/cn'

/**
 * Sticky header. docs/03-DESIGN-SYSTEM.md §5.13.
 *
 * Transparent at the top, then acquires a blurred background, a hairline
 * border and a shorter height. Everything that changes is a compositor-safe
 * property or a background — height is transitioned but the header is
 * `sticky`, so the document below it never reflows.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the panel on navigation.
  useEffect(() => setMenuOpen(false), [pathname])

  // Lock background scroll and wire Escape while the panel is open.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <a
        href="#main"
        className={cn(
          'sr-only focus:not-sr-only',
          'focus:bg-surface-raised focus:text-fg focus:border-border focus:fixed',
          'focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:border focus:px-4 focus:py-2',
        )}
      >
        Skip to content
      </a>

      <header
        data-scrolled={scrolled || undefined}
        className={cn(
          'sticky top-0 z-50 w-full',
          'transition-[height,background-color,border-color,backdrop-filter]',
          'duration-[--duration-base] ease-[--ease-out-expo]',
          'h-18 border-b border-transparent',
          scrolled && 'bg-bg/80 border-border h-15 backdrop-blur-xl',
        )}
      >
        <div className="container-page flex h-full items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'text-body-sm group relative py-1 transition-colors duration-[--duration-instant]',
                  isActive(item.href) ? 'text-fg' : 'text-fg-muted hover:text-fg',
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    'bg-fg absolute inset-x-0 -bottom-0.5 h-px origin-left',
                    'transition-transform duration-[--duration-fast] ease-[--ease-out-expo]',
                    isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/programs">Apply now</Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="text-fg -mr-2 inline-flex size-11 items-center justify-center rounded-md lg:hidden"
          >
            {menuOpen ? (
              <X aria-hidden className="size-5" />
            ) : (
              <Menu aria-hidden className="size-5" />
            )}
          </button>
        </div>
      </header>

      {/* Full-screen panel — a dedicated mobile design, not a collapsed
          desktop navbar. docs/03 §5.13. */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className={cn('bg-bg fixed inset-0 z-40 flex flex-col lg:hidden', menuOpen && 'flex')}
      >
        <div className="h-18 shrink-0" aria-hidden />

        <nav aria-label="Mobile" className="container-page flex-1 overflow-y-auto pt-4">
          <MonoLabel tone="subtle" className="mb-4 block">
            [ navigate ]
          </MonoLabel>
          <ul className="flex flex-col">
            {MAIN_NAV.map((item, i) => (
              <li key={item.href} className="border-border border-b">
                <Link
                  href={item.href}
                  className="text-h2 font-display flex items-baseline gap-4 py-5"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <span className="text-fg-subtle font-mono text-mono-label">
                    0{i + 1}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="container-page border-border flex flex-col gap-3 border-t py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <MonoLabel tone="subtle">theme</MonoLabel>
            <ThemeToggle />
          </div>
          <Button asChild variant="secondary" size="lg" className="w-full">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="lg" className="w-full">
            <Link href="/programs">Apply now</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
