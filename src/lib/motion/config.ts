/**
 * Shared motion constants. Kept in one place so durations and easings match
 * the CSS tokens in styles/tokens.css — docs/03-DESIGN-SYSTEM.md §6.2.
 */

export const EASE = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  in: 'expo.in',
  spring: 'back.out(1.4)',
} as const

export const DURATION = {
  instant: 0.1,
  fast: 0.18,
  base: 0.28,
  slow: 0.45,
  slower: 0.7,
} as const

/** Stagger caps at 6 siblings — beyond that the last item arrives too late. */
export const STAGGER = { step: 0.06, max: 6 } as const

export const MOBILE_BREAKPOINT = 768

/** True when the browser is going to run our animations at all. */
export function motionEnabled(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('js-motion')
}
