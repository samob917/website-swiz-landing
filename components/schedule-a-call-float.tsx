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
      className={`fixed right-6 z-50 hidden items-center gap-2 rounded-full border border-white/15 bg-gray-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-yellow-400/60 hover:bg-gray-900 md:inline-flex ${
        scrolled ? "top-6" : "top-[5.5rem] sm:top-[6.5rem]"
      }`}
    >
      <Calendar className="h-4 w-4 text-yellow-400" />
      Schedule a call
    </a>
  )
}
