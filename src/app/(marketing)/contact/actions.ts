'use server'

import { contactSchema, type ContactInput, type ContactState } from '@/lib/validation/contact'

/**
 * Contact form submission.
 *
 * ⚠️ BACKEND NOT WIRED YET. This action validates correctly and returns the
 * real success/error shape, but it does not yet persist to `contact_requests`
 * (docs/04 §5.13), send the admin email, or apply the 3/hour/IP rate limit
 * (docs/06 §2.7). Until those land, the form is a working UI over a no-op.
 *
 * TODO(backend):
 *   1. rateLimit.contact(ipHash) -> 429 on exhaustion
 *   2. db.insert(contactRequests) with sha256(ip + salt), never the raw IP
 *   3. email.send('admin-new-contact', ...) AFTER commit
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    website: formData.get('website') ?? '',
  })

  if (!parsed.success) {
    // First error per field — showing a stack of messages on one input is
    // noise, not help.
    const fields: Partial<Record<keyof ContactInput, string>> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !(key in fields)) {
        fields[key as keyof ContactInput] = issue.message
      }
    }
    return {
      status: 'error',
      message: 'Please fix the highlighted fields.',
      fields,
    }
  }

  // Honeypot tripped — respond as if accepted so bots learn nothing.
  if (parsed.data.website) return { status: 'success' }

  return { status: 'success' }
}
