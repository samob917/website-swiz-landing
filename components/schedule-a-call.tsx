"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar } from "lucide-react"

const CALENDLY_URL =
  "https://calendly.com/zacdermody-schedulingwiz/new-meeting"

/**
 * Site-wide closing call to action, rendered above the footer on every page.
 *
 * Deliberately low-pressure: it states what we do and offers a conversation.
 * No countdown, no "limited spots", no second competing button. Someone who
 * has read a 2,500-word post about duty hours does not need to be pushed.
 */
export function ScheduleACall() {
  // Each use-case page closes with its own call to action, so a second one
  // directly beneath it was asking twice. Everywhere else this is the only one.
  const pathname = usePathname()
  if (pathname && /^\/uses\/[^/]+/.test(pathname)) return null

  return (
    <section className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-8">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Want us to build your schedules?
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-gray-600">
          Tell us about how your schedules work and we will build them for you.
        </p>

        <div className="mt-5">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-800"
          >
            <Calendar className="h-4 w-4" />
            Schedule a call
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Or{" "}
          <Link
            href="/contact"
            className="underline underline-offset-2 transition-colors hover:text-gray-700"
          >
            send us a message
          </Link>{" "}
          and tell us what you are working with.
        </p>
      </div>
    </section>
  )
}
