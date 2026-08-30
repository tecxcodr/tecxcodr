import { z } from 'zod'
import { emailSchema } from '@/lib/validation/application'

/**
 * Auth schemas — docs/02-TRD.md §6.1, docs/06 §3.
 *
 * Note sign-in deliberately does NOT enforce the password rules. Telling
 * someone "password must be 8+ characters" at sign-in leaks that their input
 * could not possibly be a real password, and the only correct answer to a bad
 * sign-in is the same generic failure either way.
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.'),
})

export const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(200, 'That password is too long.')

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(160),
  email: emailSchema,
  password: passwordSchema,
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You need to accept the terms to create an account.' }),
  }),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

/** First error per field. */
export function fieldErrors<T extends Record<string, unknown>>(
  issues: z.ZodIssue[],
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {}
  for (const issue of issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !(key in errors)) {
      errors[key as keyof T] = issue.message
    }
  }
  return errors
}
