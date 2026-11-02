import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PrivacyChoices } from "@/components/privacy-choices"
import { ScheduleACall } from "@/components/schedule-a-call"
import { ScheduleACallFloat } from "@/components/schedule-a-call-float"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://schedulingwiz.com"),
  title: "Physician & Residency Scheduling | Scheduling Wizard",
  description:
    "The first effective physician scheduling service. We build equitable block, clinic and call schedules for GME programs and provider groups.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    siteName: "Scheduling Wizard",
    type: "website",
    title: "Physician & Residency Scheduling | Scheduling Wizard",
    description:
      "The first effective physician scheduling service. We build equitable block, clinic and call schedules for GME programs and provider groups.",
    images: ["/logo.png"],
  },
  // Google Search Console, HTML-tag method. The same account also owns a
  // DNS TXT record at the registrar; either one verifies.
  verification: {
    google: "0A0tK0f6gUvfr20_CCjC8Jh5gj9PuvSP2izYLH_itpU",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Scheduling Wizard",
  url: "https://schedulingwiz.com",
  logo: "https://schedulingwiz.com/logo.png",
  description:
    "Managed physician scheduling service for GME programs, provider groups and private practices.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navigation />
        <ScheduleACallFloat />
        <main className="flex-1">{children}</main>
        <ScheduleACall />
        <Footer />
        <PrivacyChoices />
      </body>
    </html>
  )
}
