// Consent state for analytics on the public marketing site.
//
// Nothing that tracks may run before the visitor has explicitly accepted.
// PostHog is the only tracker on the site and is not initialised at all until
// then; see lib/posthog-client.ts.
//
// The _ga/_gcl patterns below are kept deliberately: a Google Ads tag ran on
// this site until October 2026, so returning visitors may still be carrying
// its cookies, and they should be cleared rather than left behind.

/**
 * Bumping this invalidates every stored choice and re-prompts everyone. Bump it
 * when we start collecting something new, not when we collect less: an existing
 * Accept already covers a narrower set of data, so removing a tracker does not
 * need fresh consent. Not displayed anywhere; LAST_UPDATED on /privacy is what
 * visitors see.
 */
export const POLICY_VERSION = 1

export type ConsentChoice = "granted" | "denied"

const STORAGE_KEY = `sw-consent-v${POLICY_VERSION}`
const CHANGE_EVENT = "sw-consent-change"

/** Reads the stored choice. `null` means the visitor has not decided yet. */
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === "granted" || stored === "denied" ? stored : null
  } catch {
    // Private mode or blocked storage: treat as undecided, which keeps us opted out.
    return null
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // If we cannot persist the choice we still honour it for this page view;
    // the banner simply reappears next time.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: choice }))
}

/** Re-opens the banner from the footer's "Cookie settings" link. */
export function clearConsent() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: null }))
}

export function onConsentChange(handler: (choice: ConsentChoice | null) => void) {
  const listener = (e: Event) => handler((e as CustomEvent).detail ?? null)
  window.addEventListener(CHANGE_EVENT, listener)
  return () => window.removeEventListener(CHANGE_EVENT, listener)
}

const isTrackingKey = (key: string) => {
  const k = key.toLowerCase()
  return k.startsWith("ph_") || k.includes("posthog") || k.startsWith("_gcl") || k.startsWith("_ga")
}

/**
 * Removes analytics storage left behind by the previous, consent-free setup so
 * a returning visitor who never agreed to anything does not keep carrying an
 * identifier around. Called on load whenever no choice is stored.
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
