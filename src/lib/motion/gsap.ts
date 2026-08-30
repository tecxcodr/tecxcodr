/**
 * Lazy GSAP loader.
 *
 * docs/02-TRD.md §10.2: "GSAP dynamically imported inside client islands,
 * never in the root layout." A static `import { gsap }` at module scope pulls
 * ~30 kB gzipped into the initial bundle of every route that renders a motion
 * island — which blows the marketing JS budget before a single animation runs.
 *
 * The promise is cached, so N islands on a page trigger one network fetch and
 * one plugin registration.
 */

import type * as GsapModule from 'gsap'
import type * as ScrollTriggerModule from 'gsap/ScrollTrigger'

type GsapBundle = {
  gsap: typeof GsapModule.gsap
  ScrollTrigger: typeof ScrollTriggerModule.ScrollTrigger
}

let cached: Promise<GsapBundle> | null = null

export function loadGsap(): Promise<GsapBundle> {
  cached ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([core, scrollTrigger]) => {
      core.gsap.registerPlugin(scrollTrigger.ScrollTrigger)
      return { gsap: core.gsap, ScrollTrigger: scrollTrigger.ScrollTrigger }
    },
  )
  return cached
}
