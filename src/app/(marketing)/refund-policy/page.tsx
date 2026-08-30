import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/marketing/page-hero'
import { Section } from '@/components/ui/section'
import { DraftNotice, Prose } from '@/components/ui/prose'

export const metadata: Metadata = {
  title: 'Refund policy',
  description:
    'Full refund within seven days of payment if you have not submitted any task. The complete policy, stated plainly.',
  alternates: { canonical: '/refund-policy' },
}

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="legal"
        title="Refund policy"
        lede="Short version: seven days, no submissions, full refund."
      />

      <Section>
        <Prose>
          <DraftNotice />

          <h2>When you can get a full refund</h2>
          <p>
            You are entitled to a <strong>full refund</strong> of your enrolment fee if both of the
            following are true:
          </p>
          <ul>
            <li>You request it within <strong>seven (7) days</strong> of your payment date.</li>
            <li>You have not submitted any task for review.</li>
          </ul>
          <p>
            Refunds are returned to the original payment method. Processing typically takes five to
            seven working days after approval, depending on your bank.
          </p>

          <h2>When a refund is not available</h2>
          <ul>
            <li>More than seven days have passed since payment.</li>
            <li>You have submitted at least one task for review, at any point.</li>
            <li>Your enrolment expired at the end of the four-week period without completion.</li>
            <li>Your submission was reviewed and not approved.</li>
          </ul>
          <p>
            The second condition matters most: once a task is submitted, a person has been asked to
            spend time reading it. That work is the product, and it cannot be returned.
          </p>

          <h2>Not grounds for a refund</h2>
          <p>
            To be explicit, because these are the requests we expect to receive and it is fairer to
            say so in advance than to argue later:
          </p>
          <ul>
            <li>Not receiving a job, interview or referral. We never offer these.</li>
            <li>A certificate not being recognised by a specific employer or institution.</li>
            <li>Not having time to complete the tasks within the four-week window.</li>
            <li>Disagreeing with a reviewer&rsquo;s decision on work that did not meet the stated requirements.</li>
          </ul>

          <h2>Cancellation</h2>
          <p>
            You can withdraw an application at any time before payment at no cost — applying is
            free and creates no obligation. After enrolment, withdrawal follows the refund rules
            above.
          </p>

          <h2>If we cancel</h2>
          <p>
            If Tecxcodr withdraws a program you are actively enrolled in, or cannot deliver reviews
            within a reasonable time, you receive a full refund regardless of elapsed time or
            submissions made.
          </p>

          <h2>How to request a refund</h2>
          <p>
            Email us from the address on your account with your certificate or application
            reference. We will confirm receipt and tell you the outcome within two working days.
            Do not initiate a chargeback before contacting us — it is slower for you and it makes
            the resolution harder for both of us.
          </p>

          <p>
            <Link href="/contact">Contact us</Link> · See also the{' '}
            <Link href="/terms">Terms of Service</Link>.
          </p>
        </Prose>
      </Section>
    </>
  )
}
