// Analytics consent for the public marketing site.
//
// Opt-out model: analytics runs by default, and visitors turn it off from
// "Your privacy choices" in the footer. This is lawful for US visitors, who
// are effectively all of ours, and matches what comparable sites do.
//
// It would NOT satisfy EU/UK law, which requires opt-in before anything is
// stored on a device. If real European traffic appears in the country
// breakdown, this needs geo-gating so those visitors get an opt-in prompt
// instead. Vercel supplies x-vercel-ip-country on every request, so the
// detection is available when it is needed.
//
// The _ga/_gcl patterns below are kept deliberately: a Google Ads tag ran on
// this site until October 2026, so returning visitors may still be carrying
// its cookies, and they should be cleared rather than left behind.

/**
 * Bumping this invalidates every stored choice. Bump it when we start
 * collecting something new, not when we collect less: an existing choice
 * already covers a narrower set of data. Not displayed anywhere;
 * LAST_UPDATED on /privacy is what visitors see.
 */
export const POLICY_VERSION = 1

export type ConsentChoice = "granted" | "denied"

const STORAGE_KEY = `sw-consent-v${POLICY_VERSION}`
const CHANGE_EVENT = "sw-consent-change"

/**
 * Global Privacy Control: a browser-level "do not sell or share my data"
 * signal that California has required honouring since March 2024. Treated as
 * a standing opt-out.
 */
export function gpcEnabled(): boolean {
  if (typeof navigator === "undefined") return false
  return (navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl === true
}

/** The visitor's explicit choice, or null if they have not made one. */
export function readStoredChoice(): ConsentChoice | null {
  if (typeof window === "undefined") return null
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === "granted" || stored === "denied" ? stored : null
  } catch {
    // Private mode or blocked storage: no stored choice.
    return null
  }
}

/**
 * What applies right now. An explicit choice wins, including over GPC, since
 * someone who switched analytics on in our own UI made a deliberate decision
 * about this site specifically. Otherwise GPC opts them out, and failing that
 * analytics is on.
 */
export function effectiveConsent(): ConsentChoice {
  const stored = readStoredChoice()
  if (stored) return stored
  return gpcEnabled() ? "denied" : "granted"
}

export function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // Unpersistable: honour it for this page view anyway. The visitor can set
    // it again next time.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: choice }))
}

export function onConsentChange(handler: (choice: ConsentChoice) => void) {
  const listener = (e: Event) => handler((e as CustomEvent).detail as ConsentChoice)
  window.addEventListener(CHANGE_EVENT, listener)
  return () => window.removeEventListener(CHANGE_EVENT, listener)
}

const isTrackingKey = (key: string) => {
  const k = key.toLowerCase()
  return k.startsWith("ph_") || k.includes("posthog") || k.startsWith("_gcl") || k.startsWith("_ga")
}

/**
 * Clears analytics storage from this device. Run when someone opts out, so
 * that turning analytics off also removes the identifier already set rather
 * than merely stopping new collection.
 */
export function purgeTrackingStorage() {
  if (typeof window === "undefined") return

  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      for (const key of Object.keys(store)) {
        if (isTrackingKey(key)) store.removeItem(key)
      }
    } catch {
      /* storage unavailable */
    }
  }

  try {
    // Expire on the exact host and on the registrable domain: these are set on
    // a leading-dot domain that a host-only delete would miss.
    const host = window.location.hostname
    const parts = host.split(".")
    const domains = [undefined, host, parts.length > 2 ? `.${parts.slice(-2).join(".")}` : `.${host}`]

    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0]?.trim()
      if (!name || !isTrackingKey(name)) continue
      for (const domain of domains) {
        document.cookie =
          `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
          (domain ? `; domain=${domain}` : "")
      }
    }
  } catch {
    /* document unavailable */
  }
}
