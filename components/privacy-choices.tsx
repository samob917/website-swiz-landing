"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"

import {
  type ConsentChoice,
  effectiveConsent,
  gpcEnabled,
  onConsentChange,
  purgeTrackingStorage,
  writeConsent,
} from "@/lib/consent"
import { analyticsConfigured, startPostHog, stopPostHog } from "@/lib/posthog-client"

const OPEN_EVENT = "sw-open-privacy-choices"

/** Opens the dialog. Called by the footer link. */
export function openPrivacyChoices() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

/** Brings analytics into line with a choice. */
export function applyConsent(choice: ConsentChoice) {
  if (choice === "granted") {
    startPostHog()
  } else {
    stopPostHog()
    purgeTrackingStorage()
  }
}

export function PrivacyChoices() {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState<ConsentChoice | null>(null)

  useEffect(() => {
    const current = effectiveConsent()
    setChoice(current)
    applyConsent(current)

    const openHandler = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, openHandler)
    const unsub = onConsentChange(setChoice)
    return () => {
      window.removeEventListener(OPEN_EVENT, openHandler)
      unsub()
    }
  }, [])

  const choose = useCallback((next: ConsentChoice) => {
    applyConsent(next)
    writeConsent(next)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  if (!open || !analyticsConfigured()) return null

  const on = choice === "granted"

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your privacy choices"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1117] p-6 text-white shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold tracking-tight">Your privacy choices</h2>

        <p className="mt-3 text-sm leading-relaxed text-white/60">
          We use cookies to fix bugs and improve this site. You can turn that
          off here. Turning it off also clears what is already stored on this
          device.{" "}
          <Link
            href="/privacy"
            className="text-white/90 underline underline-offset-2 transition-colors hover:text-white"
            onClick={() => setOpen(false)}
          >
            Privacy Policy
          </Link>
        </p>

        <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="text-sm font-medium">Analytics</p>
            <p className="mt-1 text-xs leading-relaxed text-white/50">
              Which pages are visited and which links are clicked, so we can see
              what works and what is broken.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label="Analytics"
            onClick={() => choose(on ? "denied" : "granted")}
            className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
              on ? "bg-yellow-400" : "bg-white/20"
            }`}
          >
            <span
              className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
                on ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {gpcEnabled() && (
          <p className="mt-3 text-xs leading-relaxed text-white/40">
            Your browser sends a Global Privacy Control signal, so analytics is
            off unless you switch it on here.
          </p>
        )}

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-6 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/20"
        >
          Done
        </button>
      </div>
    </div>
  )
}
