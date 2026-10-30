"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"

const CALENDLY_URL =
  "https://calendly.com/zacdermody-schedulingwiz/new-meeting"

/**
 * A "Schedule a call" button pinned to the top right of the viewport.
 *
 * It is not part of the nav: the header already has Contact us, and two
 * competing buttons an inch apart reads as pushy. This fades in once the
 * reader has scrolled past the header, so it is reachable from anywhere on a
 * long post without being the first thing anyone sees.
 *
 * Hidden on small screens, where the top right belongs to the menu button.
 */
export function ScheduleACallFloat() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 320)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={`fixed right-6 top-6 z-50 hidden items-center gap-2 rounded-full border border-white/15 bg-gray-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-yellow-400/60 hover:bg-gray-900 md:inline-flex ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <Calendar className="h-4 w-4 text-yellow-400" />
      Schedule a call
    </a>
  )
}
