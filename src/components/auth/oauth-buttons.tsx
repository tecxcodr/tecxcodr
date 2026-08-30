'use client'

import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'

/**
 * Google + GitHub sign-in — docs/00 A2.
 *
 * ⚠️ NO BACKEND. These are disabled rather than fake: a button that looks
 * live and silently does nothing is worse than one that says it is not ready.
 *
 * TODO(backend): authClient.signIn.social({ provider, callbackURL })
 * from Better Auth. Providers must be registered with the redirect URI
 * https://tecxcodr.com/api/auth/callback/{provider} (docs/05 §3).
 */
export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" size="lg" disabled className="w-full">
        <GoogleMark />
        Continue with Google
      </Button>

      <Button variant="secondary" size="lg" disabled className="w-full">
        <GitHubMark />
        Continue with GitHub
      </Button>

      <MonoLabel tone="subtle" className="text-center">
        oauth not wired up yet
      </MonoLabel>
    </div>
  )
}

/* Inline marks rather than an icon package: two brand logos do not justify a
   dependency, and lucide has no brand icons. */

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.63h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.72c2.18-2 3.44-4.96 3.44-8.56Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.89c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.03-6.45-4.75H1.7v2.98A11.5 11.5 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.55 14.67a6.9 6.9 0 0 1 0-4.41V7.28H1.7a11.51 11.51 0 0 0 0 10.37l3.85-2.98Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.72 1.24 15.11 0 12 0 7.5 0 3.6 2.58 1.7 6.34l3.85 2.98C6.46 6.6 9 4.75 12 4.75Z"
      />
    </svg>
  )
}

function GitHubMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0 fill-current">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
    </svg>
  )
}
