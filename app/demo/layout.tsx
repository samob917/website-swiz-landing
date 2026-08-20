import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo — Physician Scheduling in Action | Scheduling Wizard",
  description:
    "Watch how Scheduling Wizard builds block, clinic, and call schedules for residency and fellowship programs. See a real schedule built in minutes.",
  openGraph: {
    title: "Demo — Physician Scheduling in Action | Scheduling Wizard",
    description:
      "Watch how Scheduling Wizard builds block, clinic, and call schedules for residency and fellowship programs.",
    images: ["/logo.png"],
  },
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
