// DRAFT - pending legal review
//
// Scope: this public website only.
//
// Deliberately makes no claim that the data is anonymous. The rule is not to
// assert anonymity, which saying nothing satisfies; listing what is actually
// collected does the honest work without alarming anyone.
//
// Session replay is off (see lib/posthog-client.ts), so this page describes
// pageview analytics only.
//
// Analytics is opt-OUT (see lib/consent.ts). Nothing here should be phrased
// as conditional on the visitor agreeing first.
//
// Written to describe what the site actually does today (see
// instrumentation-client.ts and components/consent-banner.tsx). If the data
// practices change, update this page AND bump POLICY_VERSION in lib/consent.ts
// so every visitor is asked again.

import type { Metadata } from "next"

import { PrivacyChoicesLink } from "@/components/privacy-choices-link"

export const metadata: Metadata = {
  title: "Privacy Policy | Scheduling Wizard",
  description:
    "How Scheduling Wizard uses cookies and analytics on schedulingwiz.com, and how to change your choice.",
  alternates: { canonical: "/privacy" },
}

// Shown to visitors. Update this whenever the policy text changes;
// scripts/check-privacy-date.mjs warns on every build if it goes stale.
const LAST_UPDATED = "October 30, 2026"

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
            Last updated {LAST_UPDATED}
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
                Scheduling Wizard, Inc. builds physician schedules for graduate
                medical education programs, provider groups and private
                practices.
              </p>
              <p>This policy covers this website, schedulingwiz.com.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                What we collect, and why
              </h2>
              <p>
                We use{" "}
                <a
                  href="https://posthog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 hover:text-gray-700"
                >
                  PostHog
                </a>{" "}
                to record which pages you visit, which links and buttons you
                use, roughly where in the world you are, what browser and
                device you are using, and how quickly pages load for you. This
                runs unless you turn it off. We use
                it to fix bugs and improve the site. We do not sell it and we
                do not use it for advertising.
              </p>
              <p>
                If you fill in a form here, we receive what you type into it,
                and we keep it in our email for as long as we are in touch with
                you. Our &ldquo;schedule a call&rdquo; links go to Calendly,
                which collects whatever you enter when you book and is covered
                by its own privacy policy.
              </p>
              <p>
                PostHog processes analytics data on our behalf, under our
                instructions, and not for their own purposes, and we keep it
                only while it is useful. Form submissions reach us by email
                through EmailJS. The site is hosted by Vercel.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Your choice
              </h2>
              <p>
                Analytics is on by default. You can turn it off at any time
                using{" "}
                <PrivacyChoicesLink className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700">
                  your privacy choices
                </PrivacyChoicesLink>
                , here or in the footer of any page. Turning it off also clears
                the analytics cookies and storage already on your device.
              </p>
              <p>
                If your browser sends a Global Privacy Control signal, we treat
                that as turning analytics off and you do not need to do
                anything.
              </p>
              <p>
                Either way, our host keeps ordinary server logs, and anything
                you send us through a form still reaches us.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Contact
              </h2>
              <p>
                Questions about any of this, or want to see or delete what we
                hold about you? Email us and we will sort it out:{" "}
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
