"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import {
  type ConsentChoice,
  onConsentChange,
  purgeTrackingStorage,
  readConsent,
  writeConsent,
} from "@/lib/consent"
import { startPostHog, stopPostHog } from "@/lib/posthog-client"

/** Brings analytics into line with a choice. */
export function applyConsent(choice: ConsentChoice) {
  if (choice === "granted") {
    startPostHog()
  } else {
    stopPostHog()
    purgeTrackingStorage()
  }
}

export function ConsentBanner() {
  // Render nothing on the server and on the first client paint: the choice
  // lives in localStorage, so markup that assumed either answer would flash.
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined)

  useEffect(() => {
    const stored = readConsent()
    setChoice(stored)
    if (stored) applyConsent(stored)
    return onConsentChange(setChoice)
  }, [])

  const decide = (next: ConsentChoice) => {
    applyConsent(next)
    writeConsent(next)
  }

  if (choice !== null) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-white/10 bg-[#0d1117]/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-white/70">
          We use cookies and session recording to fix bugs and improve this
          site.{" "}
          <Link
            href="/privacy"
            className="text-white/90 underline underline-offset-2 transition-colors hover:text-white"
          >
            Privacy Policy
          </Link>
        </p>

        {/* Equal size and equal visual weight: neither answer is nudged. */}
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("granted")}
            className="w-28 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-white/20 hover:border-white/40"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => decide("denied")}
            className="w-28 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-white/20 hover:border-white/40"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
