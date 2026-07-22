import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get a Quote | Residency & Fellowship Scheduling | Scheduling Wizard",
  description:
    "Tell us about your program: department, schedule types, headcount, and rules. We'll send you a custom quote for done-for-you, ACGME-compliant scheduling.",
}

export default function GetAQuoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
