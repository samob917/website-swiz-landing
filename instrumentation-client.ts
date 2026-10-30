import { effectiveConsent, purgeTrackingStorage } from "@/lib/consent"
import { startPostHog } from "@/lib/posthog-client"

// Opt-out model: analytics runs unless the visitor has turned it off, or their
// browser sends a Global Privacy Control signal. See lib/consent.ts.
if (effectiveConsent() === "granted") {
  startPostHog()
} else {
  // Opted out: make sure nothing is left on the device from before.
  purgeTrackingStorage()
}
