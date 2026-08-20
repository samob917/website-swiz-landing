import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meet the Team | Scheduling Wizard",
  description:
    "Meet the team behind Scheduling Wizard — expertise in mathematics, computer science, and logistical operations applied to physician scheduling.",
  openGraph: {
    title: "Meet the Team | Scheduling Wizard",
    description:
      "Meet the team behind Scheduling Wizard — expertise in mathematics, computer science, and logistical operations.",
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
