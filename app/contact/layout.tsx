import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Scheduling Wizard",
  description:
    "Book a meeting or send us a message. Tell us about your program and we'll show you how Scheduling Wizard takes scheduling off your plate.",
  openGraph: {
    title: "Contact Us | Scheduling Wizard",
    description:
      "Book a meeting or send us a message about your program's scheduling needs.",
    images: ["/logo.png"],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
