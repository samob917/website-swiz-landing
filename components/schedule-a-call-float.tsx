"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"

const CALENDLY_URL =
  "https://calendly.com/zacdermody-schedulingwiz/new-meeting"

/**
 * "Schedule a call", pinned to the top right of the viewport on every page.
 *
 * Always visible. At the top of a page it sits just under the Contact us pill
 * in the header, so the two read as a stack rather than as two competing
 * buttons side by side. Once the reader scrolls and the header leaves, it
 * slides up into the space the header was using.
 *
 * Flush to the right edge with only the left corners rounded, so it reads
 * as a tab attached to the side of the window rather than a button floating
 * near it.
 *
 * Hidden below md, where the top right belongs to the menu button.
 */
export function ScheduleACallFloat() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-0 z-50 hidden items-center gap-2 rounded-l-xl border border-r-0 border-white/15 bg-gray-900/90 py-3 pl-5 pr-6 text-sm font-medium text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-yellow-400/60 hover:bg-gray-900 hover:pr-7 lg:inline-flex ${
        scrolled ? "top-6" : "top-[5.5rem] sm:top-[6.5rem]"
      }`}
    >
      <Calendar className="h-4 w-4 text-yellow-400" />
      Schedule a call
    </a>
  )
}
