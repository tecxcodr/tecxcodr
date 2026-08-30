import { z } from 'zod'

/**
 * One schema, imported by both the client form and the server action —
 * docs/02-TRD.md §9.2. Client validation is UX; the server parse is the
 * boundary that actually matters.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(120, 'That name is too long.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Enter a valid email address.')
    .max(255, 'That email is too long.'),
  subject: z
    .string()
    .trim()
    .min(3, 'Add a short subject.')
    .max(160, 'Keep the subject under 160 characters.'),
  message: z
    .string()
    .trim()
    .min(20, 'Tell us a bit more — at least 20 characters.')
    .max(4000, 'Keep the message under 4000 characters.'),
  /** Honeypot. Must stay empty; bots fill it. docs/06 §4.9. */
  website: z.string().max(0, 'Submission rejected.').optional().default(''),
})

export type ContactInput = z.infer<typeof contactSchema>

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fields?: Partial<Record<keyof ContactInput, string>> }
