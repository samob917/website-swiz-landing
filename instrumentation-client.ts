import { purgeTrackingStorage, readConsent } from "@/lib/consent"
import { startPostHog } from "@/lib/posthog-client"

// Consent-first: PostHog is only initialised for a visitor who has already
// accepted. Everyone else gets no PostHog at all - not even the remote-config
// or /flags/ requests that an opted-out init would still make. See
// lib/posthog-client.ts for why init is deferred rather than opted out.
if (readConsent() === "granted") {
  startPostHog()
} else {
  // Undecided or declined: clear any ph_*/gtag storage left behind by the
  // previous consent-free setup, so nobody keeps carrying an old identifier.
  purgeTrackingStorage()
}
