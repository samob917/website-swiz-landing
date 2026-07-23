"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ArrowRight, Check, UploadCloud, FileText, CalendarClock, ListChecks, MessageSquareText, Plus, X } from "lucide-react"
import emailjs from "@emailjs/browser"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Stage = "form" | "success"

type Mode = "" | "select" | "describe"

type ScheduleRow = {
  dept: string
  who: string
  type: string
  otherName: string
  cadence: string
  people: string
}

// EmailJS free plan caps the total request payload (form vars + base64-encoded
// attachments) at 50 KB. Paid plans bump that to 2 MB. We validate against the
// free-plan ceiling and capture a PostHog event when files exceed it. If the
// rate is high, that's the signal to swap to a real attachment-friendly backend.
const MAX_FILES_BYTES = 50 * 1024
const MAX_FILES_LABEL = "Up to 50 KB total"

const CALENDLY_URL = "https://calendly.com/zacdermody-schedulingwiz/new-meeting"

const SETTINGS = [
  "Single department",
  "Multiple departments",
  "Enterprise (hospital-wide)",
  "Private practice group",
]

const WHO_OPTIONS = ["Residents", "Fellows", "Attendings", "APPs", "Mixed"]

const TYPE_OPTIONS = ["Block", "Call", "Clinic", "Elective", "Other"]

const CADENCE_OPTIONS = [
  "Once a year",
  "Twice a year",
  "Every 3 months",
  "Monthly",
  "Every block (~4 weeks)",
  "Not sure yet",
]

const DESCRIBE_PLACEHOLDERS: Record<string, string> = {
  "Single department":
    "e.g. We have about 60 residents including rotators. We need the resident block schedule built once a year, the call schedule monthly, and a clinic schedule twice a year.",
  "Multiple departments":
    "e.g. Neurology Residency: block yearly and call monthly for about 40 residents. NeuroICU Fellowship: call every 6 months for 12 fellows. EM Attendings: clinic quarterly for 25.",
  "Enterprise (hospital-wide)":
    "e.g. 12 departments, about 300 people. Around 20 schedules in total: most made once a year, 3 made monthly, 2 every 6 months, a mix of block, call, and clinic.",
  "Private practice group":
    "e.g. Our group has 25 physicians plus part-timers. Call schedule made monthly, clinic schedule every quarter, holiday coverage once a year.",
}

const emptyRow = (): ScheduleRow => ({
  dept: "",
  who: "",
  type: "",
  otherName: "",
  cadence: "",
  people: "",
})

export default function GetAQuotePage() {
  const [stage, setStage] = useState<Stage>("form")
  const [setting, setSetting] = useState("")
  const [mode, setMode] = useState<Mode>("")
  const [rows, setRows] = useState<ScheduleRow[]>([emptyRow()])
  const [describe, setDescribe] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLInputElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)

  const multiDept =
    setting === "Multiple departments" || setting === "Enterprise (hospital-wide)"

  const deptLabel =
    setting === "Private practice group"
      ? "Group / specialty"
      : multiDept
        ? "Department(s)"
        : "Department"

  const deptPlaceholder =
    setting === "Private practice group"
      ? "e.g. Radiology"
      : setting === "Enterprise (hospital-wide)"
        ? "e.g. all GME programs, or list them"
        : multiDept
          ? "e.g. Neurology Residency, NeuroICU Fellowship, EM Residency and Attendings"
          : "e.g. Internal Medicine Residency"

  const completeRows = rows.filter(
    (r) => r.who && r.type && (r.type !== "Other" || r.otherName.trim()),
  )
  const hasSchedules =
    mode === "select"
      ? completeRows.length > 0
      : mode === "describe"
        ? describe.trim().length > 0
        : false

  const rowLabel = (r: ScheduleRow) =>
    `${r.who} ${r.type === "Other" ? r.otherName.trim() : r.type}`

  const updateRow = (index: number, patch: Partial<ScheduleRow>) =>
    setRows(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))

  const removeRow = (index: number) => {
    const next = rows.filter((_, i) => i !== index)
    setRows(next.length ? next : [emptyRow()])
  }

  const addRow = () => setRows([...rows, emptyRow()])

  // The hidden input is what EmailJS reads at submit time, so keep its
  // FileList mirrored to the managed files state after every add/rename/remove.
  const syncInput = (list: File[]) => {
    const dt = new DataTransfer()
    list.forEach((f) => dt.items.add(f))
    if (fileInputRef.current) fileInputRef.current.files = dt.files
  }

  const addFiles = (incoming: FileList) => {
    const merged = [...files, ...Array.from(incoming)]
    const total = merged.reduce((sum, f) => sum + f.size, 0)
    if (total > MAX_FILES_BYTES) {
      const sizeMb = +(total / (1024 * 1024)).toFixed(2)
      posthog.capture("quote_files_too_large", {
        file_count: merged.length,
        total_size_bytes: total,
        total_size_mb: sizeMb,
        limit_bytes: MAX_FILES_BYTES,
      })
      const sizeKb = Math.round(total / 1024)
      setErrorMsg(
        `Those files add up to ${sizeKb} KB. We can only accept up to 50 KB right now. Try a smaller set, or email them to founders@schedulingwiz.com and we'll take it from there.`,
      )
      syncInput(files)
      return
    }
    setErrorMsg(null)
    setFiles(merged)
    syncInput(merged)
  }

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index)
    setFiles(next)
    syncInput(next)
  }

  const renameFile = (index: number, newName: string) => {
    const trimmed = newName.trim()
    const original = files[index]
    if (!original || !trimmed || trimmed === original.name) return
    // Preserve the original extension when the new name doesn't include one.
    const dot = original.name.lastIndexOf(".")
    const ext = dot > 0 ? original.name.slice(dot) : ""
    const finalName =
      trimmed.includes(".") || !ext ? trimmed : `${trimmed}${ext}`
    const renamed = new File([original], finalName, { type: original.type })
    const next = files.map((f, i) => (i === index ? renamed : f))
    setFiles(next)
    syncInput(next)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
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
      // variables. No template changes needed for new fields.
      const data = new FormData(form)
      const field = (name: string) => (data.get(name) as string)?.trim() || "-"

      const scheduleLines =
        mode === "select"
          ? completeRows.map(
              (r) =>
                `  - ${r.dept.trim() ? `${r.dept.trim()}: ` : ""}${rowLabel(r)}: ${
                  r.cadence || "cadence not specified"
                }${r.people.trim() ? `, ~${r.people.trim()} people incl. rotators` : ""}`,
            )
          : []

      const summary = [
        `QUOTE REQUEST`,
        ``,
        `Contact: ${field("name")} <${field("email")}>`,
        `Setting: ${setting || "-"}`,
        `Hospital / institution: ${field("hospital")}`,
        `${deptLabel}: ${field("departments")}`,
        ``,
        `Schedules requested${mode === "describe" ? " (in their own words)" : ""}:`,
        mode === "select" ? scheduleLines.join("\n") || "  -" : describe.trim() || "-",
        ``,
        `Budget expectations: ${field("budget")}`,
        ``,
        `Attached files: ${files.length ? files.map((f) => f.name).join(", ") : "none"}`,
        ``,
        `Notes:`,
        field("notes"),
      ].join("\n")

      if (messageRef.current) messageRef.current.value = summary
      if (subjectRef.current)
        subjectRef.current.value = `Quote request - ${field("departments")} @ ${field("hospital")}`

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
      const detail = e?.text || e?.message || "Unknown error. Check the browser console."
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
  const selectClass =
    "h-10 rounded-lg border border-white/10 bg-white/5 px-2 text-sm focus:border-yellow-400/50 focus:outline-none [&>option]:bg-neutral-900"

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

            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
              Tell us about your schedules. We&apos;ll scope the work and email
              you a custom estimate for building your schedules.
            </p>
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
                  with your estimated quote, or any follow-up questions we need
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
                  <input type="hidden" name="setting" value={setting} />

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
                    <span className={labelClass}>
                      This is for a… <span className="text-yellow-400">*</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SETTINGS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSetting(setting === s ? "" : s)}
                          disabled={isSubmitting}
                          className={chipClass(setting === s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {setting && (
                    <>
                      <div>
                        <label htmlFor="gq-departments" className={labelClass}>
                          {deptLabel} <span className="text-yellow-400">*</span>
                        </label>
                        <Input
                          id="gq-departments"
                          name="departments"
                          type="text"
                          required
                          placeholder={deptPlaceholder}
                          disabled={isSubmitting}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <span className={labelClass}>
                          Schedules you need{" "}
                          <span className="text-yellow-400">*</span>
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setMode("select")}
                            disabled={isSubmitting}
                            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                              mode === "select"
                                ? "border-yellow-400 bg-yellow-400/15 text-yellow-400"
                                : "border-white/15 bg-white/5 text-white/70 hover:border-yellow-400/50 hover:text-white"
                            }`}
                          >
                            <ListChecks className="w-4 h-4" />
                            Pick from options
                          </button>
                          <button
                            type="button"
                            onClick={() => setMode("describe")}
                            disabled={isSubmitting}
                            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                              mode === "describe"
                                ? "border-yellow-400 bg-yellow-400/15 text-yellow-400"
                                : "border-white/15 bg-white/5 text-white/70 hover:border-yellow-400/50 hover:text-white"
                            }`}
                          >
                            <MessageSquareText className="w-4 h-4" />
                            Describe it yourself
                          </button>
                        </div>
                      </div>

                      {mode === "select" && (
                        <div className="space-y-2">
                          {rows.map((r, i) => (
                            <div
                              key={i}
                              className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2"
                            >
                              {multiDept && (
                                <Input
                                  type="text"
                                  value={r.dept}
                                  onChange={(e) =>
                                    updateRow(i, { dept: e.target.value })
                                  }
                                  placeholder="Department, e.g. Neurology"
                                  disabled={isSubmitting}
                                  className={`${inputClass} h-9`}
                                />
                              )}
                              <div className="flex items-center gap-2">
                                <select
                                  value={r.who}
                                  onChange={(e) =>
                                    updateRow(i, { who: e.target.value })
                                  }
                                  disabled={isSubmitting}
                                  className={`${selectClass} flex-1 min-w-0 ${r.who ? "text-white/90" : "text-white/40"}`}
                                  aria-label="Who is this schedule for?"
                                >
                                  <option value="" disabled>
                                    Who is it for?
                                  </option>
                                  {WHO_OPTIONS.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={r.type}
                                  onChange={(e) =>
                                    updateRow(i, { type: e.target.value })
                                  }
                                  disabled={isSubmitting}
                                  className={`${selectClass} flex-1 min-w-0 ${r.type ? "text-white/90" : "text-white/40"}`}
                                  aria-label="Schedule type"
                                >
                                  <option value="" disabled>
                                    Schedule type?
                                  </option>
                                  {TYPE_OPTIONS.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={r.cadence}
                                  onChange={(e) =>
                                    updateRow(i, { cadence: e.target.value })
                                  }
                                  disabled={isSubmitting}
                                  className={`${selectClass} flex-1 min-w-0 ${r.cadence ? "text-white/90" : "text-white/40"}`}
                                  aria-label="How often is it made?"
                                >
                                  <option value="" disabled>
                                    Made how often?
                                  </option>
                                  {CADENCE_OPTIONS.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => removeRow(i)}
                                  disabled={isSubmitting}
                                  className="flex-shrink-0 text-white/40 hover:text-yellow-400 transition-colors"
                                  aria-label="Remove schedule"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              {r.type === "Other" && (
                                <Input
                                  type="text"
                                  value={r.otherName}
                                  onChange={(e) =>
                                    updateRow(i, { otherName: e.target.value })
                                  }
                                  placeholder="Name this schedule, e.g. Jeopardy"
                                  disabled={isSubmitting}
                                  className={`${inputClass} h-9`}
                                />
                              )}
                              <Input
                                type="number"
                                min={0}
                                value={r.people}
                                onChange={(e) =>
                                  updateRow(i, { people: e.target.value })
                                }
                                placeholder="Estimated people on it, incl. rotators, e.g. 60"
                                disabled={isSubmitting}
                                className={`${inputClass} h-9`}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addRow}
                            disabled={isSubmitting}
                            className={`${chipClass(false)} inline-flex items-center gap-1`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add another schedule
                          </button>
                        </div>
                      )}

                      {mode === "describe" && (
                        <div>
                          <Textarea
                            id="gq-describe"
                            name="schedules_description"
                            rows={4}
                            value={describe}
                            onChange={(e) => setDescribe(e.target.value)}
                            placeholder={DESCRIBE_PLACEHOLDERS[setting]}
                            disabled={isSubmitting}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg resize-none"
                          />
                          <p className="mt-2 text-xs text-white/40">
                            No structure needed. As much detail as you can
                            helps: which schedules, how often each is made, and
                            roughly how many people are on each.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {setting && (
                    <>
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
                        {files.length > 0 && (
                          <div className="space-y-2 mb-2">
                            {files.map((f, i) => (
                              <div
                                key={`${i}-${f.name}`}
                                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                              >
                                <FileText className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                                <Input
                                  type="text"
                                  defaultValue={f.name}
                                  onBlur={(e) => renameFile(i, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      e.currentTarget.blur()
                                    }
                                  }}
                                  disabled={isSubmitting}
                                  aria-label="Rename file"
                                  title="Click to rename"
                                  className="h-8 flex-1 min-w-0 bg-transparent border-transparent hover:border-white/10 focus:border-yellow-400/50 focus:ring-0 rounded-md text-sm text-white/80 px-2"
                                />
                                <span className="flex-shrink-0 text-[10px] text-white/30">
                                  {Math.max(1, Math.round(f.size / 1024))} KB
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeFile(i)}
                                  disabled={isSubmitting}
                                  className="flex-shrink-0 text-white/40 hover:text-yellow-400 transition-colors"
                                  aria-label={`Remove ${f.name}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <label
                          htmlFor="gq-files"
                          onDragOver={(e) => {
                            e.preventDefault()
                            setIsDragging(true)
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          className={`flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-dashed text-center transition-colors ${
                            files.length > 0 ? "px-4 py-4" : "px-6 py-8"
                          } ${
                            isDragging
                              ? "border-yellow-400 bg-yellow-400/5"
                              : "border-white/15 hover:border-yellow-400/50 hover:bg-white/5"
                          }`}
                        >
                          <UploadCloud
                            className={`text-yellow-400 ${files.length > 0 ? "w-5 h-5" : "w-7 h-7"}`}
                          />
                          <span className="text-white text-sm font-medium">
                            {files.length > 0
                              ? "Add more files"
                              : "Drop rules and/or past schedules here"}
                          </span>
                          {files.length === 0 && (
                            <span className="text-white/40 text-xs">
                              So we can understand the schedule and its
                              complexity. Excel, CSV, PDF, Word, or screenshots.
                              Click to browse.
                            </span>
                          )}
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/60">
                            {MAX_FILES_LABEL}
                          </span>
                        </label>
                        <p className="mt-2 text-xs text-white/40">
                          Optional. Keep or redact physician names. We never
                          share your schedules or rules with anyone.
                        </p>
                      </div>

                      <div>
                        <label htmlFor="gq-budget" className={labelClass}>
                          Budget expectations
                        </label>
                        <Input
                          id="gq-budget"
                          name="budget"
                          type="text"
                          placeholder="Optional. A rough range or what you'd expect this to cost."
                          disabled={isSubmitting}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label htmlFor="gq-notes" className={labelClass}>
                          Anything else?
                        </label>
                        <Textarea
                          id="gq-notes"
                          name="notes"
                          rows={3}
                          placeholder="Key pain points, deadlines, the system you currently use, past experiences with other vendors, anything that helps us scope your quote."
                          disabled={isSubmitting}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg resize-none"
                        />
                      </div>
                    </>
                  )}

                  {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

                  {setting && (
                    <>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !hasSchedules}
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
                        Estimated quote by email soon. No account required.
                      </p>
                    </>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
