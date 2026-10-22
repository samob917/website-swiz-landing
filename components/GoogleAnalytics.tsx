// components/GoogleAnalytics.tsx
//
// Google Ads' gtag has no opt-out API, so the only way to keep it from firing
// before consent is to not put the script on the page. These <Script> tags are
// therefore rendered only once the visitor has pressed Accept.
"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

import { onConsentChange, readConsent } from "@/lib/consent"

const GoogleAnalytics = () => {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    setGranted(readConsent() === "granted")
    return onConsentChange((choice) => setGranted(choice === "granted"))
  }, [])

  if (!granted) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17595487537"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17595487537');
          `,
        }}
      />
    </>
  )
}

export default GoogleAnalytics
