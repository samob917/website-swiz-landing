import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meet the Team | Scheduling Wizard",
  description:
    "Meet the team behind Scheduling Wizard: operations, computer science and years of building physician schedules.",
  openGraph: {
    title: "Meet the Team | Scheduling Wizard",
    description:
      "Meet the team behind Scheduling Wizard: operations, computer science and years of building physician schedules.",
    images: ["/logo.png"],
  },
}

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
