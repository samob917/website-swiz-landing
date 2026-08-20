import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customer Stories & Testimonials | Scheduling Wizard",
  description:
    "See what program directors, chief residents, and administrators at leading academic medical centers say about working with Scheduling Wizard.",
  openGraph: {
    title: "Customer Stories & Testimonials | Scheduling Wizard",
    description:
      "See what program directors, chief residents, and administrators say about working with Scheduling Wizard.",
    images: ["/logo.png"],
  },
}

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
