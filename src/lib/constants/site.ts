/**
 * Single source of truth for brand strings, navigation and public copy that
 * appears in more than one place. Nothing here is user-generated.
 */

export const SITE = {
  name: 'Tecxcodr',
  /** Lowercase form — monospace/technical contexts only. docs/00 B1. */
  wordmark: 'tecxcodr',
  tagline: 'Virtual internships for people who build things.',
  description:
    'Build three real projects, get reviewed by a human, and earn a certificate a recruiter can independently verify. Free to apply.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://tecxcodr.com',
  email: 'hello@tecxcodr.com',
  locale: 'en_IN',
} as const

/**
 * Positioning guardrail — docs/00 B5. No page, email or ad may promise
 * employment, stipend, placement or a job guarantee. These are the exact
 * phrases we DO use instead.
 */
export const TRUST_LINE = [
  'free to apply',
  'human code review',
  'verifiable certificates',
] as const

export const MAIN_NAV = [
  { label: 'Programs', href: '/programs' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
] as const

export const FOOTER_NAV = [
  {
    heading: 'Programs',
    links: [
      { label: 'All programs', href: '/programs' },
      { label: 'Web Development', href: '/programs/web-development' },
      { label: 'Python', href: '/programs/python-programming' },
      { label: 'Data Science', href: '/programs/data-science' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Verify',
    links: [
      { label: 'Verify a certificate', href: '/verify' },
      { label: 'For recruiters', href: '/verify' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Refund policy', href: '/refund-policy' },
    ],
  },
] as const

/** Process steps, shared by the homepage and /how-it-works. */
export const PROCESS_STEPS = [
  {
    id: '01',
    title: 'Pick a program',
    body: 'Every task brief is public before you pay. Read the whole syllabus, then decide.',
    command: 'tecxcodr browse --programs',
  },
  {
    id: '02',
    title: 'Apply — free',
    body: 'A three-step application. Academics, your technical profile, and why this program. No fee to apply.',
    command: 'tecxcodr apply --program web-development',
  },
  {
    id: '03',
    title: 'Get a decision',
    body: 'We read every application. You get an accept or a reject with your status visible in the dashboard the whole time.',
    command: 'tecxcodr status --watch',
  },
  {
    id: '04',
    title: 'Enrol and build',
    body: 'Pay once, get your offer letter, and start. Three tasks over four weeks, self-paced. Submit each as a GitHub repo.',
    command: 'git push origin main',
  },
  {
    id: '05',
    title: 'Get reviewed, get certified',
    body: 'A human reads your code and writes real feedback within three working days. Complete two of three tasks to earn a verifiable certificate.',
    command: 'tecxcodr verify TCX-2609-7QK4M2XR',
  },
] as const

/** Honest self-qualification — docs/03 §8 section [05]. */
export const FIT = {
  yes: [
    'You can already write code, but you have nothing shipped to show for it.',
    'You want a spec and a deadline instead of another tutorial.',
    'You want someone to actually read your code and tell you what is wrong with it.',
    'You want a certificate a recruiter can check, not a JPEG.',
  ],
  no: [
    'You want a job guarantee. We do not offer one, and nobody honest does.',
    'You want a certificate without doing the work. There is no shortcut here.',
    'You have never written code before. Start with the fundamentals first.',
    'You need a stipend. This is a paid training program, not employment.',
  ],
} as const
