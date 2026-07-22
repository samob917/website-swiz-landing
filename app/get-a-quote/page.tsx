"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ArrowRight, Check, UploadCloud, FileText, CalendarClock, X } from "lucide-react"
import emailjs from "@emailjs/browser"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Stage = "form" | "success"

// EmailJS free plan caps the total request payload (form vars + base64-encoded
// attachments) at 50 KB. Paid plans bump that to 2 MB. We validate against the
// free-plan ceiling and capture a PostHog event when files exceed it — if the
// rate is high, that's the signal to swap to a real attachment-friendly backend.
const MAX_FILES_BYTES = 50 * 1024
const MAX_FILES_LABEL = "Up to 50 KB total"

const CALENDLY_URL = "https://calendly.com/zacdermody-schedulingwiz/new-meeting"

const PROGRAM_TYPES = ["Residency", "Fellowship", "Attending / APP"]

const SCHEDULE_TYPES = [
  "Block",
  "Call",
  "Clinic",
  "Elective",
  "Attending",
  "APP",
  "Other",
]

const CADENCE_OPTIONS = [
  "Once a year",
  "Twice a year",
  "Every 3 months",
  "Monthly",
  "Every block (~4 weeks)",
  "Not sure yet",
]

export default function GetAQuotePage() {
  const [stage, setStage] = useState<Stage>("form")
  const [programTypes, setProgramTypes] = useState<string[]>([])
  const [schedules, setSchedules] = useState<string[]>([])
  const [cadences, setCadences] = useState<Record<string, string>>({})
  const [fileNames, setFileNames] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLInputElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)

  const toggle = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
  ) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    )
  }

  const toggleSchedule = (value: string) => {
    if (schedules.includes(value)) {
      setSchedules(schedules.filter((v) => v !== value))
      setCadences(({ [value]: _removed, ...rest }) => rest)
    } else {
      setSchedules([...schedules, value])
    }
  }

  const acceptFiles = (files: FileList) => {
    const total = Array.from(files).reduce((sum, f) => sum + f.size, 0)
    if (total > MAX_FILES_BYTES) {
      const sizeMb = +(total / (1024 * 1024)).toFixed(2)
      posthog.capture("quote_files_too_large", {
        file_count: files.length,
        total_size_bytes: total,
        total_size_mb: sizeMb,
        limit_bytes: MAX_FILES_BYTES,
      })
      const sizeKb = Math.round(total / 1024)
      setErrorMsg(
        `Those files add up to ${sizeKb} KB. We can only accept up to 50 KB right now — try a smaller set, or email them to founders@schedulingwiz.com and we'll take it from there.`,
      )
      if (fileInputRef.current) fileInputRef.current.value = ""
      setFileNames([])
      return
    }
    setErrorMsg(null)
    setFileNames(Array.from(files).map((f) => f.name))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) acceptFiles(e.target.files)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (!e.dataTransfer.files?.length) return
    // Mirror the dropped files into the hidden input so EmailJS can attach them.
    if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files
    acceptFiles(e.dataTransfer.files)
  }

  const clearFiles = () => {
    if (fileInputRef.current) fileInputRef.current.value = ""
    setFileNames([])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const form = formRef.current
      if (!form) return

      // The shared EmailJS template renders {{subject}} and {{message}} (same
      // template the contact form uses), so fold every answer into those two
      // variables — no template changes needed for new fields.
      const data = new FormData(form)
      const field = (name: string) => (data.get(name) as string)?.trim() || "—"

      const cadenceLines = schedules
        .map((s) => `  - ${s}: ${cadences[s] || "not specified"}`)
        .join("\n")

      const summary = [
        `QUOTE REQUEST`,
        ``,
        `Contact: ${field("name")} <${field("email")}>`,
        `Hospital / institution: ${field("hospital")}`,
        `Department: ${field("department")}`,
        `Program type: ${programTypes.join(", ") || "—"}`,
        ``,
        `Schedules needed & cadence:`,
        cadenceLines || "  —",
        ``,
        `Residents / fellows on the schedule: ${field("num_residents")}`,
        `Total people incl. rotators: ${field("num_total")}`,
        `Rotating departments: ${field("rotating_departments")}`,
        ``,
        `Attached files: ${fileNames.length ? fileNames.join(", ") : "none"}`,
        ``,
        `Notes / schedule rules:`,
        field("notes"),
      ].join("\n")

      if (messageRef.current) messageRef.current.value = summary
      if (subjectRef.current)
        subjectRef.current.value = `Quote request — ${field("department")} @ ${field("hospital")}`

      const result = await emailjs.sendForm(
        "service_x9kkaxn",
        "template_pw6eygq",
        form,
        "gH4mRyjdPmvSERjtQ",
      )

      if (result.status === 200) {
        setStage("success")
      } else {
        setErrorMsg(`Failed to send (status ${result.status}). ${result.text || "Please try again."}`)
      }
    } catch (err) {
      console.error("EmailJS error:", err)
      const e = err as { text?: string; status?: number; message?: string }
      const status = e?.status ? ` (HTTP ${e.status})` : ""
      const detail = e?.text || e?.message || "Unknown error — check the browser console."
      setErrorMsg(`Couldn't send${status}: ${detail}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const chipClass = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "border-yellow-400 bg-yellow-400/15 text-yellow-400"
        : "border-white/15 bg-white/5 text-white/70 hover:border-yellow-400/50 hover:text-white"
    }`

  const labelClass =
    "block text-xs font-medium text-white/70 uppercase tracking-wider mb-2"
  const inputClass =
    "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg h-11"

  return (
    <section className="hero-background medical-pattern min-h-screen relative overflow-hidden pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: messaging */}
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl hero-text mb-6">
              <span className="hero-text-bold hero-glow">Get a </span>
              <span className="hero-text-bold text-yellow-400">Quote</span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed mb-12">
              Tell us about your program — the schedules you need, how many
              people are on them, and the rules they have to respect. We&apos;ll
              send back a custom estimate for building them for you.
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
                  title: "Tell us about your schedules.",
                  body:
                    "Department, program type, schedule types and how often each gets made, headcount — plus any rules or past schedules you can share.",
                },
                {
                  n: "02",
                  title: "We scope the work.",
                  body:
                    "A scheduling expert reviews your program's complexity — schedule types, cadence, rotators, constraints — and prices it accurately.",
                },
                {
                  n: "03",
                  title: "You get your quote by email.",
                  body:
                    "An estimated quote lands in your inbox, or a couple of follow-up questions if we need them. Prefer to talk it through? Book a meeting any time.",
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

            <div className="mt-10 max-w-md rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <p className="text-sm text-white/60 leading-relaxed">
                <span className="font-semibold text-white">
                  Your information stays private.
                </span>{" "}
                Keep or redact physician names on anything you upload — either
                way, your schedules, rules, and program details are never shared
                with anyone.
              </p>
            </div>
          </div>

          {/* Right: quote form */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {stage === "success" ? (
              <div className="flex flex-col items-center text-center gap-4 py-10">
                <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center">
                  <Check className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Thanks for the information!
                </h3>
                <p className="text-white/60 text-sm max-w-sm">
                  You&apos;ll receive an email soon from{" "}
                  <span className="text-yellow-400">founders@schedulingwiz.com</span>{" "}
                  with your estimated quote — or any follow-up questions we need
                  to price it accurately.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-yellow-400/50"
                >
                  <CalendarClock className="w-4 h-4 text-yellow-400" />
                  Want to talk sooner? Schedule a meeting
                </a>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Tell us about your program
                  </h2>
                  <span className="text-white/40 text-xs tracking-widest uppercase mt-2">
                    Free quote
                  </span>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {/* Hidden fields consumed by the shared EmailJS template */}
                  <input type="hidden" name="to_email" value="founders@schedulingwiz.com" />
                  <input type="hidden" name="subject" ref={subjectRef} />
                  <input type="hidden" name="message" ref={messageRef} />
                  <input
                    type="hidden"
                    name="program_types"
                    value={programTypes.join(", ")}
                  />
                  <input
                    type="hidden"
                    name="schedules_needed"
                    value={schedules
                      .map((s) => `${s} (${cadences[s] || "cadence not specified"})`)
                      .join(", ")}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gq-name" className={labelClass}>
                        Name <span className="text-yellow-400">*</span>
                      </label>
                      <Input
                        id="gq-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="gq-email" className={labelClass}>
                        Email <span className="text-yellow-400">*</span>
                      </label>
                      <Input
                        id="gq-email"
                        name="email"
                        type="email"
                        required
                        placeholder="your.email@hospital.org"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gq-hospital" className={labelClass}>
                        Hospital / medical center{" "}
                        <span className="text-yellow-400">*</span>
                      </label>
                      <Input
                        id="gq-hospital"
                        name="hospital"
                        type="text"
                        required
                        placeholder="e.g. Mass General"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="gq-department" className={labelClass}>
                        Department <span className="text-yellow-400">*</span>
                      </label>
                      <Input
                        id="gq-department"
                        name="department"
                        type="text"
                        required
                        placeholder="e.g. Internal Medicine"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <span className={labelClass}>Program type</span>
                    <div className="flex flex-wrap gap-2">
                      {PROGRAM_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggle(t, programTypes, setProgramTypes)}
                          disabled={isSubmitting}
                          className={chipClass(programTypes.includes(t))}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className={labelClass}>
                      Schedules you need <span className="text-yellow-400">*</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SCHEDULE_TYPES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSchedule(s)}
                          disabled={isSubmitting}
                          className={chipClass(schedules.includes(s))}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {schedules.length > 0 && (
                    <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                      <span className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
                        How often is each one made?
                      </span>
                      {schedules.map((s) => (
                        <div
                          key={s}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-sm text-white/80">{s}</span>
                          <select
                            value={cadences[s] || ""}
                            onChange={(e) =>
                              setCadences({ ...cadences, [s]: e.target.value })
                            }
                            disabled={isSubmitting}
                            className="h-9 rounded-lg border border-white/10 bg-white/5 px-2 text-sm text-white/80 focus:border-yellow-400/50 focus:outline-none [&>option]:bg-neutral-900"
                          >
                            <option value="" disabled>
                              Select cadence…
                            </option>
                            {CADENCE_OPTIONS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gq-residents" className={labelClass}>
                        Residents / fellows
                      </label>
                      <Input
                        id="gq-residents"
                        name="num_residents"
                        type="number"
                        min={0}
                        placeholder="e.g. 42"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="gq-total" className={labelClass}>
                        Total people incl. rotators
                      </label>
                      <Input
                        id="gq-total"
                        name="num_total"
                        type="number"
                        min={0}
                        placeholder="e.g. 65"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gq-rotating" className={labelClass}>
                      Rotating departments — roughly how many, and which?
                    </label>
                    <Input
                      id="gq-rotating"
                      name="rotating_departments"
                      type="text"
                      placeholder="e.g. 6 — neurology, cardiology, MICU, …"
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <span className={labelClass}>
                      Schedule rules & past schedules
                    </span>
                    <input
                      id="gq-files"
                      ref={fileInputRef}
                      type="file"
                      name="schedule"
                      multiple
                      accept=".ics,.csv,.tsv,.xlsx,.xls,.ods,.numbers,.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.heic"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {fileNames.length === 0 ? (
                      <label
                        htmlFor="gq-files"
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragging(true)
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
                          isDragging
                            ? "border-yellow-400 bg-yellow-400/5"
                            : "border-white/15 hover:border-yellow-400/50 hover:bg-white/5"
                        }`}
                      >
                        <UploadCloud className="w-7 h-7 text-yellow-400" />
                        <span className="text-white text-sm font-medium">
                          Drop rules docs or past schedules here
                        </span>
                        <span className="text-white/40 text-xs">
                          Excel, CSV, PDF, Word, or screenshots — or click to
                          browse
                        </span>
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/60">
                          {MAX_FILES_LABEL}
                        </span>
                      </label>
                    ) : (
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                        <span className="flex items-center gap-2 text-sm text-white/80 min-w-0">
                          <FileText className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                          <span className="truncate">
                            {fileNames.join(", ")}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={clearFiles}
                          className="ml-3 flex-shrink-0 text-white/40 hover:text-yellow-400 transition-colors"
                          aria-label="Remove files"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-white/40">
                      Optional. Keep or redact physician names — we never share
                      your schedules or rules with anyone.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="gq-notes" className={labelClass}>
                      Anything else?
                    </label>
                    <Textarea
                      id="gq-notes"
                      name="notes"
                      rows={3}
                      placeholder="Key scheduling rules, pain points, deadlines — anything that helps us scope your quote."
                      disabled={isSubmitting}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg resize-none"
                    />
                  </div>

                  {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

                  <Button
                    type="submit"
                    disabled={isSubmitting || schedules.length === 0}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold h-12 rounded-lg group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      "Sending…"
                    ) : (
                      <>
                        Get my quote
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-white/40">
                    {schedules.length === 0
                      ? "Pick at least one schedule type above to continue."
                      : "Estimated quote by email within one business day. No account required."}
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
