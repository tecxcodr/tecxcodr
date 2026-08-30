'use client'

import { useEffect, useRef } from 'react'
import { EASE, motionEnabled } from '@/lib/motion/config'
import { loadGsap } from '@/lib/motion/gsap'
import { pad2 } from '@/lib/utils/format'

/**
 * Counts to `value` once, on scroll into view.
 *
 * The final value is server-rendered into the element, so it is present for
 * SEO, no-JS and reduced-motion. The animation only overwrites what is already
 * correct — it never supplies the content. docs/03 §6.3.
 */
export function CountUp({
  value,
  padded = true,
  className,
}: {
  value: number
  padded?: boolean
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !motionEnabled()) return

    let cancelled = false
    let ctx: { revert: () => void } | undefined

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !ref.current) return

      const state = { n: 0 }
      ctx = gsap.context(() => {
        gsap.to(state, {
          n: value,
          duration: 1.1,
          ease: EASE.out,
          onUpdate: () => {
            const n = Math.round(state.n)
            el.textContent = padded ? pad2(n) : String(n)
          },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      }, ref)

      ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      ctx?.revert()
      // revert() restores the pre-tween DOM, but the text was mutated by hand
      // in onUpdate, so restore the true value explicitly.
      el.textContent = padded ? pad2(value) : String(value)
    }
  }, [value, padded])

  return (
    <span ref={ref} data-numeric className={className}>
      {padded ? pad2(value) : value}
    </span>
  )
}
