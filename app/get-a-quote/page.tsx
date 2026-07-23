"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Check, UploadCloud, FileText, CalendarClock, ListChecks, MessageSquareText, Plus, X } from "lucide-react"
import emailjs from "@emailjs/browser"
import { upload } from "@vercel/blob/client"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Stage = "form" | "success"

type Mode = "" | "select" | "describe"

type ScheduleRow = {
  label: string
  dept: string
  who: string
  type: string
  otherName: string
  cadence: string
  people: string
}

// Attachments upload directly from the browser to Vercel Blob (any size, up
// to 100 MB per file), and the quote email carries their download links.
// This sidesteps EmailJS's 50 KB total-payload cap entirely.
const MAX_FILE_BYTES = 100 * 1024 * 1024
const FILES_LABEL = "Any size, up to 100 MB per file"

type UploadedFile = { name: string; size: number; url: string }

const CALENDLY_URL = "https://calendly.com/zacdermody-schedulingwiz/new-meeting"

// Canonical origin for the download links in the quote email. Never derive
// from window.location: a submission from localhost or a preview deploy
// would otherwise email links nobody else can open.
const SITE_URL = "https://schedulingwiz.com"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Common mail domains for did-you-mean typo suggestions. A well-formed but
// wrong address is undetectable without a verification email, so catching
// popular-domain typos plus echoing the address on the success screen is the
// practical ceiling for a form like this.
const COMMON_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]

const editDistance = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
  return dp[a.length][b.length]
}

const suggestEmail = (value: string): string | null => {
  const at = value.lastIndexOf("@")
  if (at < 1) return null
  const local = value.slice(0, at)
  const domain = value.slice(at + 1).toLowerCase()
  if (!domain || COMMON_DOMAINS.includes(domain)) return null
  for (const candidate of COMMON_DOMAINS) {
    const distance = editDistance(domain, candidate)
    if (distance > 0 && distance <= 2) return `${local}@${candidate}`
  }
  return null
}

// Draft persists per tab until submit so a refresh doesn't wipe the form.
// sessionStorage (not localStorage) so it dies with the tab and never leaves
// the browser. Files can't be serialized, so they need re-adding after refresh.
const DRAFT_KEY = "swiz-quote-draft-v1"

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

const prettySize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`

const emptyRow = (): ScheduleRow => ({
  label: "",
  dept: "",
  who: "",
  type: "",
  otherName: "",
  cadence: "",
  people: "",
})

export default function GetAQuotePage() {
  const [stage, setStage] = useState<Stage>("form")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [hospital, setHospital] = useState("")
  const [departments, setDepartments] = useState("")
  const [setting, setSetting] = useState("")
  const [ppScope, setPpScope] = useState("")
  const [mode, setMode] = useState<Mode>("")
  const [rows, setRows] = useState<ScheduleRow[]>([emptyRow()])
  const [describe, setDescribe] = useState("")
  const [budget, setBudget] = useState("")
  const [notes, setNotes] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLInputElement>(null)

  // Restore a draft once on mount, then keep it saved on every change.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const d = JSON.parse(raw)
      if (typeof d.name === "string") setName(d.name)
      if (typeof d.email === "string") setEmail(d.email)
      if (typeof d.hospital === "string") setHospital(d.hospital)
      if (typeof d.departments === "string") setDepartments(d.departments)
      if (SETTINGS.includes(d.setting)) setSetting(d.setting)
      if (d.ppScope === "Single department" || d.ppScope === "Multiple departments")
        setPpScope(d.ppScope)
      if (d.mode === "select" || d.mode === "describe") setMode(d.mode)
      if (Array.isArray(d.rows) && d.rows.length)
        setRows(d.rows.map((r: Partial<ScheduleRow>) => ({ ...emptyRow(), ...r })))
      if (typeof d.describe === "string") setDescribe(d.describe)
      if (typeof d.budget === "string") setBudget(d.budget)
      if (typeof d.notes === "string") setNotes(d.notes)
    } catch {
      // A corrupt draft should never break the page; start fresh instead.
      sessionStorage.removeItem(DRAFT_KEY)
    }
  }, [])

  useEffect(() => {
    if (stage === "success") return
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ name, email, hospital, departments, setting, ppScope, mode, rows, describe, budget, notes }),
      )
    } catch {
      // Storage full or unavailable: the form still works without drafts.
    }
  }, [name, email, hospital, departments, setting, ppScope, mode, rows, describe, budget, notes, stage])

  const isPrivatePractice = setting === "Private practice group"

  const multiDept =
    setting === "Multiple departments" ||
    setting === "Enterprise (hospital-wide)" ||
    (isPrivatePractice && ppScope === "Multiple departments")

  const deptLabel = isPrivatePractice
    ? multiDept
      ? "Groups / specialties"
      : "Group / specialty"
    : multiDept
      ? "Department(s)"
      : "Department"

  const deptPlaceholder = isPrivatePractice
    ? multiDept
      ? "e.g. Radiology, Cardiology, Anesthesiology"
      : "e.g. Radiology"
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

  // Back to a fresh request from the success screen. Contact details stay
  // (it's almost always the same person); everything else clears.
  const startNewRequest = () => {
    setSetting("")
    setPpScope("")
    setMode("")
    setRows([emptyRow()])
    setDescribe("")
    setBudget("")
    setNotes("")
    setFiles([])
    setErrorMsg(null)
    setEmailInvalid(false)
    setStage("form")
  }

  const addFiles = (incoming: FileList) => {
    const accepted = Array.from(incoming)
    const oversized = accepted.find((f) => f.size > MAX_FILE_BYTES)
    if (oversized) {
      setErrorMsg(
        `${oversized.name} is over 100 MB. Email it to founders@schedulingwiz.com instead and we'll take it from there.`,
      )
      return
    }
    setErrorMsg(null)
    setFiles([...files, ...accepted])
    // Reset the picker so choosing the same file again still fires onChange.
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
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
    setFiles(files.map((f, i) => (i === index ? renamed : f)))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  // One structured, delimited report: easy for a human to scan and for an LLM
  // to parse downstream. Includes both input modes regardless of which was
  // active so nothing typed is ever silently dropped.
  const buildSummary = (uploaded: UploadedFile[]) => {
    const structured = completeRows.length
      ? completeRows
          .map((r, n) => {
            const parts = [
              `${n + 1}. ${r.label.trim() || `Schedule ${n + 1}`}`,
              ...(r.dept.trim() ? [`department: ${r.dept.trim()}`] : []),
              `for: ${r.who}`,
              `type: ${r.type === "Other" ? `Other (${r.otherName.trim()})` : r.type}`,
              `cadence: ${r.cadence || "not specified"}`,
              ...(r.people.trim()
                ? [`est_people_incl_rotators: ${r.people.trim()}`]
                : []),
            ]
            return parts.join(" | ")
          })
          .join("\n")
      : "none provided"

    return [
      `QUOTE INQUIRY - schedulingwiz website /get-a-quote`,
      `Submitted: ${new Date().toISOString()}`,
      `Input mode: ${mode === "select" ? "picked from options" : "free-text description"}`,
      ``,
      `## CONTACT`,
      `Name: ${name.trim() || "-"}`,
      `Email: ${email.trim() || "-"}`,
      `Hospital / medical center: ${hospital.trim() || "-"}`,
      `Setting: ${setting ? `${setting}${isPrivatePractice && ppScope ? ` (${ppScope.toLowerCase()})` : ""}` : "-"}`,
      `${deptLabel}: ${departments.trim() || "-"}`,
      ``,
      `## SCHEDULES (structured)`,
      structured,
      ``,
      `## SCHEDULES (free-text description)`,
      describe.trim() || "none provided",
      ``,
      `## BUDGET EXPECTATIONS`,
      budget.trim() || "not specified",
      ``,
      `## ATTACHED FILES (download links)`,
      uploaded.length
        ? uploaded
            .map((f) => `- ${f.name} (${prettySize(f.size)}): ${f.url}`)
            .join("\n")
        : "none",
      ``,
      `## ADDITIONAL NOTES`,
      notes.trim() || "none",
    ].join("\n")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!EMAIL_RE.test(email.trim())) {
      setEmailInvalid(true)
      setErrorMsg(
        "That email address doesn't look right. Double-check it so we can reach you with your quote.",
      )
      emailRef.current?.focus()
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    // Upload attachments to Blob first; the email only carries their links,
    // so file size never hits EmailJS's payload cap.
    const uploaded: UploadedFile[] = []
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      setUploadProgress(
        files.length > 1
          ? `Uploading file ${i + 1} of ${files.length}…`
          : "Uploading file…",
      )
      try {
        // Private store: the blob URL itself isn't fetchable, so the email
        // links to our own download route, which streams the file.
        const blob = await upload(`quote-uploads/${f.name}`, f, {
          access: "private",
          handleUploadUrl: "/api/quote-upload",
        })
        const link = `${SITE_URL}/api/quote-file?pathname=${encodeURIComponent(blob.pathname)}`
        uploaded.push({ name: f.name, size: f.size, url: link })
      } catch (err) {
        console.error("Upload error:", err)
        posthog.capture("quote_upload_failed", {
          file_name: f.name,
          file_size_bytes: f.size,
        })
        setErrorMsg(
          `Couldn't upload ${f.name}. Try again, or remove it and email the file to founders@schedulingwiz.com. Your answers are still saved.`,
        )
        setUploadProgress(null)
        setIsSubmitting(false)
        return
      }
    }
    setUploadProgress(null)

    try {
      const form = formRef.current
      if (!form) return

      // The shared EmailJS template renders {{subject}} and {{message}} (same
      // template the contact form uses), so fold every answer into those two
      // variables. No template changes needed for new fields.
      if (messageRef.current) messageRef.current.value = buildSummary(uploaded)

      const result = await emailjs.sendForm(
        "service_x9kkaxn",
        "template_pw6eygq",
        form,
        "gH4mRyjdPmvSERjtQ",
      )

      if (result.status === 200) {
        try {
          sessionStorage.removeItem(DRAFT_KEY)
        } catch {}
        setStage("success")
      } else {
        setErrorMsg(`Failed to send (status ${result.status}). ${result.text || "Please try again."}`)
      }
    } catch (err) {
      console.error("EmailJS error:", err)
      const e = err as { text?: string; status?: number; message?: string }
      const detail = e?.text || e?.message || ""
      if (e?.status === 413 || /size limit/i.test(detail)) {
        posthog.capture("quote_send_payload_too_large", {
          message_chars: messageRef.current?.value.length ?? 0,
        })
        setErrorMsg(
          "Your submission text is too long to send in one go. Trim the description or notes a bit and resend. You can always email the rest to founders@schedulingwiz.com.",
        )
      } else if (e?.status === 422 || /email|recipient/i.test(detail)) {
        setEmailInvalid(true)
        setErrorMsg(
          "We couldn't send this. Please double-check your email address and try again.",
        )
        emailRef.current?.focus()
      } else {
        const status = e?.status ? ` (HTTP ${e.status})` : ""
        setErrorMsg(
          `Couldn't send${status}: ${detail || "Unknown error. Please try again, or email founders@schedulingwiz.com."}`,
        )
      }
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
                <p className="text-white/60 text-sm">
                  Your estimated quote will be emailed to
                </p>
                <p className="text-white font-medium -mt-2">{email.trim()}</p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-yellow-400/50"
                >
                  <CalendarClock className="w-4 h-4 text-yellow-400" />
                  Want to talk sooner? Schedule a meeting
                </a>
                <button
                  type="button"
                  onClick={startNewRequest}
                  className="text-xs text-white/40 underline underline-offset-2 hover:text-yellow-400 transition-colors"
                >
                  Submit another request
                </button>
                <p className="text-white/40 text-xs">
                  Wrong email? Write to founders@schedulingwiz.com
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                {/* Hidden fields consumed by the shared EmailJS template.
                    Visible inputs are disabled while sending, and disabled
                    controls are dropped from form serialization, so the
                    template's header variables (name/email/company) must be
                    mirrored here rather than read from the visible fields. */}
                <input type="hidden" name="to_email" value="founders@schedulingwiz.com" />
                <input
                  type="hidden"
                  name="subject"
                  value="Quote Inquiry Through schedulingwiz Website"
                />
                <input type="hidden" name="message" ref={messageRef} />
                <input type="hidden" name="name" value={name} />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="company" value={hospital} />
                <input type="hidden" name="setting" value={setting} />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gq-name" className={labelClass}>
                      Name <span className="text-yellow-400">*</span>
                    </label>
                    <Input
                      id="gq-name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      type="email"
                      autoComplete="email"
                      required
                      ref={emailRef}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailInvalid(false)
                      }}
                      placeholder="your.email@hospital.org"
                      disabled={isSubmitting}
                      aria-invalid={emailInvalid}
                      className={`${inputClass} ${
                        emailInvalid
                          ? "border-red-400/70 focus:border-red-400"
                          : ""
                      }`}
                    />
                    {emailInvalid && (
                      <p className="mt-1.5 text-xs text-red-400">
                        Please double-check this email address.
                      </p>
                    )}
                    {!emailInvalid && suggestEmail(email) && (
                      <button
                        type="button"
                        onClick={() => setEmail(suggestEmail(email) ?? email)}
                        className="mt-1.5 text-xs text-yellow-400 hover:underline"
                      >
                        Did you mean {suggestEmail(email)}?
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="gq-hospital" className={labelClass}>
                    Hospital / medical center{" "}
                    <span className="text-yellow-400">*</span>
                  </label>
                  <Input
                    id="gq-hospital"
                    type="text"
                    autoComplete="organization"
                    required
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
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
                        onClick={() => {
                          setSetting(setting === s ? "" : s)
                          setPpScope("")
                        }}
                        disabled={isSubmitting}
                        className={chipClass(setting === s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {isPrivatePractice && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-white/50">
                        Covering…
                      </span>
                      {["Single department", "Multiple departments"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setPpScope(ppScope === s ? "" : s)}
                          disabled={isSubmitting}
                          className={chipClass(ppScope === s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {setting && (
                  <>
                    <div>
                      <label htmlFor="gq-departments" className={labelClass}>
                        {deptLabel} <span className="text-yellow-400">*</span>
                      </label>
                      <Input
                        id="gq-departments"
                        type="text"
                        required
                        value={departments}
                        onChange={(e) => setDepartments(e.target.value)}
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
                            <div className="flex items-center justify-between gap-2">
                              <Input
                                type="text"
                                value={r.label}
                                onChange={(e) =>
                                  updateRow(i, { label: e.target.value })
                                }
                                placeholder={`Schedule ${i + 1}`}
                                disabled={isSubmitting}
                                aria-label="Schedule name"
                                title="Click to rename this schedule"
                                className="h-7 flex-1 min-w-0 bg-transparent border-transparent hover:border-white/10 focus:border-yellow-400/50 focus:ring-0 rounded-md px-1 text-[11px] font-medium uppercase tracking-wider text-white/50 placeholder:text-white/40"
                              />
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
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <select
                                value={r.who}
                                onChange={(e) =>
                                  updateRow(i, { who: e.target.value })
                                }
                                disabled={isSubmitting}
                                className={`${selectClass} w-full ${r.who ? "text-white/90" : "text-white/40"}`}
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
                                className={`${selectClass} w-full ${r.type ? "text-white/90" : "text-white/40"}`}
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
                                className={`${selectClass} w-full ${r.cadence ? "text-white/90" : "text-white/40"}`}
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
                            <div className="grid sm:grid-cols-2 gap-2">
                              {multiDept && (
                                <Input
                                  type="text"
                                  value={r.dept}
                                  onChange={(e) =>
                                    updateRow(i, { dept: e.target.value })
                                  }
                                  placeholder={
                                    isPrivatePractice
                                      ? "Group, e.g. Radiology"
                                      : "Department, e.g. Neurology"
                                  }
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
                                placeholder="Est. people incl. rotators, e.g. 60"
                                disabled={isSubmitting}
                                className={`${inputClass} h-9`}
                              />
                            </div>
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
                          rows={4}
                          value={describe}
                          onChange={(e) => setDescribe(e.target.value)}
                          placeholder={DESCRIBE_PLACEHOLDERS[setting]}
                          disabled={isSubmitting}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg resize-none"
                        />
                        <p className="mt-2 text-xs text-white/40">
                          No structure needed. As much detail as you can helps:
                          which schedules, how often each is made, and roughly
                          how many people are on each.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {mode !== "" && (
                  <>
                    <div>
                      <span className={labelClass}>
                        Schedule rules & past schedules
                      </span>
                      {/* No name attribute: files go to Blob storage, not EmailJS */}
                      <input
                        id="gq-files"
                        ref={fileInputRef}
                        type="file"
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
                                {prettySize(f.size)}
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
                          {FILES_LABEL}
                        </span>
                      </label>
                      <p className="mt-2 text-xs text-white/40">
                        Optional. Keep or redact physician names. We never share
                        your schedules or rules with anyone.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="gq-budget" className={labelClass}>
                        Budget expectations
                      </label>
                      <Input
                        id="gq-budget"
                        type="text"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
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
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Key pain points, deadlines, the system you currently use, past experiences with other vendors, anything that helps us scope your quote."
                        disabled={isSubmitting}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg resize-none"
                      />
                    </div>
                  </>
                )}

                {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

                {mode !== "" && (
                  <>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !hasSchedules}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold h-12 rounded-lg group disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        uploadProgress || "Sending…"
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
                    <p className="text-center text-xs">
                      <a
                        href={CALENDLY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 underline underline-offset-2 hover:text-yellow-400 transition-colors"
                      >
                        Prefer to talk? Schedule a meeting
                      </a>
                    </p>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
