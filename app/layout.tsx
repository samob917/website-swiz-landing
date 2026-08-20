import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://schedulingwiz.com"),
  title: "Scheduling Wizard | Physician & Residency Scheduling Service",
  description:
    "Done-for-you physician scheduling. We build fair, ACGME-compliant block, clinic, and call schedules for GME programs, provider groups, and private practices.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    siteName: "Scheduling Wizard",
    type: "website",
    title: "Scheduling Wizard | Physician & Residency Scheduling Service",
    description:
      "Done-for-you physician scheduling. We build fair, ACGME-compliant block, clinic, and call schedules for GME programs, provider groups, and private practices.",
    images: ["/logo.png"],
  },
  generator: 'v0.dev'
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
        <main className="flex-1">
          <GoogleAnalytics />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
