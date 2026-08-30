import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge has to be taught our theme, or it silently deletes classes.
 *
 * Out of the box it cannot tell a custom colour from a custom font size, so
 * `text-accent-fg` and `text-body` land in the same conflict group and the
 * later one wins. That produced white-on-white button labels and mono labels
 * rendering at the default 16px instead of 12px.
 *
 * These lists must stay in sync with the @theme block in styles/tokens.css.
 */

const COLORS = [
  'bg',
  'bg-subtle',
  'surface',
  'surface-raised',
  'surface-code',
  'fg',
  'fg-muted',
  'fg-subtle',
  'border',
  'border-strong',
  'accent',
  'accent-fg',
  'ring',
  'overlay',
  'success',
  'success-subtle',
  'warning',
  'warning-subtle',
  'destructive',
  'destructive-subtle',
  'info',
  'info-subtle',
]

const FONT_SIZES = [
  'display-1',
  'display-2',
  'h1',
  'h2',
  'h3',
  'h4',
  'body-lg',
  'body',
  'body-sm',
  'caption',
  'mono-label',
  'mono-sm',
  'mono-code',
  'mono-metric',
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: FONT_SIZES }],
      'text-color': [{ text: COLORS }],
      'bg-color': [{ bg: COLORS }],
      'border-color': [{ border: COLORS }],
      'font-family': [{ font: ['display', 'sans', 'mono'] }],
    },
  },
})

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
