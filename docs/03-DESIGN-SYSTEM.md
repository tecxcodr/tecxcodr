# Tecxcodr — UX/UI Design System

**Version:** 1.0 (MVP) · **Date:** 2026-08-24
**Derives from:** [`00-PRODUCT-DECISIONS.md`](00-PRODUCT-DECISIONS.md) · **Constrained by:** [`02-TRD.md`](02-TRD.md) §10

---

## 1. Brand personality

Tecxcodr looks like a tool a developer would choose, not a course a student would be sold.

| We are | We are not |
|---|---|
| Precise, high-contrast, editorial | Playful, rounded, illustrated |
| Technical without being cryptic | Cryptic for the aesthetic of it |
| Confident and plain-spoken | Hype-driven, emoji-laden, exclamation-marked |
| Dense with real information | Padded with stock photography |
| Monochrome with intent | Neon, gradient-meshed, "AI startup" purple |

**Voice.** Direct, second person, present tense, lowercase in monospace UI labels. States facts and numbers. Never claims placement, salary, or guarantees (`00` B5). "Build three real projects. Get reviewed by a human. Get a certificate a recruiter can verify." — not "Launch your dream tech career!"

**Visual thesis.** A monochrome, high-contrast editorial layout with a monospace technical layer sitting on top of it — labels, indices, metadata and code rendered as machine output over human-readable prose. Colour appears only to communicate state.

---

## 2. Colour system

### 2.1 Rules

1. **Every colour is consumed through a semantic token.** A component never references a palette value or a hex code.
2. **Chromatic colour is reserved for status.** Success, warning, destructive and info exist to convey application/payment/submission state and nothing else. Never decorative, never in the hero, never in a gradient.
3. **Dark is the primary theme.** It is designed first; light is designed independently, not inverted.
4. **Never pure `#000` on pure `#fff`.** Off-black and off-white reduce halation and let elevation read.
5. **Elevation in dark comes from background lightness + border**, not shadow. Elevation in light comes from shadow + border.

### 2.2 Token contract

Defined once in `styles/tokens.css` as CSS custom properties in OKLCH, exposed to Tailwind v4 via `@theme`.

| Token | Purpose |
|---|---|
| `--bg` | page background |
| `--bg-subtle` | alternating section background |
| `--surface` | card / panel |
| `--surface-raised` | popover, dropdown, modal |
| `--surface-code` | code block / terminal body |
| `--fg` | primary text |
| `--fg-muted` | secondary text, metadata |
| `--fg-subtle` | tertiary, placeholder, disabled |
| `--border` | default border |
| `--border-strong` | emphasised divider, focused field |
| `--accent` | inverted CTA fill (white in dark, near-black in light) |
| `--accent-fg` | text on `--accent` |
| `--ring` | focus ring |
| `--success` `--warning` `--destructive` `--info` | status fills |
| `--success-fg` … | status text/icon on subtle backgrounds |
| `--success-subtle` … | status background at low emphasis |
| `--overlay` | modal scrim |

### 2.3 Dark theme (default)

```css
:root, [data-theme="dark"] {
  --bg:              oklch(0.145 0 0);   /* #0a0a0a */
  --bg-subtle:       oklch(0.170 0 0);
  --surface:         oklch(0.190 0 0);
  --surface-raised:  oklch(0.225 0 0);
  --surface-code:    oklch(0.165 0 0);

  --fg:              oklch(0.970 0 0);
  --fg-muted:        oklch(0.680 0 0);
  --fg-subtle:       oklch(0.520 0 0);

  --border:          oklch(0.270 0 0);
  --border-strong:   oklch(0.380 0 0);

  --accent:          oklch(0.985 0 0);
  --accent-fg:       oklch(0.145 0 0);
  --ring:            oklch(0.800 0 0);
  --overlay:         oklch(0.145 0 0 / 0.72);

  --success:         oklch(0.720 0.150 150);
  --success-subtle:  oklch(0.720 0.150 150 / 0.14);
  --warning:         oklch(0.800 0.140 80);
  --warning-subtle:  oklch(0.800 0.140 80 / 0.14);
  --destructive:     oklch(0.660 0.190 25);
  --destructive-subtle: oklch(0.660 0.190 25 / 0.14);
  --info:            oklch(0.720 0.110 240);
  --info-subtle:     oklch(0.720 0.110 240 / 0.14);
}
```

### 2.4 Light theme

Not an inversion — text is lightened to `0.20` rather than pure black, borders are heavier relative to background, and status hues are darkened to hold contrast on white.

```css
[data-theme="light"] {
  --bg:              oklch(1.000 0 0);
  --bg-subtle:       oklch(0.976 0 0);
  --surface:         oklch(1.000 0 0);
  --surface-raised:  oklch(1.000 0 0);
  --surface-code:    oklch(0.966 0 0);

  --fg:              oklch(0.200 0 0);
  --fg-muted:        oklch(0.470 0 0);
  --fg-subtle:       oklch(0.620 0 0);

  --border:          oklch(0.905 0 0);
  --border-strong:   oklch(0.800 0 0);

  --accent:          oklch(0.200 0 0);
  --accent-fg:       oklch(0.990 0 0);
  --ring:            oklch(0.400 0 0);
  --overlay:         oklch(0.200 0 0 / 0.45);

  --success:         oklch(0.500 0.140 150);
  --success-subtle:  oklch(0.500 0.140 150 / 0.10);
  --warning:         oklch(0.560 0.130 70);
  --warning-subtle:  oklch(0.560 0.130 70 / 0.12);
  --destructive:     oklch(0.530 0.200 25);
  --destructive-subtle: oklch(0.530 0.200 25 / 0.10);
  --info:            oklch(0.520 0.120 240);
  --info-subtle:     oklch(0.520 0.120 240 / 0.10);
}
```

### 2.5 Contrast verification (required, not optional)

| Pair | Dark | Light | Min |
|---|---|---|---|
| `--fg` on `--bg` | ~17:1 | ~16:1 | 4.5 |
| `--fg-muted` on `--bg` | ~7.1:1 | ~6.4:1 | 4.5 |
| `--fg-subtle` on `--bg` | ~4.0:1 | ~3.6:1 | 3.0 (non-text / placeholder only) |
| `--accent-fg` on `--accent` | ~17:1 | ~16:1 | 4.5 |
| `--border` on `--bg` | ~1.9:1 | ~1.4:1 | 3.0 required only for *meaningful* borders (inputs) — decorative dividers exempt |
| Input border on `--bg` | uses `--border-strong` | uses `--border-strong` | 3.0 ✔ |

**Rule:** `--fg-subtle` is never used for content a user must read. Placeholders and disabled labels only.

### 2.6 Theme switching

`data-theme` on `<html>`, set by `next-themes` with a blocking inline script in `<head>` so there is no flash. Default resolves from `prefers-color-scheme`, and the user's explicit choice persists to `localStorage`. The toggle is a three-state control (`system` / `light` / `dark`) rendered as a segmented monospace control, not a sun/moon icon that hides which mode is actually active.

---

## 3. Typography

### 3.1 Families & rationale

| Role | Family | Why |
|---|---|---|
| Display / headings | **Space Grotesk** (500, 700) | Geometric with deliberate technical quirks (the `a`, `g`, `k`). Distinctive without being decorative, and — importantly — not a font people associate with another developer brand |
| Body / UI | **Inter** (400, 500, 600) | The most legible sans at 14–16px on Android; excellent for dense forms and tables where Space Grotesk would tire |
| Code / labels / metrics | **JetBrains Mono** (400, 500, 700) | Designed for code, large x-height, unambiguous `0/O` `1/l/I`. Carries the entire technical layer |

Loaded via `next/font/google` (self-hosted, subset `latin`, `display: swap`). Only the two above-the-fold weights are preloaded: Space Grotesk 700 and Inter 400.

**Rejected:** Geist (reads as another company's brand), Roboto/Open Sans (generic), any variable display font that costs >40 KB.

### 3.2 The two-layer rule

This is the core typographic idea and it must be applied consistently:

- **Human layer** (Space Grotesk / Inter) — headlines, prose, form labels, button text, anything the user *reads*.
- **Machine layer** (JetBrains Mono, uppercase, `letter-spacing: 0.08em`, `--fg-muted`, 11–13px) — section indices (`[03]`), eyebrows (`PROGRAM // WEB DEVELOPMENT`), stat labels, table headers, status badges, timestamps, IDs, file paths, counts, breadcrumbs.

The machine layer is what makes the product feel developer-native. It is never used for sentences.

### 3.3 Scale

Fluid via `clamp()`, min at 360px, max at 1440px.

| Token | Family | Size | LH | Tracking | Weight | Use |
|---|---|---|---|---|---|---|
| `display-1` | Grotesk | `clamp(2.75rem, 7vw, 5.5rem)` | 0.95 | −0.03em | 700 | homepage hero only |
| `display-2` | Grotesk | `clamp(2.25rem, 5vw, 3.75rem)` | 1.0 | −0.025em | 700 | page hero |
| `h1` | Grotesk | `clamp(1.875rem, 3.5vw, 2.75rem)` | 1.1 | −0.02em | 700 | page title |
| `h2` | Grotesk | `clamp(1.5rem, 2.5vw, 2rem)` | 1.2 | −0.015em | 700 | section |
| `h3` | Grotesk | `clamp(1.25rem, 1.8vw, 1.5rem)` | 1.3 | −0.01em | 500 | card title, subsection |
| `h4` | Inter | `1.125rem` | 1.4 | 0 | 600 | dense headings, dashboard |
| `body-lg` | Inter | `1.125rem` | 1.65 | 0 | 400 | lede, program description |
| `body` | Inter | `1rem` | 1.6 | 0 | 400 | default |
| `body-sm` | Inter | `0.875rem` | 1.55 | 0 | 400 | secondary, help text |
| `caption` | Inter | `0.8125rem` | 1.45 | 0 | 400 | timestamps, footnotes |
| `mono-label` | Mono | `0.75rem` | 1.3 | 0.08em | 500 | **the machine layer.** uppercase |
| `mono-sm` | Mono | `0.8125rem` | 1.5 | 0 | 400 | inline code, IDs, URLs |
| `mono-code` | Mono | `0.875rem` | 1.7 | 0 | 400 | code blocks |
| `mono-metric` | Mono | `clamp(2rem, 4vw, 3rem)` | 1.0 | −0.02em | 700 | large stats |

### 3.4 Prose rules

Measure capped at `68ch` for body, `60ch` for `body-lg`. Paragraph spacing `1em`. `text-wrap: balance` on all headings; `text-wrap: pretty` on paragraphs. `font-variant-numeric: tabular-nums` on every number in a table, stat, timer or price. No justified text. No text over imagery without a solid scrim.

### 3.5 Responsive typography

| Breakpoint | Adjustment |
|---|---|
| < 640 | `display-1` bottoms out at 2.75rem; letter-spacing relaxes to −0.02em; body stays 16px (never below); mono-label stays 12px minimum |
| 640–1023 | fluid scaling |
| ≥ 1024 | full scale; measure caps engage |

Body text is never smaller than 16px on mobile — it triggers iOS input zoom and hurts readability on the exact devices most of the audience uses.

---

## 4. Spacing, radius, elevation, grid

### 4.1 Spacing — 4px base

`0.5=2 · 1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 10=40 · 12=48 · 16=64 · 20=80 · 24=96 · 32=128 · 40=160`

| Context | Value |
|---|---|
| Icon ↔ label | 8 |
| Form label ↔ field | 8 |
| Between form fields | 20 |
| Card padding (mobile / desktop) | 20 / 24 |
| Between cards | 16–24 |
| Section vertical (mobile / tablet / desktop) | 64 / 96 / 128 |
| Hero vertical (mobile / desktop) | 96 / 160 |
| Page gutter (mobile / tablet / desktop) | 20 / 32 / 48 |

### 4.2 Radius — deliberately tight

`--r-sm: 2px` (badges, tags) · `--r-md: 4px` (**default** — buttons, inputs, cards) · `--r-lg: 8px` (modals, large panels) · `--r-full` (avatars only).

Sharp corners are part of the identity. **No pill-shaped buttons anywhere.** Nothing exceeds 8px except avatars.

### 4.3 Elevation

| Level | Dark | Light |
|---|---|---|
| 0 — flat | `--bg` | `--bg` |
| 1 — card | `--surface` + 1px `--border` | `--surface` + 1px `--border` + `0 1px 2px oklch(0 0 0/.05)` |
| 2 — dropdown/popover | `--surface-raised` + 1px `--border` | `--surface-raised` + 1px `--border` + `0 4px 12px oklch(0 0 0/.08)` |
| 3 — modal/drawer | `--surface-raised` + 1px `--border-strong` | + `0 16px 48px oklch(0 0 0/.14)` |

In dark mode shadows are near-invisible, so depth is communicated by background lightness delta plus border. Do not attempt to force shadows into the dark theme.

### 4.4 Grid & breakpoints

| Name | Min | Container | Columns | Gutter |
|---|---|---|---|---|
| `xs` | 0 | fluid | 4 | 16 |
| `sm` | 640 | 600 | 8 | 20 |
| `md` | 768 | 728 | 8 | 24 |
| `lg` | 1024 | 976 | 12 | 24 |
| `xl` | 1280 | 1200 | 12 | 32 |
| `2xl` | 1536 | 1320 | 12 | 32 |

Content max-width `1320px`. Prose max-width `68ch`. Full-bleed sections may exceed the container but their inner content may not.

**Optional 1px grid overlay** (`--border` at 40% opacity, 96px cells) as a background on marketing sections — a light nod to a design canvas. Marketing only, never in dashboards, and never at more than 40% opacity.

---

## 5. Components

Every component specifies: variants · sizes · all interaction states · a11y contract · responsive behaviour. Built on Radix headless primitives with locally-owned styled wrappers in `components/ui/`.

### 5.1 Universal state contract

Every interactive element defines **all seven**: `default · hover · active · focus-visible · disabled · loading · error`. A PR that ships an interactive element missing any of these is incomplete.

**Focus ring (global, non-negotiable):**
```css
:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; border-radius: inherit; }
```
Never `outline: none` without an equivalent visible replacement.

### 5.2 Button

| Variant | Dark | Light | Use |
|---|---|---|---|
| `primary` | white fill, black text | black fill, white text | one per view — the primary action |
| `secondary` | transparent, 1px `--border-strong`, `--fg` | same | secondary actions |
| `ghost` | transparent, no border | same | tertiary, toolbars, table row actions |
| `destructive` | `--destructive` fill | same | irreversible actions only |
| `link` | underlined `--fg`, no padding | same | inline |

| Size | Height | Padding-x | Type |
|---|---|---|---|
| `sm` | 32 | 12 | `body-sm` 500 |
| `md` | 40 | 16 | `body-sm` 500 |
| `lg` | 48 | 24 | `body` 500 |

States: hover → 4% lightness shift + `translateY(-1px)` · active → `translateY(0)` + 8% shift · focus-visible → global ring · disabled → 45% opacity, `cursor: not-allowed`, no hover · loading → spinner replaces the label, **width is frozen** to prevent layout shift, `aria-busy="true"`, click blocked.

Touch target ≥ 44×44 on mobile (achieved with padding, not by inflating the visual box). Full-width primary buttons on mobile forms. Icon-only buttons require `aria-label`.

### 5.3 Inputs (text, textarea, select, checkbox, radio)

Height 44 (md) / 48 (lg on mobile). Background `--surface`, 1px `--border-strong`, radius `--r-md`. Label above, `body-sm` 500. Help text below in `--fg-muted` `caption`. Placeholder in `--fg-subtle` — **never a substitute for a label**.

Focus: border → `--fg`, plus the global ring.
Error: border → `--destructive`, message below in `--destructive` prefixed with a 14px alert icon, `aria-invalid="true"`, `aria-describedby` pointing at the message.
Disabled: `--bg-subtle` background, `--fg-subtle` text.
Textarea: `min-height: 120px`, `resize: vertical` only.
Select: **native `<select>`, styled** (`appearance-none` + our own chevron). This reverses the original "never a native select" rule, for two measured reasons: (1) `styles/tokens.css` sets `color-scheme: dark|light` per theme, so modern browsers already draw the native popup in the matching scheme — the "white system dropdown on a near-black page" problem does not occur; (2) Radix Select cost ~26 kB on `/apply/[slug]` and `/dashboard/profile`, pushing both past their budgets in `02-TRD` §10.1. Native also beats a custom listbox on mobile (OS wheel picker) and brings keyboard, type-ahead and screen-reader support for free. Reach for Radix Select only if a control needs search, multi-select, or rich option content — none currently do.
Checkbox/radio: 18×18 box with a 44×44 hit area via label padding.

Inputs are `font-size: 16px` on mobile without exception (iOS zoom).

### 5.4 Card

`--surface`, 1px `--border`, `--r-md`, padding 20/24. Hover (interactive cards only): `--border-strong` + `translateY(-2px)` over 180ms. The whole card is a link via a stretched pseudo-element so the hit area is the full card, while the accessible name comes from the heading anchor.

**Program card** — mono eyebrow (domain), `h3` title, 2-line clamped description, mono metadata row (`04 WEEKS · 03 TASKS · ₹799`), and a bottom-right arrow that translates 4px on hover.

### 5.5 Badge (status)

`mono-label`, uppercase, height 22, padding-x 8, radius `--r-sm`, subtle status background + status foreground + 1px status border at 30% alpha.

| Status | Token |
|---|---|
| `DRAFT` | neutral (`--fg-muted` on `--bg-subtle`) |
| `SUBMITTED` `UNDER_REVIEW` `PENDING` | info |
| `ACCEPTED` `PAID` `APPROVED` `ACTIVE` `COMPLETED` | success |
| `CHANGES_REQUESTED` `EXPIRED` | warning |
| `REJECTED` `FAILED` `REVOKED` `CANCELLED` | destructive |

**Colour is never the only signal.** Every badge carries its text label, and status timelines additionally use icon shape.

### 5.6 Table (admin)

`mono-label` uppercase headers on `--bg-subtle` with a bottom `--border`. Rows 52px, hover `--bg-subtle`, 1px row separators. `tabular-nums` on all numeric columns. Sticky header. Sortable columns carry `aria-sort`.

**Mobile:** tables do not scroll horizontally — they **transform into stacked cards** below `md`, with the header becoming a `mono-label` prefix per field. Horizontal scroll on a data table is a mobile failure, not a fallback.

### 5.7 Dialog / Drawer

Radix Dialog. Scrim `--overlay` with `backdrop-filter: blur(4px)`. Panel at elevation 3, max-width 560 (md) / 720 (lg), max-height `85vh` with internal scroll. Header (title + close), body, footer (actions right-aligned; primary rightmost).

Focus trapped, focus returned to the trigger on close, `Escape` closes, background scroll locked, `aria-labelledby`/`aria-describedby` wired.

**Below `md`, dialogs become bottom sheets**: full-width, top corners `--r-lg`, slide up 240ms, with a drag handle and swipe-to-dismiss. Confirmation for destructive actions is always a dialog with the destructive verb as the button label ("Revoke certificate"), never "OK".

### 5.8 Dropdown menu

Radix. Elevation 2, min-width 180, item height 36, hover `--bg-subtle`, section labels in `mono-label`, 1px separators, destructive items in `--destructive`. Full keyboard navigation and type-ahead come from Radix.

### 5.9 Tabs & Accordion

**Tabs** — `mono-label` uppercase, 2px bottom indicator that slides via `transform` (GSAP on marketing, CSS transition in dashboards). Below `sm`, tabs scroll horizontally with edge fade masks. Radix roving-tabindex keyboard behaviour.

**Accordion** — used for the FAQ. Row separated by 1px `--border`, question in `h4`, chevron rotates 180°, height animated via CSS grid `grid-template-rows: 0fr → 1fr` (no JS height measurement, no layout thrash). Single-open by default. Under `prefers-reduced-motion`, content toggles instantly.

### 5.10 Toast

Bottom-right desktop, top-centre mobile (below the header). Elevation 2, 3px left border in the status colour, `mono-label` title, `body-sm` description. Auto-dismiss 5s (success/info), manual only for errors. Max 3 stacked. `role="status"` / `aria-live="polite"`, and `role="alert"` / `assertive` for errors.

**Toasts confirm; they never carry information the user needs to act on.** Form errors live inline, next to the field.

### 5.11 Progress & stepper

**Progress bar** — 6px, `--bg-subtle` track, `--fg` fill, width animated 400ms `ease-out`. Always paired with a `mono-label` count (`02 / 03 TASKS APPROVED`); never the bar alone.

**Application stepper** — 3 nodes, `mono-label` numerals, completed nodes filled, current node ringed, connector line fills as you progress. On mobile it collapses to `STEP 02 / 03` plus a progress bar.

**Status timeline** — vertical, 8px node, 1px connector, `mono-label` timestamp + `body-sm` description per event. Rendered from `application_status_history`.

### 5.12 Code-inspired elements

Used with restraint — a handful of high-impact placements, not everywhere.

| Element | Spec | Where |
|---|---|---|
| **Terminal window** | `--surface-code` body, 1px `--border`, 32px title bar with three 10px outlined circles and a mono path label | homepage hero, How It Works |
| **Prompt line** | `$` in `--fg-subtle`, command in `--fg`, 8px block cursor blinking 1.06s step-end | terminal window only |
| **Typing effect** | character reveal, 45ms/char, ±15ms jitter. Container height reserved to prevent CLS. **Disabled under reduced-motion — full text renders immediately** | hero headline only |
| **Section index** | `[01]` `[02]` in `mono-label` `--fg-subtle` above every marketing section heading | all marketing sections |
| **ASCII divider** | repeating `·` or `─` at 1px, `--border`, full-bleed | between marketing sections |
| **Inline code** | `--surface-code`, 1px `--border`, `--r-sm`, padding 2/6, `mono-sm` | task briefs, docs |
| **Code block** | `--surface-code`, 1px `--border`, `--r-md`, 16px padding, no syntax highlighting library in MVP (monochrome with weight/opacity variation only — saves ~30 KB and is on-brand) | task briefs |
| **Grid overlay** | 96px cells, `--border` @ 40% | marketing section backgrounds |
| **Metric block** | `mono-metric` figure over `mono-label` caption | stats strip |

**Explicitly rejected:** custom cursors that replace the system cursor (accessibility and mobile-irrelevance), Matrix rain, fake scrolling logs, decorative binary strings, ASCII art logos at small sizes.

### 5.13 Navigation

**Header** — 72px tall, `position: sticky`, transparent at `scrollY = 0`. Past 32px it acquires `--bg` at 80% with `backdrop-filter: blur(12px)`, a 1px bottom `--border`, and compresses to 60px — all via `transform`/`opacity`/CSS-variable transitions, no layout-affecting property. Nav links carry a 1px underline that scales from `transform: scaleX(0)` on hover; the active route's underline is persistent. Right cluster: theme toggle · Sign in (ghost) · Apply now (primary).

**Mobile navigation is a distinct design, not a collapsed desktop bar.** Tapping the menu opens a **full-screen panel**: `--bg`, links at `h2` scale, staggered in 40ms apart, `mono-label` section groupings, theme toggle and both CTAs pinned to the bottom above the safe area. Focus is trapped, `Escape` closes, background scroll locks, and the trigger animates hamburger → X. Under reduced motion the panel appears without stagger.

**Dashboard nav** — collapsible 240px left sidebar on `lg+` with `mono-label` group headers and a persistent 2px left indicator on the active item; a bottom tab bar (4 items + More) below `lg`.

**Footer** — 5 columns on `lg` (brand + mission, Programs, Company, Legal, Contact), stacked accordions on mobile. A single monospace line above the copyright serves as the identity detail: `tecxcodr · built for people who build things`. Includes a small `mono-label` status line (`ALL SYSTEMS OPERATIONAL`) only if it is genuinely wired to something real — otherwise omitted, because a fake status indicator undermines a product selling verifiability.

### 5.14 Loading, empty, and error states

Every data surface ships all three. This is a hard requirement, not a polish item.

**Loading** — skeletons that match the final layout's exact dimensions (no CLS on resolve), `--bg-subtle` with a 1.4s shimmer that is **disabled under reduced motion** (static block instead). Buttons use inline spinners with frozen width. Route transitions use `loading.tsx` per route group. No full-page spinners.

**Empty** — a 32px monospace glyph or bracket mark, an `h4` heading, one line of `body-sm` guidance, and one primary action. Copy is specific and useful:

| Surface | Heading | Action |
|---|---|---|
| No applications | `No applications yet` | Browse programs |
| No enrolments | `You're not enrolled in a program yet` | Browse programs |
| No submissions (admin) | `Review queue is clear` | — |
| No search results | `No results for "<query>"` | Clear filters |
| Certificate not found | `No certificate with that code` | (verify page — see below) |

**Error** — an `error.tsx` boundary per route group. `h3` heading, plain-language `body` explanation, a Retry button, a link home, and the `requestId` in `mono-sm` for support. Never a stack trace, never a raw error string, never "Something went wrong" alone.

**Verify page states** — `VALID` (success badge, full detail), `REVOKED` (destructive badge, revocation date, explanation), `NOT FOUND` (neutral, "no certificate matches this code", link to the homepage). Never a 404 page for a revoked or malformed code — the page must always look institutional and intentional.

---

## 6. Animation

### 6.1 Principles

1. **Animation communicates or it is deleted.** It shows origin, hierarchy, or state change. Decoration that does none of these does not ship.
2. **Only `transform` and `opacity`.** Anything else in a scroll-linked tween is a bug (`02-TRD` §10.3).
3. **Space is always reserved.** Nothing animates in a way that shifts layout. CLS budget is 0.05.
4. **Fast on interaction, slower on arrival.** Feedback ≤ 150ms; entrances 400–700ms.
5. **One focal motion per viewport.** Competing animations read as noise.
6. **Reduced motion means removed, not shortened.** Content appears in its final state instantly.
7. **Dashboards do not animate.** Marketing gets GSAP; the product gets CSS transitions and nothing more.

### 6.2 Duration & easing

| Token | ms | Use |
|---|---|---|
| `--d-instant` | 100 | hover, focus, toggles |
| `--d-fast` | 180 | button press, tab indicator |
| `--d-base` | 280 | dropdowns, accordions, toasts |
| `--d-slow` | 450 | modals, page section reveals |
| `--d-slower` | 700 | hero entrance |

| Token | Curve | Use |
|---|---|---|
| `--e-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | **default** — entrances, reveals |
| `--e-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | movement between two on-screen states |
| `--e-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | exits |
| `--e-spring` | GSAP `back.out(1.4)` | magnetic buttons only |

No bounce, no elastic, no overshoot on anything that isn't explicitly playful. Stagger is 40–80ms between siblings, capped at 6 items — beyond that the last item arrives too late.

### 6.3 Marketing choreography

| Effect | Implementation | Notes |
|---|---|---|
| Smooth scroll | Lenis, `lerp: 0.1`, marketing routes only | disabled under reduced motion and on touch devices where native momentum is better |
| Section reveal | ScrollTrigger, `start: "top 85%"`, `once: true`, `y: 24 → 0`, `opacity: 0 → 1`, `--d-slow` | space reserved via `min-height` |
| Heading reveal | GSAP SplitText by **line** (not character) for body headings | character-level is reserved for the single hero headline |
| Hero typing | mono prompt, 45ms/char | full text rendered server-side in the DOM; the effect masks it, so SEO and no-JS both see the content |
| Magnetic button | GSAP `quickTo` on `x`/`y`, max 8px, `back.out(1.4)` | **pointer-fine only.** `gsap.matchMedia('(hover: hover) and (pointer: fine)')` |
| Program card hover | CSS only — border colour + `translateY(-2px)` | no GSAP; runs on every card in a grid |
| Number count-up | GSAP on a `tabular-nums` element, once, on scroll into view | final value present in the DOM first |
| Marquee | CSS `translateX` keyframes, duplicated content, `animation-play-state: paused` on hover | not JS-driven |
| Pinned section | ScrollTrigger `pin` for the "How It Works" progression | **desktop `lg+` only** — pinning on mobile is disorienting and expensive |
| Header transform | CSS transitions on a `data-scrolled` attribute set by a throttled scroll listener | no GSAP for the header |

### 6.4 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

And in JS — the CSS override is not sufficient for GSAP:
```
gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
  // set final states directly, register no ScrollTriggers, do not start Lenis
})
```
Reduced motion must be tested as a real state, not assumed. The typing effect, count-ups, pinning, magnetic buttons and Lenis are all fully **absent** in this mode — final content, no motion.

### 6.5 Mobile & low-end policy

Below 768px: no pinning, no parallax, no magnetic effects, no smooth-scroll library. Reveals reduce to opacity-only with a shorter duration. Stagger caps at 3. GSAP plugins load only after `requestIdleCallback` on the marketing route, and never on dashboards.

---

## 7. Accessibility rules

Target: **WCAG 2.2 AA.**

1. Semantic HTML first — `<button>` for actions, `<a>` for navigation, real `<form>`, real headings. ARIA only when no native element exists.
2. One `<h1>` per page; heading levels never skip.
3. Every page has a `<main>`, and a skip-to-content link is the first focusable element.
4. All interactive elements are keyboard-reachable in a logical order; nothing is mouse-only.
5. Focus is always visible (§5.1) and never removed.
6. Focus is trapped in modals and the mobile menu, and returned to the trigger on close.
7. Colour is never the sole carrier of meaning — status always has a text label.
8. Text contrast ≥ 4.5:1; UI component and meaningful border contrast ≥ 3:1 (§2.5).
9. Every input has a programmatically associated `<label>`. Placeholders are not labels.
10. Errors are announced (`aria-live`), tied to their field via `aria-describedby`, and describe how to fix the problem.
11. Touch targets ≥ 44×44 with ≥ 8px separation.
12. Images carry meaningful `alt`; decorative images use `alt=""`.
13. Motion respects `prefers-reduced-motion` (§6.4).
14. Content reflows without horizontal scrolling down to 320px width and up to 200% zoom.
15. Dynamic regions (toasts, review queue advancement, form results) announce via `aria-live`.
16. `axe-core` runs against every public page and every form in CI. Violations fail the build.

---

## 8. Homepage composition

The one page that must not be a generic landing page. Eight sections, each with a stated job.

| # | Section | Job | Key elements |
|---|---|---|---|
| `[00]` | **Hero** | Say what this is in 5 seconds | Terminal window with a typed prompt; `display-1` headline; one-sentence subhead; primary "Browse programs" + secondary "How it works"; a `mono-label` trust line (`no placement guarantees · verifiable certificates · human review`) |
| `[01]` | **Proof of substance** | Kill the "is this a scam" objection immediately | Three metric blocks (`04 WEEKS`, `03 REAL PROJECTS`, `01 HUMAN REVIEWER`) + a real, expandable sample task brief |
| `[02]` | **Programs** | Move to the catalogue | 3–6 program cards with real metadata; "View all programs" |
| `[03]` | **How it works** | Remove process uncertainty | 5-step horizontal timeline, ScrollTrigger-pinned on `lg+`, stacked vertical on mobile |
| `[04]` | **The certificate** | Show the differentiator | A rendered certificate mock beside a live `/verify` example; "Verify a certificate" link |
| `[05]` | **Who it's for** | Self-qualification | Two honest columns: "This is for you if…" / "This isn't for you if…" — the second column buys more credibility than any testimonial |
| `[06]` | **FAQ** | Answer the money and legitimacy questions | Accordion, 6 questions, leading with price, refund, and "will this get me a job" (answered honestly: no) |
| `[07]` | **CTA + footer** | Convert | Full-bleed inverted band, one headline, one button |

No carousel. No auto-playing video. No stock photography. No fabricated testimonials (`00` S3). Total marketing images: the certificate mock and program cover art — nothing else.

---

## 9. Implementation contract

1. Tokens are defined **once** in `styles/tokens.css` and consumed via Tailwind theme variables. A hex code in a component file fails review.
2. `components/ui/*` are presentation-only. They never import from `src/server/*` and never fetch.
3. Every new interactive component ships with all seven states (§5.1) and its a11y contract in a comment.
4. Every new data surface ships with loading, empty and error states before it is considered done.
5. Animation lives in `components/motion/*` as client islands wrapping server-rendered children. No GSAP import outside that directory.
6. Reduced motion is verified manually per animated component before merge.
7. Any new colour requires a new semantic token and a documented contrast check — not a one-off value.
