"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ArrowRight, Check } from "lucide-react"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ROLES = [
  "Program Director / Associate PD",
  "Chief Resident / Chief Fellow",
  "Program Coordinator / GME Admin",
  "Department Chair",
  "Hospital Operations Leader",
  "Other",
]

const PROGRAM_SIZES = [
  "1–15 residents",
  "16–30 residents",
  "31–60 residents",
  "61–100 residents",
  "100+ residents",
]

export default function ComplianceCheckerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [role, setRole] = useState("")
  const [programSize, setProgramSize] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      if (!formRef.current) return

      const result = await emailjs.sendForm(
        "service_x9kkaxn",
        "template_pw6eygq",
        formRef.current,
        "gH4mRyjdPmvSERjtQ",
      )

      if (result.status === 200) {
        setIsSuccess(true)
        formRef.current.reset()
        setRole("")
        setProgramSize("")
      } else {
        setErrorMsg("Failed to send. Please try again.")
      }
    } catch (err) {
      console.error("EmailJS error:", err)
      setErrorMsg("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="hero-background medical-pattern min-h-screen relative overflow-hidden pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: messaging */}
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl hero-text mb-6">
              <span className="hero-text-bold hero-glow">Compliance </span>
              <span className="hero-text-bold text-yellow-400">Checker.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed mb-12">
              Worried your schedule won&apos;t hold up to ACGME review? Send us
              your block, call, or clinic schedule and we&apos;ll flag every
              duty-hour issue before it becomes a citation.
            </p>

            <div className="mb-8">
              <span className="text-white/60 text-xs font-medium uppercase tracking-[0.2em]">
                How it works
              </span>
            </div>

            <div className="space-y-7">
              {[
                {
                  n: "01",
                  title: "Book your audit.",
                  body:
                    "Fill out the form. We'll reply within one business day with a secure link to share your current block, call, or clinic schedule — .ics, CSV, Excel, even a screenshot.",
                },
                {
                  n: "02",
                  title: "We flag the violations.",
                  body:
                    "We check every shift against ACGME duty-hour rules for your specialty — 80-hour breaches, missed days off, short rest, call frequency — and pull out the exact dates and residents at risk.",
                },
                {
                  n: "03",
                  title: "Decide how to fix it.",
                  body:
                    "Get a clean report you can act on, or have us rebuild the block fully compliant. You decide on the call.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-yellow-400/40 flex items-center justify-center text-yellow-400 text-sm font-medium">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed max-w-md">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {isSuccess ? (
              <div className="flex flex-col items-center text-center gap-4 py-10">
                <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center">
                  <Check className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Thank you!</h3>
                <p className="text-white/60 text-sm max-w-sm">
                  We&apos;ve got your request and will reply within one business
                  day at{" "}
                  <span className="text-yellow-400">founders@schedulingwiz.com</span>.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Book the call
                  </h2>
                  <span className="text-white/40 text-xs tracking-widest uppercase mt-2">
                    60 sec
                  </span>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {/* hidden recipient field for EmailJS template */}
                  <input
                    type="hidden"
                    name="to_email"
                    value="founders@schedulingwiz.com"
                  />
                  <input
                    type="hidden"
                    name="subject"
                    value="Compliance Checker request"
                  />

                  <div>
                    <label
                      htmlFor="cc-name"
                      className="block text-xs font-medium text-white/70 mb-2"
                    >
                      Name <span className="text-yellow-400">*</span>
                    </label>
                    <Input
                      id="cc-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      disabled={isSubmitting}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg h-11"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cc-email"
                      className="block text-xs font-medium text-white/70 mb-2"
                    >
                      Work email <span className="text-yellow-400">*</span>
                    </label>
                    <Input
                      id="cc-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@hospital.edu"
                      disabled={isSubmitting}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg h-11"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cc-company"
                      className="block text-xs font-medium text-white/70 mb-2"
                    >
                      Institution / Program <span className="text-yellow-400">*</span>
                    </label>
                    <Input
                      id="cc-company"
                      name="company"
                      type="text"
                      required
                      placeholder="e.g. Johns Hopkins Neurocritical Care"
                      disabled={isSubmitting}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg h-11"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="cc-role"
                        className="block text-xs font-medium text-white/70 mb-2"
                      >
                        Your role <span className="text-yellow-400">*</span>
                      </label>
                      <Select
                        name="role"
                        value={role}
                        onValueChange={setRole}
                        required
                      >
                        <SelectTrigger
                          id="cc-role"
                          className="bg-white/5 border-white/10 text-white data-[placeholder]:text-white/30 focus:border-yellow-400/50 rounded-lg h-11"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label
                        htmlFor="cc-size"
                        className="block text-xs font-medium text-white/70 mb-2"
                      >
                        Program size{" "}
                        <span className="text-white/40">(optional)</span>
                      </label>
                      <Select
                        name="programSize"
                        value={programSize}
                        onValueChange={setProgramSize}
                      >
                        <SelectTrigger
                          id="cc-size"
                          className="bg-white/5 border-white/10 text-white data-[placeholder]:text-white/30 focus:border-yellow-400/50 rounded-lg h-11"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROGRAM_SIZES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cc-message"
                      className="block text-xs font-medium text-white/70 mb-2"
                    >
                      What&apos;s your biggest scheduling or compliance challenge?
                    </label>
                    <Textarea
                      id="cc-message"
                      name="message"
                      rows={4}
                      placeholder="e.g. We keep hitting 80-hour violations on night float. Or: chiefs spend a month every year rebuilding the block by hand."
                      disabled={isSubmitting}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold h-12 rounded-lg group"
                  >
                    {isSubmitting ? (
                      "Sending…"
                    ) : (
                      <>
                        Book a call
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-white/40">
                    Reply within one business day.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
