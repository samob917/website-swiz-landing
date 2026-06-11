import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ACGME Duty Hour Compliance Checker: Free Audit for Residency Programs | Scheduling Wizard",
  description:
    "Worried your block, call, or clinic schedule violates ACGME's 2026 duty hour rules? Send us your schedule and we'll flag every 80-hour breach, rest period violation, and home call issue before your next review.",
}

export default function ComplianceCheckerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
