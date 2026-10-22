"use client"

import type React from "react"

import { clearConsent } from "@/lib/consent"

/**
 * Clears the stored choice so the consent banner reappears. Used by the footer
 * link and from inside the privacy policy.
 */
export function CookieSettingsButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={clearConsent} className={className}>
      {children}
    </button>
  )
}
