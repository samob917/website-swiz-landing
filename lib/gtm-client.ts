// Google Tag Manager (GTM-WWVX2NW5), used for Google Ads.
//
// Loaded under the same opt-out choice as PostHog (see lib/consent.ts and
// components/privacy-choices.tsx): it starts only when the visitor has not
// opted out and their browser sends no Global Privacy Control signal.
//
// A script cannot be unloaded once it has run, so a visitor who opts out
// mid-visit gets a Google consent-mode "denied" update, which tells every
// Google tag in the container to stop using cookies and stop sending ad data,
// and purgeTrackingStorage() clears the _ga/_gcl cookies already set.
//
// Tags (Google Ads conversions, etc.) are configured inside the GTM container,
// not here. Anything added there that is not Google's own must be checked
// against /privacy first.

const GTM_ID = "GTM-WWVX2NW5"

type ConsentState = "granted" | "denied"

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

// GTM reads gtag commands as Arguments objects, not arrays, so this must
// push `arguments` itself.
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

function consent(state: ConsentState) {
  return {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  }
}

let loaded = false

/** Idempotent: safe to call on every page load and again from the dialog. */
export function startGTM() {
  if (typeof window === "undefined") return

  if (loaded) {
    // Visitor switched back on after opting out during this visit.
    gtag("consent", "update", consent("granted"))
    return
  }
  loaded = true

  gtag("consent", "default", consent("granted"))
  gtag("js", new Date())

  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
}

/** Stops Google's tags using cookies or ad data for a visitor who opts out. */
export function stopGTM() {
  if (!loaded) return
  gtag("consent", "update", consent("denied"))
}
