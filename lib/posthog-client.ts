import posthog from "posthog-js"

// PostHog is initialised only once the visitor has accepted.
//
// PostHog's own guidance is to always load the SDK and gate it with
// opt_out_capturing_by_default. We deliberately do not do that: even fully
// opted out, init() still fetches remote config (/array/<key>/config.js) and
// hits /flags/, which exposes the visitor's IP. Neither call is suppressible
// (advanced_disable_flags stops /flags but not the config fetch), and the
// requirement here is that nothing fires before Accept. So we defer init.
//
// Option names follow PostHog's current docs:
//   https://posthog.com/docs/libraries/js/config
//   https://posthog.com/docs/session-replay/privacy
//   https://posthog.com/docs/session-replay/how-to-control-which-sessions-you-record

// PostHog projects we have been disconnected from. A key listed here is
// refused even if it is still set in the hosting environment, so retiring a
// vendor does not depend on someone remembering to clear an env var.
//
// phc_n5m3qT... was a workspace created by an outside contractor
// (jaz@bluejay.finance, May 2026) and administered by them. We are no longer
// sending our visitors' data to it.
const RETIRED_PROJECT_KEYS = [
  "phc_n5m3qThwZT4XxEV5Fr5acXWFSTiQH7LGdnGUcM39JG5q",
]

/**
 * True when a usable, non-retired PostHog key is configured. When this is
 * false nothing on the site stores anything on a visitor's device, so the
 * consent banner has nothing to ask about and does not render.
 */
export function analyticsConfigured() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  return Boolean(key) && !RETIRED_PROJECT_KEYS.includes(key as string)
}

let started = false

/** Idempotent: safe to call on every page load and again from the banner. */
export function startPostHog() {
  if (started) return
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return
  if (RETIRED_PROJECT_KEYS.includes(key)) {
    console.warn(
      "[analytics] NEXT_PUBLIC_POSTHOG_KEY is set to a retired project. " +
        "PostHog will not start. Set the key for the current project to re-enable."
    )
    return
  }
  started = true

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2026-01-30",

    // We never call identify() on the marketing site, so no person profiles.
    person_profiles: "identified_only",

    // Session replay is off. We only need pageviews, top pages, referrers and
    // autocapture clicks, none of which require recording anyone's screen.
    // Replay can also be switched on server-side in PostHog project settings,
    // so this client flag is what actually guarantees it stays off.
    disable_session_recording: true,

    session_recording: {
      // Belt and braces: if replay is ever deliberately re-enabled, it starts
      // from a masked configuration rather than PostHog's defaults.
      maskAllInputs: true,
      maskTextSelector: "*",
    },
  })
}

/** Stops capture for a visitor who changes their mind. */
export function stopPostHog() {
  if (!started) return
  try {
    posthog.opt_out_capturing()
  } catch {
    /* SDK not in a state to stop; the storage purge still runs */
  }
}
