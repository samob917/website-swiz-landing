"use client"

import { useEffect } from "react"

/**
 * Lands on the page's hero for a beat, then runs down to the element with
 * the given id so nobody has to hunt for the content. A short, fixed-duration
 * scroll rather than the browser's smooth scroll, which is slow over a full
 * viewport. Honours prefers-reduced-motion by jumping straight there.
 *
 * `offset` is how far above the element to stop, in pixels. `skipIf` lets a
 * page opt out for a visit that already scrolls somewhere else, such as a
 * deep link to one testimonial.
 */
export function useRunDownTo(
  id: string,
  { offset = 0, skipIf }: { offset?: number; skipIf?: () => boolean } = {},
) {
  useEffect(() => {
    if (skipIf?.()) return
    const el = document.getElementById(id)
    if (!el) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const target = () => el.getBoundingClientRect().top + window.scrollY - offset
    if (reduced) {
      window.scrollTo(0, target())
      return
    }
    const start = window.scrollY
    const duration = 380
    let t0: number | null = null
    let raf = 0
    const step = (now: number) => {
      if (t0 === null) t0 = now
      const k = Math.min(1, (now - t0) / duration)
      const ease = 1 - Math.pow(1 - k, 3)
      window.scrollTo(0, start + (target() - start) * ease)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    const timer = window.setTimeout(() => { raf = requestAnimationFrame(step) }, 120)
    return () => { window.clearTimeout(timer); cancelAnimationFrame(raf) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, offset])
}
