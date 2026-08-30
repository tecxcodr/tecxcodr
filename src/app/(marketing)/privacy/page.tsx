import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/marketing/page-hero'
import { Section } from '@/components/ui/section'
import { DraftNotice, Prose } from '@/components/ui/prose'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'What data Tecxcodr collects, why, how long it is kept, and what appears publicly on a certificate verification page.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="legal"
        title="Privacy Policy"
        lede="What we collect, why we collect it, and the one thing that is deliberately public."
      />

      <Section>
        <Prose>
          <DraftNotice />

          <h2>1. What we collect</h2>
          <h3>Account</h3>
          <ul>
            <li>Name and email address.</li>
            <li>A password hash, or an identifier from Google or GitHub if you sign in that way.</li>
            <li>Email verification status.</li>
          </ul>

          <h3>Application</h3>
          <ul>
            <li>Phone number, city and state.</li>
            <li>College, degree, branch, current year and graduation year.</li>
            <li>Skills, experience level, and links you choose to share (GitHub, LinkedIn, portfolio).</li>
            <li>Your written answers to program questions.</li>
          </ul>

          <h3>Payments</h3>
          <p>
            Payments are processed by our payment gateway. <strong>We never see or store your card
            number, UPI PIN, CVV or bank credentials.</strong> We store the transaction reference,
            amount, status and method type only.
          </p>

          <h3>Submissions</h3>
          <p>
            We store the URLs you submit and any notes you write. We do not store copies of your
            code — it stays in your own repository under your control.
          </p>

          <h3>Technical</h3>
          <p>
            Standard server logs, and a <strong>hashed</strong> form of your IP address for abuse
            prevention on public forms. We do not store raw IP addresses against form submissions.
          </p>

          <h2>2. Why we collect it</h2>
          <ul>
            <li>To assess your application and operate your enrolment.</li>
            <li>To process payment and issue receipts.</li>
            <li>To review your work and send you feedback.</li>
            <li>To issue and verify certificates.</li>
            <li>To send transactional email about your application, payment and submissions.</li>
            <li>To prevent abuse of public forms.</li>
          </ul>
          <p>
            We do not sell your data, and we do not share it with recruiters, employers or
            advertisers.
          </p>

          <h2>3. What is public</h2>
          <p>
            This is the section worth reading carefully. If you earn a certificate, a{' '}
            <Link href="/verify">public verification page</Link> is created showing:
          </p>
          <ul>
            <li>Your name.</li>
            <li>The program title.</li>
            <li>The issue date and current status.</li>
            <li>The titles of the tasks you completed.</li>
          </ul>
          <p>
            It never shows your email, phone number, college, application answers or any payment
            information. Public verification is the point of the certificate — a certificate nobody
            can check is worth nothing — so this page cannot be made private while the certificate
            remains valid.
          </p>

          <h2>4. Retention</h2>
          <ul>
            <li>Account and application data: while your account is open, plus a reasonable period afterwards.</li>
            <li>Payment records: as required by financial and tax obligations.</li>
            <li>Certificates: retained indefinitely so verification keeps working.</li>
            <li>Server logs: a short rolling window.</li>
          </ul>

          <h2>5. Deleting your account</h2>
          <p>
            You can request deletion at any time. Your profile and application data are removed from
            active use. <strong>Certificates already issued remain verifiable</strong>, because
            deleting them would invalidate a claim someone may have made on a résumé in good faith,
            and would let anyone erase an adverse record. Payment records are retained where the law
            requires.
          </p>

          <h2>6. Your rights</h2>
          <p>
            You can request a copy of your data, correct inaccuracies, or ask for deletion subject
            to the limits above. <Link href="/contact">Contact us</Link> and we will respond within
            a reasonable period.
          </p>

          <h2>7. Third parties</h2>
          <p>
            We use service providers for hosting, database, email delivery, media storage, payments
            and error monitoring. Each receives only what it needs to perform its function.
          </p>

          <h2>8. Cookies</h2>
          <p>
            We use a session cookie to keep you signed in and a preference cookie to remember your
            theme. We do not use advertising or cross-site tracking cookies.
          </p>

          <h2>9. Children</h2>
          <p>Tecxcodr is not intended for anyone under 16.</p>

          <h2>10. Changes and contact</h2>
          <p>
            Material changes will be notified by email to registered users. Questions:{' '}
            <Link href="/contact">contact us</Link>.
          </p>
        </Prose>
      </Section>
    </>
  )
}
