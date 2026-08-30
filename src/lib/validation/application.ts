import { z } from 'zod'

/**
 * Application step schemas — docs/01 §7.3, docs/06 §4.2.
 *
 * One schema per step so a draft can be saved and validated incrementally,
 * and the same objects are reused by the eventual `saveApplicationStep` and
 * `submitApplication` server actions.
 */

const CURRENT_YEAR = new Date().getFullYear()

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Enter your email address.')
  .email('That does not look like a valid email address.')
  .max(255)

/** Indian mobile: 10 digits starting 6–9, tolerant of spaces and +91. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))
  .pipe(
    z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number.'),
  )

/** Optional URL fields: empty string is valid and means "not provided". */
const optionalUrl = (message: string) =>
  z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === '' || /^https?:\/\/.+\..+/.test(v), message)

export const githubUrlSchema = z
  .string()
  .trim()
  .max(300)
  .refine(
    (v) => v === '' || /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/?$/i.test(v),
    'Use your GitHub profile URL, e.g. https://github.com/yourname',
  )

export const step1Schema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.').max(160),
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Use at least 8 characters.')
    .max(200, 'That password is too long.'),
  phone: phoneSchema,
  city: z.string().trim().min(2, 'Enter your city.').max(100),
  state: z.string().trim().min(2, 'Enter your state.').max(100),
  college: z.string().trim().min(3, 'Enter your college or university.').max(200),
  degree: z.string().trim().min(1, 'Select your degree.').max(100),
  branch: z.string().trim().min(2, 'Enter your branch or major.').max(100),
  currentYear: z.coerce
    .number()
    .int()
    .min(1, 'Select your current year.')
    .max(5, 'Select your current year.'),
  graduationYear: z.coerce
    .number()
    .int()
    .min(CURRENT_YEAR - 8, `Graduation year looks too far in the past.`)
    .max(CURRENT_YEAR + 8, `Graduation year looks too far in the future.`),
})

export const step2Schema = z.object({
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {
    errorMap: () => ({ message: 'Pick the option that describes you best.' }),
  }),
  primarySkills: z
    .array(z.string().trim().min(1).max(40))
    .min(1, 'Select at least one skill.')
    .max(12, 'Pick up to 12 — choose the ones you would be happy to be tested on.'),
  githubUrl: githubUrlSchema,
  linkedinUrl: optionalUrl('Enter a full URL starting with https://'),
  portfolioUrl: optionalUrl('Enter a full URL starting with https://'),
})

export const step3Schema = z.object({
  motivation: z
    .string()
    .trim()
    .min(50, 'Give us at least a couple of sentences — 50 characters minimum.')
    .max(1500, 'Keep it under 1500 characters.'),
  referralSource: z.string().trim().max(60).optional().default(''),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You need to confirm this to submit.' }),
  }),
})

export const applicationSchema = step1Schema.merge(step2Schema).merge(step3Schema)

export type Step1Input = z.infer<typeof step1Schema>
export type Step2Input = z.infer<typeof step2Schema>
export type Step3Input = z.infer<typeof step3Schema>
export type ApplicationInput = z.infer<typeof applicationSchema>

/** Loose shape held in component state while the form is still incomplete. */
export type ApplicationDraft = Partial<{
  [K in keyof ApplicationInput]: ApplicationInput[K]
}>

export type FieldErrors = Partial<Record<keyof ApplicationInput, string>>

/** First error per field — a stack of messages on one input is noise. */
export function collectErrors(issues: z.ZodIssue[]): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !(key in errors)) {
      errors[key as keyof ApplicationInput] = issue.message
    }
  }
  return errors
}

export const DEGREE_OPTIONS = [
  { value: 'B.Tech', label: 'B.Tech / B.E.' },
  { value: 'B.Sc', label: 'B.Sc' },
  { value: 'BCA', label: 'BCA' },
  { value: 'M.Tech', label: 'M.Tech / M.E.' },
  { value: 'MCA', label: 'MCA' },
  { value: 'M.Sc', label: 'M.Sc' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Other', label: 'Other' },
] as const

export const YEAR_OPTIONS = [
  { value: '1', label: '1st year' },
  { value: '2', label: '2nd year' },
  { value: '3', label: '3rd year' },
  { value: '4', label: '4th year' },
  { value: '5', label: '5th year' },
] as const

export const GRADUATION_YEAR_OPTIONS = Array.from({ length: 9 }, (_, i) => {
  const year = CURRENT_YEAR - 2 + i
  return { value: String(year), label: String(year) }
})

export const EXPERIENCE_OPTIONS = [
  {
    value: 'BEGINNER',
    label: 'Beginner',
    hint: 'I can write basic programs and follow tutorials.',
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermediate',
    hint: 'I have built projects on my own without step-by-step guidance.',
  },
  {
    value: 'ADVANCED',
    label: 'Advanced',
    hint: 'I am comfortable reading unfamiliar codebases and debugging alone.',
  },
] as const

export const REFERRAL_OPTIONS = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Friend', label: 'A friend or classmate' },
  { value: 'Search', label: 'Google search' },
  { value: 'College', label: 'College or placement cell' },
  { value: 'Other', label: 'Somewhere else' },
] as const

/** Offered as chips on step 2, seeded from the program's own stack. */
export const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'HTML',
  'CSS',
  'React',
  'Node.js',
  'SQL',
  'Git',
  'Data Structures',
  'Kotlin',
  'Android',
  'pandas',
  'NumPy',
  'Linux',
] as const
