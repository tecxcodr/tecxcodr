import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link'
type Size = 'sm' | 'md' | 'lg'

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-fg hover:brightness-90 active:brightness-80 border border-transparent',
  secondary: 'bg-transparent text-fg border border-border-strong hover:bg-bg-subtle',
  ghost: 'bg-transparent text-fg-muted border border-transparent hover:bg-bg-subtle hover:text-fg',
  destructive: 'bg-destructive text-white border border-transparent hover:brightness-110',
  link: 'bg-transparent text-fg underline underline-offset-4 hover:text-fg-muted p-0 h-auto',
}

const SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-body-sm gap-1.5',
  md: 'h-10 px-4 text-body-sm gap-2',
  lg: 'h-12 px-6 text-body gap-2',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  /** Render as the child element (e.g. a Next.js <Link>) instead of <button>. */
  asChild?: boolean
}

/**
 * The seven states in docs/03-DESIGN-SYSTEM.md §5.1 are all covered here:
 * default, hover, active, focus-visible (global ring), disabled, loading, and
 * error (via the `destructive` variant).
 *
 * Loading freezes the label's width so the button cannot resize mid-request.
 */
export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  asChild = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        'relative inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap',
        'transition-[background-color,color,border-color,filter,transform] duration-[--duration-fast] ease-[--ease-out-expo]',
        'hover:-translate-y-px active:translate-y-0',
        'disabled:pointer-events-none disabled:opacity-45',
        // Touch targets stay >=44px on coarse pointers without inflating the
        // visual box — docs/03 §5.2.
        'after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[""] md:after:hidden',
        VARIANT[variant],
        variant !== 'link' && SIZE[size],
        loading && 'pointer-events-none',
        className,
      )}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          {/* Keeps the intrinsic width while the spinner is shown. */}
          <span className="invisible inline-flex items-center gap-2">{children}</span>
          <Loader2 aria-hidden className="absolute size-4 animate-spin" />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}
