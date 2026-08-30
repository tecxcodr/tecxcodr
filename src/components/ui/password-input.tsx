'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

/**
 * Password field with a show/hide toggle.
 *
 * The toggle is a real <button> with an accessible name that reflects the
 * *action*, and `aria-pressed` reflecting state — an icon-only control here
 * would be unusable with a screen reader.
 */
export function PasswordInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('pr-11', className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="text-fg-subtle hover:text-fg absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-md transition-colors"
      >
        {visible ? (
          <EyeOff aria-hidden className="size-4" />
        ) : (
          <Eye aria-hidden className="size-4" />
        )}
      </button>
    </div>
  )
}
