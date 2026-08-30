'use client'

import { useEffect, useRef } from 'react'
import { EASE, motionEnabled } from '@/lib/motion/config'
import { loadGsap } from '@/lib/motion/gsap'

/**
 * Subtle magnetic pull toward the cursor. Capped at 8px — enough to feel
 * responsive, not enough to make the hit area lie about where the button is.
 *
 * Pointer-fine only. On touch there is no cursor to be magnetic toward, and
 * running this there would cost JS for nothing. docs/03 §6.3.
 */
export function Magnetic({
  children,
  strength = 8,
  className,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !motionEnabled()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let cancelled = false
    let teardown: (() => void) | undefined

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return

      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: EASE.spring })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: EASE.spring })

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const relX = e.clientX - (rect.left + rect.width / 2)
        const relY = e.clientY - (rect.top + rect.height / 2)
        // Proportional to half-size, then clamped, so a wide button does not
        // travel further than a narrow one.
        xTo(gsap.utils.clamp(-strength, strength, (relX / (rect.width / 2)) * strength))
        yTo(gsap.utils.clamp(-strength, strength, (relY / (rect.height / 2)) * strength))
      }

      const onLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)

      teardown = () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
        gsap.killTweensOf(el)
        gsap.set(el, { x: 0, y: 0 })
      }
    })

    return () => {
      cancelled = true
      teardown?.()
    }
  }, [strength])

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block' }}>
      {children}
    </span>
  )
}
