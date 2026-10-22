// DRAFT - pending legal review
//
// Scope: this public website only.
//
// Written to describe what the site actually does today (see
// instrumentation-client.ts and components/consent-banner.tsx). If the data
// practices change, update this page AND bump POLICY_VERSION in lib/consent.ts
// so every visitor is asked again.

import type { Metadata } from "next"

import { POLICY_VERSION } from "@/lib/consent"
import { CookieSettingsButton } from "@/components/cookie-settings-button"

export const metadata: Metadata = {
  title: "Privacy Policy | Scheduling Wizard",
  description:
    "How Scheduling Wizard uses cookies, analytics and session recording on schedulingwiz.com, and how to change your choice.",
  alternates: { canonical: "/privacy" },
}

const LAST_UPDATED = "October 22, 2026"

export default function PrivacyPage() {
  return (
    <>
      <section className="hero-background medical-pattern pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="hero-text text-4xl text-white sm:text-5xl">
            <span className="hero-text-bold hero-glow">Privacy </span>
            <span className="hero-text-bold text-yellow-400">Policy</span>
          </h1>
          <p className="mt-4 text-sm text-white/50">
            Last updated {LAST_UPDATED} &middot; Version {POLICY_VERSION}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-base leading-relaxed text-gray-600">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Who we are
              </h2>
              <p>
                Scheduling Wizard, Inc. builds physician and resident schedules
                for graduate medical education programs, provider groups and
                private practices.
              </p>
              <p>This policy covers this website, schedulingwiz.com.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                What we collect, and why
              </h2>
              <p>
                If you accept cookies, we use{" "}
                <a
                  href="https://posthog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 hover:text-gray-700"
                >
                  PostHog
                </a>{" "}
                to record which pages you visit, which links and buttons you
                use, roughly where in the world you are, and what browser and
                device you are using. We use it to fix bugs and improve the
                site. We do not sell it and we do not use it for advertising.
              </p>
              <p>
                If you fill in a form here, we receive what you type into it.
              </p>
              <p>
                We do not describe any of this as anonymous: a browsing history
                and a session recording can identify a person.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Session recordings
              </h2>
              <p>
                PostHog also records your visit so we can play it back. Every
                form input and every piece of text is masked before the
                recording leaves your browser, so it shows layout and clicks
                rather than anything you typed. Recordings are deleted after
                about 30 days.
              </p>
              <p>
                PostHog processes this data on our behalf, under our
                instructions, and not for their own purposes. Form submissions
                reach us by email through EmailJS.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Your choice
              </h2>
              <p>
                Nothing is collected until you press Accept. If you decline,
                analytics and session recording stay off and no identifier is
                stored on your device. You can change your mind at any time
                using{" "}
                <CookieSettingsButton className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700">
                  cookie settings
                </CookieSettingsButton>
                , here or in the footer of any page. Switching to decline also
                clears what is already stored.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Contact
              </h2>
              <p>
                Questions, or a request to see or delete what we hold about
                you:{" "}
                <a
                  href="mailto:founders@schedulingwiz.com"
                  className="text-gray-900 underline underline-offset-2 hover:text-gray-700"
                >
                  founders@schedulingwiz.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
