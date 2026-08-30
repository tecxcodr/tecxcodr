'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const OPTIONS = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
] as const

/**
 * Three-state segmented control, not a sun/moon swap.
 *
 * A two-state toggle hides which mode is actually active and gives the user no
 * way back to "follow my OS" — docs/03-DESIGN-SYSTEM.md §2.6.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Theme is unknowable on the server, so the active state is only rendered
  // after mount. The control keeps its exact size either way, so nothing shifts.
  useEffect(() => setMounted(true), [])

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        'border-border bg-bg-subtle inline-flex items-center gap-0.5 rounded-md border p-0.5',
        className,
      )}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = mounted && theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={cn(
              'inline-flex size-7 items-center justify-center rounded-sm',
              'transition-colors duration-[--duration-instant]',
              active ? 'bg-surface-raised text-fg' : 'text-fg-subtle hover:text-fg-muted',
            )}
          >
            <Icon aria-hidden className="size-3.5" />
          </button>
        )
      })}
    </div>
  )
}
