import { SiteHeader } from '@/components/marketing/site-header'
import { SiteFooter } from '@/components/marketing/site-footer'
import { MotionRoot } from '@/components/motion/motion-root'

/**
 * Marketing route group. This is the ONLY layout that mounts MotionRoot —
 * dashboards get their own group and ship no animation JS at all
 * (docs/02-TRD.md §3.1, docs/03 §6.1 rule 7).
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MotionRoot />
      <SiteHeader />
      <main id="main" className="flex min-h-dvh flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
