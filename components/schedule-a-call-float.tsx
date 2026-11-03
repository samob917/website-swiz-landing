"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
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
 * Hidden below lg, where the top right belongs to the menu button.
 *
 * On the homepage the hero already has its own "Schedule a call" button, so
 * the tab stays out of the way until the reader has scrolled past the hero,
 * then slides in from the right edge.
 */
export function ScheduleACallFloat() {
  const [scrollY, setScrollY] = useState(0)
  const [viewport, setViewport] = useState(0)
  const isHome = usePathname() === "/"

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onResize = () => setViewport(window.innerHeight)
    onScroll()
    onResize()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const scrolled = scrollY > 120
  const pastHero = viewport > 0 && scrollY > viewport * 0.75
  const visible = isHome ? pastHero : true

  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-0 z-50 hidden items-center gap-2 rounded-l-xl border border-r-0 border-white/15 bg-gray-900/90 py-3 pl-5 pr-6 text-sm font-medium text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-yellow-400/60 hover:bg-gray-900 hover:pr-7 lg:inline-flex ${
        scrolled ? "top-6" : "top-[5.5rem] sm:top-[6.5rem]"
      } ${visible ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0"}`}
    >
      <Calendar className="h-4 w-4 text-yellow-400" />
      Schedule a call
    </a>
  )
}
