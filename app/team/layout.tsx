import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meet the Team | Scheduling Wizard",
  description:
    "Meet the team behind Scheduling Wizard: expertise in mathematics, optimization, computer science and operations.",
  openGraph: {
    title: "Meet the Team | Scheduling Wizard",
    description:
      "Meet the team behind Scheduling Wizard: expertise in mathematics, optimization, computer science and operations.",
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
