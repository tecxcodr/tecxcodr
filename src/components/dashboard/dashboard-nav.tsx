'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MonoLabel } from '@/components/ui/mono-label'
import { DASHBOARD_NAV, MOBILE_TABS, NAV_GROUPS } from '@/lib/constants/dashboard-nav'
import { cn } from '@/lib/utils/cn'

/** Overview must match exactly or every route would light it up. */
function useIsActive() {
  const pathname = usePathname()
  return (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)
}

/**
 * Desktop sidebar. docs/03-DESIGN-SYSTEM.md §5.13 — grouped `mono-label`
 * headers and a persistent 2px indicator on the active item.
 *
 * No animation library: this route group ships zero GSAP (docs/03 §6.1 rule 7).
 */
export function DashboardSidebar() {
  const isActive = useIsActive()

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-8">
      {NAV_GROUPS.map((group) => (
        <div key={group}>
          <MonoLabel as="p" tone="subtle" className="mb-3 px-3">
            {group}
          </MonoLabel>
          <ul className="flex flex-col gap-0.5">
            {DASHBOARD_NAV.filter((item) => item.group === group).map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-3 rounded-md px-3 py-2 text-body-sm',
                      'transition-colors duration-[--duration-instant]',
                      active
                        ? 'bg-bg-subtle text-fg font-medium'
                        : 'text-fg-muted hover:bg-bg-subtle hover:text-fg',
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="bg-fg absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full"
                      />
                    )}
                    <item.icon aria-hidden className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/**
 * Mobile bottom tab bar — a dedicated pattern, not a collapsed sidebar.
 * Sits above the home-indicator safe area so the last tab is reachable.
 */
export function DashboardTabBar() {
  const isActive = useIsActive()

  return (
    <nav
      aria-label="Dashboard"
      className="border-border bg-bg/90 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl lg:hidden"
    >
      <ul className="flex pb-[env(safe-area-inset-bottom)]">
        {MOBILE_TABS.map((item) => {
          const active = isActive(item.href)
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-14 flex-col items-center justify-center gap-1 px-1',
                  'transition-colors duration-[--duration-instant]',
                  active ? 'text-fg' : 'text-fg-subtle',
                )}
              >
                <item.icon aria-hidden className="size-[18px]" />
                <span className="font-mono text-[0.625rem] leading-none tracking-tight">
                  {item.label === 'My internship' ? 'Program' : item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
