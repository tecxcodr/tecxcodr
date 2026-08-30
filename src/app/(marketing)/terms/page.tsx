import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/marketing/page-hero'
import { Section } from '@/components/ui/section'
import { DraftNotice, Prose } from '@/components/ui/prose'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'What Tecxcodr provides, what it does not, and the terms under which programs are offered.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="legal"
        title="Terms of Service"
        lede="What we provide, what we explicitly do not, and the rules that apply to both of us."
      />

      <Section>
        <Prose>
          <DraftNotice />

          <h2>1. What Tecxcodr is</h2>
          <p>
            Tecxcodr provides structured, self-paced <strong>training and project experience
            programs</strong> in software development. Each program consists of written task
            briefs, a submission mechanism, human review of submitted work, and — where completion
            criteria are met — a certificate recording that work.
          </p>

          <h2>2. What Tecxcodr is not</h2>
          <p>This is the most important section on this page. Tecxcodr does not provide:</p>
          <ul>
            <li><strong>Employment.</strong> No employment relationship of any kind is created.</li>
            <li><strong>A stipend, salary or any payment to you.</strong></li>
            <li><strong>Placement, referrals or job assistance</strong> of any kind.</li>
            <li><strong>Any guarantee</strong> regarding employment, interviews or career outcomes.</li>
            <li><strong>An academic qualification.</strong> Certificates are not degrees or accredited credentials.</li>
          </ul>
          <p>
            The word &ldquo;internship&rdquo; is used to describe the structure of the experience —
            briefs, deadlines, review — and not an employment arrangement.
          </p>

          <h2>3. Eligibility and accounts</h2>
          <ul>
            <li>You must be at least 16 years old to create an account.</li>
            <li>You must provide accurate information; applications are assessed on what you submit.</li>
            <li>You are responsible for keeping your account credentials secure.</li>
            <li>One account per person. Duplicate accounts may be suspended.</li>
          </ul>

          <h2>4. Applications and enrolment</h2>
          <p>
            Applying is free and creates no obligation on either side. Acceptance is at our
            discretion and is not guaranteed. An accepted application must be paid for within
            <strong> fourteen (14) days</strong>, after which it expires and you may re-apply.
          </p>

          <h2>5. Fees</h2>
          <p>
            Enrolment fees are shown on each program page before you apply, and are charged once
            per enrolment. The amount payable is fixed at the moment your payment order is created
            and is not affected by later price changes. Refunds are governed by the{' '}
            <Link href="/refund-policy">Refund Policy</Link>.
          </p>

          <h2>6. Your work and your rights to it</h2>
          <p>
            <strong>You own everything you build.</strong> Submissions are made as links to
            repositories in your own account. We claim no ownership, licence or commercial right
            over your code. We access it only to review it.
          </p>

          <h2>7. Review and certification</h2>
          <ul>
            <li>Submissions are reviewed by a person against the requirements published in the task brief.</li>
            <li>Approval is not automatic and is not guaranteed by payment.</li>
            <li>Target turnaround is three working days; this is a target, not a contractual term.</li>
            <li>A certificate is issued when the stated number of required tasks has been approved.</li>
          </ul>

          <h2>8. Academic honesty</h2>
          <p>
            Work you submit must be your own. Submitting code copied from another person, another
            student, or a repository you did not write is grounds for rejection, revocation of any
            certificate already issued, and termination of your account without refund. Revoked
            certificates remain publicly listed as revoked.
          </p>

          <h2>9. Program duration</h2>
          <p>
            Enrolments run for the duration stated on the program page, starting at enrolment.
            Submissions are accepted at any time within that window. After it ends, the enrolment
            expires and no certificate is issued.
          </p>

          <h2>10. Acceptable use</h2>
          <ul>
            <li>Do not attempt to access other users&rsquo; data, applications or submissions.</li>
            <li>Do not attempt to disrupt, probe or overload the service.</li>
            <li>Do not resell, share or transfer access to a program.</li>
            <li>Do not misrepresent a Tecxcodr certificate as a degree, qualification or employment record.</li>
          </ul>

          <h2>11. Suspension and termination</h2>
          <p>
            We may suspend or terminate an account for breach of these terms. Where termination
            follows academic dishonesty or abuse, no refund is due. You may close your account at
            any time; certificates already issued remain verifiable, as described in the{' '}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>12. Limitation of liability</h2>
          <p>
            To the extent permitted by law, our total liability arising from your use of Tecxcodr
            is limited to the amount you paid us for the enrolment in question. We are not liable
            for indirect or consequential loss, including any loss of opportunity.
          </p>

          <h2>13. Changes</h2>
          <p>
            We may update these terms. Material changes will be notified by email to registered
            users. Changes do not apply retroactively to an enrolment already paid for.
          </p>

          <h2>14. Governing law</h2>
          <p>These terms are governed by the laws of India.</p>

          <h2>15. Contact</h2>
          <p>
            Questions about these terms: <Link href="/contact">contact us</Link>.
          </p>
        </Prose>
      </Section>
    </>
  )
}
