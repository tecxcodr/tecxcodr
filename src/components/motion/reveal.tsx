'use client'

import { useEffect, useRef } from 'react'
import { DURATION, EASE, MOBILE_BREAKPOINT, STAGGER, motionEnabled } from '@/lib/motion/config'
import { loadGsap } from '@/lib/motion/gsap'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Animate direct children in sequence rather than the wrapper as a whole. */
  stagger?: boolean
  /** Seconds to hold before starting. Use sparingly. */
  delay?: number
  as?: 'div' | 'section' | 'ul' | 'ol' | 'header' | 'footer'
}

/**
 * Scroll-triggered entrance. A client island wrapping *server-rendered*
 * children — the content stays in the HTML, so SEO, no-JS and reduced-motion
 * users all get the full page (docs/03 §6.1, §6.3).
 *
 * Only `transform` and `opacity` animate, and nothing leaves flow, so this
 * cannot contribute to CLS.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !motionEnabled()) return

    let cancelled = false
    // Structurally typed rather than `gsap.Context`, so this file has no
    // type-level dependency on a module it only loads at runtime.
    let ctx: { revert: () => void } | undefined

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !ref.current) return

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        mm.add(
          {
            desktop: `(min-width: ${MOBILE_BREAKPOINT}px)`,
            mobile: `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
          },
          (context) => {
            const isDesktop = Boolean(context.conditions?.desktop)
            const items = stagger ? Array.from(el.children) : [el]
            if (items.length === 0) return

            // The wrapper is CSS-hidden until motion takes over. When we are
            // staggering children, reveal the wrapper immediately or the
            // children animate inside an invisible box.
            if (stagger) gsap.set(el, { opacity: 1 })

            gsap.set(items, { opacity: 0, y: isDesktop ? 24 : 0 })

            gsap.to(items, {
              opacity: 1,
              y: 0,
              duration: isDesktop ? DURATION.slow : DURATION.base,
              ease: EASE.out,
              delay,
              // `amount` spreads the whole sequence over a capped window, so a
              // 12-item grid does not leave the last card arriving a second late.
              stagger: stagger
                ? { amount: Math.min(items.length, STAGGER.max) * STAGGER.step }
                : 0,
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            })
          },
        )
      }, ref)

      ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [stagger, delay])

  const Comp = Tag as React.ElementType

  return (
    <Comp ref={ref} data-reveal className={className}>
      {children}
    </Comp>
  )
}
