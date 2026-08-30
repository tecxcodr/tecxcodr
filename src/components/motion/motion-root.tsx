'use client'

import { useEffect } from 'react'
import type Lenis from 'lenis'
import { MOBILE_BREAKPOINT, motionEnabled } from '@/lib/motion/config'
import { loadGsap } from '@/lib/motion/gsap'

/**
 * Mounted once per marketing route group. Owns three things:
 *
 *  1. Loading GSAP (lazily — see lib/motion/gsap.ts)
 *  2. Lenis smooth scroll — desktop, pointer-fine, motion-enabled only
 *  3. The `data-motion-ready` flag that disarms the failsafe in app/layout.tsx
 *
 * The flag is only set once GSAP has actually resolved. If the chunk fails to
 * load, the failsafe fires, `js-motion` is dropped, and every reveal target
 * becomes visible — a broken animation must never mean hidden content.
 *
 * Dashboards never mount this, so they ship zero animation JS.
 */
export function MotionRoot() {
  useEffect(() => {
    if (!motionEnabled()) {
      document.documentElement.setAttribute('data-motion-ready', '')
      return
    }

    let cancelled = false
    let lenis: Lenis | undefined
    let cleanupTicker: (() => void) | undefined

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return
      document.documentElement.setAttribute('data-motion-ready', '')

      // Native momentum beats a JS library on touch, and smooth-scroll
      // hijacking on mobile is a known usability regression.
      const isDesktopPointer =
        window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`).matches &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches

      if (!isDesktopPointer) return

      void import('lenis').then(({ default: LenisCtor }) => {
        if (cancelled) return

        lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.5 })

        // Drive Lenis from GSAP's ticker so scroll and tweens share one RAF.
        // Two independent loops is the usual cause of scroll-linked jitter.
        const tick = (time: number) => lenis?.raf(time * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        lenis.on('scroll', ScrollTrigger.update)

        cleanupTicker = () => {
          gsap.ticker.remove(tick)
          gsap.ticker.lagSmoothing(500, 33)
        }
      })
    })

    return () => {
      cancelled = true
      cleanupTicker?.()
      lenis?.destroy()
    }
  }, [])

  return null
}
