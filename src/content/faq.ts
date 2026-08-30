/**
 * FAQ lives in the repo, not the database — docs/00 S2. Version-controlled,
 * reviewable, zero infra, one fewer admin screen.
 *
 * Ordering is deliberate: price, legitimacy and the job question come first,
 * because those are the objections that actually stop a purchase.
 */
export interface Faq {
  id: string
  question: string
  answer: string
  /** Shown on the homepage preview as well as /faq. */
  featured: boolean
}

export const FAQS: Faq[] = [
  {
    id: 'cost',
    question: 'What does it cost, and when do I pay?',
    answer:
      'Applying is free. If your application is accepted, enrolment costs ₹799 for any program — one payment, no subscription, no hidden fees. You only pay after you have been accepted and after you have already read every task brief.',
    featured: true,
  },
  {
    id: 'job',
    question: 'Will this get me a job?',
    answer:
      'No, and you should be sceptical of anyone who says otherwise. This is a training program. What it gives you is three projects you built to a written spec, code review from a human, and a certificate a recruiter can verify. What you do with that is up to you and the market.',
    featured: true,
  },
  {
    id: 'legitimacy',
    question: 'How is this different from the free certificate sites?',
    answer:
      'Three ways. Every task brief is published in full before you pay, so you can judge the work in advance. A human actually reads your submitted code and writes feedback — approval is not automatic. And every certificate has a public verification page, so the certificate is checkable rather than just claimable.',
    featured: true,
  },
  {
    id: 'stipend',
    question: 'Is this a job? Do I get a stipend?',
    answer:
      'No. This is a paid training and experience program, not employment. There is no stipend, no salary, no employment relationship and no placement guarantee. We are explicit about this because the alternative is misleading you.',
    featured: true,
  },
  {
    id: 'time',
    question: 'How much time does it take?',
    answer:
      'Each program is four weeks and self-paced — the clock starts when you enrol, not on a fixed cohort date. The three tasks total roughly 30 to 45 hours depending on the program and your experience. You need two of the three approved to earn the certificate.',
    featured: true,
  },
  {
    id: 'review',
    question: 'How long does review take?',
    answer:
      'Three working days from submission. If your work needs changes you get specific written feedback and can resubmit — there is no limit on honest attempts, and a resubmission is not penalised.',
    featured: true,
  },
  {
    id: 'submit',
    question: 'How do I submit my work?',
    answer:
      'A public GitHub repository link, plus an optional live demo URL and any notes for the reviewer. There is no file upload and no ZIP archive. Your work stays in your own account, permanently, under your name.',
    featured: false,
  },
  {
    id: 'refund',
    question: 'Can I get a refund?',
    answer:
      'Yes, within seven days of payment, as long as you have not submitted any task. Once you submit work for review, or after seven days, the payment is final. The full policy is on the refund policy page.',
    featured: false,
  },
  {
    id: 'beginner',
    question: 'I am a complete beginner. Can I join?',
    answer:
      'Honestly, not yet. The tasks assume you can already write basic code in the language of your program. If you have never written a program before, learn the fundamentals first — you would spend your four weeks fighting syntax instead of building something worth showing.',
    featured: false,
  },
  {
    id: 'multiple',
    question: 'Can I do more than one program?',
    answer:
      'Yes, but only one at a time per program. You can apply to a different program while enrolled in one, though we would suggest finishing what you started first — two half-finished programs prove less than one completed one.',
    featured: false,
  },
  {
    id: 'deadline',
    question: 'What if I do not finish in four weeks?',
    answer:
      'Your enrolment expires and no certificate is issued. Deadlines are soft during the four weeks — submit whenever you like — but the end date is real. If something serious came up, contact us before the deadline rather than after.',
    featured: false,
  },
  {
    id: 'certificate-check',
    question: 'How does certificate verification work?',
    answer:
      'Every certificate carries a unique code. Anyone can visit tecxcodr.com/verify and enter it — no account needed — and see the holder name, program, issue date, status and which tasks were completed. If a certificate is ever revoked, the page says so rather than disappearing.',
    featured: false,
  },
]

export const FEATURED_FAQS = FAQS.filter((f) => f.featured)
