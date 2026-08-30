import {
  Award,
  CreditCard,
  FileText,
  LayoutDashboard,
  Terminal,
  User,
} from 'lucide-react'

export const DASHBOARD_NAV = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, group: 'Program' },
  { label: 'Applications', href: '/dashboard/applications', icon: FileText, group: 'Program' },
  { label: 'My internship', href: '/dashboard/internships', icon: Terminal, group: 'Program' },
  { label: 'Certificates', href: '/dashboard/certificates', icon: Award, group: 'Account' },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard, group: 'Account' },
  { label: 'Profile', href: '/dashboard/profile', icon: User, group: 'Account' },
] as const

/**
 * Five of the six appear in the mobile tab bar. Payments is the one that
 * drops: it is consulted rarely and is reachable from both Overview and
 * Profile, whereas the others are used in the normal weekly loop.
 */
export const MOBILE_TABS = DASHBOARD_NAV.filter((item) => item.href !== '/dashboard/payments')

export const NAV_GROUPS = ['Program', 'Account'] as const
