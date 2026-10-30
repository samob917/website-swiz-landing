"use client"

import type React from "react"

import { openPrivacyChoices } from "@/components/privacy-choices"

/** Footer link that opens the privacy choices dialog. */
export function PrivacyChoicesLink({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={openPrivacyChoices} className={className}>
      {children}
    </button>
  )
}
