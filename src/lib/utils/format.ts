/**
 * Money is stored and passed around as integer minor units (paise).
 * It is converted to a display string exactly here and nowhere else.
 * docs/04-DATABASE-SCHEMA.md §1.
 */
export function formatPrice(amountMinor: number, currency: 'INR' = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

/** Zero-padded index for the mono "machine layer" — 1 → "01". */
export function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(d)
}

export function totalHours(hours: number[]): number {
  return hours.reduce((sum, h) => sum + h, 0)
}
