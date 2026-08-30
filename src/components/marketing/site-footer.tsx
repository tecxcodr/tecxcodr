import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { MonoLabel } from '@/components/ui/mono-label'
import { FOOTER_NAV, SITE } from '@/lib/constants/site'

/**
 * Server component — the footer is static and should cost zero JS.
 *
 * Note there is deliberately no "all systems operational" indicator: a status
 * light wired to nothing would undercut a product whose entire pitch is
 * verifiability (docs/03 §5.13).
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-border border-t">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-8">
          <div className="max-w-xs">
            <Logo />
            <p className="text-body-sm text-fg-muted mt-4">
              Structured virtual internships with real task briefs, human code review, and
              certificates a recruiter can verify.
            </p>
            <p className="text-caption text-fg-subtle mt-4">
              Not employment. No stipend. No placement guarantee.
            </p>
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <MonoLabel tone="subtle" as="p" className="mb-4">
                {group.heading}
              </MonoLabel>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={`${group.heading}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-fg-muted hover:text-fg transition-colors duration-[--duration-instant]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-border mt-16 flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <MonoLabel tone="subtle">
            {SITE.wordmark} · built for people who build things
          </MonoLabel>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
            <a
              href={`mailto:${SITE.email}`}
              className="text-caption text-fg-muted hover:text-fg transition-colors"
            >
              {SITE.email}
            </a>
            <p className="text-caption text-fg-subtle">
              © {year} {SITE.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
