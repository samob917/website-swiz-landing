// components/GoogleAnalytics.tsx
import Script from 'next/script'

// Google Tag Manager (GTM-WWVX2NW5). Google Ads and any other tags are
// configured inside the GTM container, not hard-coded here.
const GoogleAnalytics = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-WWVX2NW5"
      />
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
    </>
  )
}

export default GoogleAnalytics
