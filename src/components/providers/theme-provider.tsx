'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * `attribute="data-theme"` matches the token selectors in styles/tokens.css
 * and the @custom-variant in globals.css, so `dark:` utilities and the token
 * layer stay in sync.
 *
 * next-themes injects a blocking inline script, so there is no flash of the
 * wrong theme — docs/01 FR-7.1.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
