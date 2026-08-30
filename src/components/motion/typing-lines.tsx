'use client'

import { useEffect, useRef } from 'react'
import { motionEnabled } from '@/lib/motion/config'

const CHAR_MS = 45
const JITTER_MS = 15
const LINE_PAUSE_MS = 320

/**
 * Types out already-rendered lines.
 *
 * The complete text is server-rendered and present in the DOM. On mount we
 * reserve the measured height *first*, then clear and retype — so the effect
 * cannot cause layout shift, and users without motion simply see the finished
 * output. docs/03 §5.12.
 */
export function TypingLines({ lines, className }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || !motionEnabled()) return

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-typed]'))
    if (nodes.length === 0) return

    // Reserve the finished height before emptying anything.
    root.style.minHeight = `${root.offsetHeight}px`

    const originals = nodes.map((n) => n.textContent ?? '')
    let timer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    nodes.forEach((n) => {
      n.textContent = ''
      n.setAttribute('data-pending', '')
    })

    const typeLine = (lineIndex: number) => {
      if (cancelled || lineIndex >= nodes.length) return
      const node = nodes[lineIndex]
      const text = originals[lineIndex]
      if (!node || text === undefined) return

      node.removeAttribute('data-pending')
      let charIndex = 0

      const step = () => {
        if (cancelled) return
        charIndex += 1
        node.textContent = text.slice(0, charIndex)

        if (charIndex < text.length) {
          timer = setTimeout(step, CHAR_MS + (Math.random() * 2 - 1) * JITTER_MS)
        } else {
          timer = setTimeout(() => typeLine(lineIndex + 1), LINE_PAUSE_MS)
        }
      }

      step()
    }

    // Only start once the hero is actually on screen.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect()
          typeLine(0)
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(root)

    return () => {
      cancelled = true
      observer.disconnect()
      if (timer) clearTimeout(timer)
      // Restore full text so a fast unmount/remount never leaves it truncated.
      nodes.forEach((n, i) => {
        n.textContent = originals[i] ?? ''
        n.removeAttribute('data-pending')
      })
    }
  }, [lines])

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <div key={i} className="flex gap-2">
          <span aria-hidden className="shrink-0 text-fg-subtle select-none">
            $
          </span>
          <span data-typed className="text-fg [&[data-pending]]:opacity-0">
            {line}
          </span>
          {i === lines.length - 1 && (
            <span aria-hidden className="blink-cursor bg-fg inline-block h-[1.1em] w-[0.5em]" />
          )}
        </div>
      ))}
    </div>
  )
}
