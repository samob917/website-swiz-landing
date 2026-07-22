"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ArrowRight, Check, UploadCloud, FileText } from "lucide-react"
import emailjs from "@emailjs/browser"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Stage = "input" | "capture" | "success"

// EmailJS free plan caps the total request payload (form vars + base64-encoded
// attachment) at 50 KB. Paid plans bump that to 2 MB. We validate against the
// free-plan ceiling and capture a PostHog event when files exceed it — if the
// rate is high, that's the signal to swap to a real attachment-friendly backend.
const MAX_FILE_BYTES = 50 * 1024
const MAX_FILE_LABEL = "Up to 50 KB"

export default function ComplianceCheckerPage() {
  const [stage, setStage] = useState<Stage>("input")
  const [source, setSource] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectFile = (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      const sizeMb = +(file.size / (1024 * 1024)).toFixed(2)
      posthog.capture("compliance_check_file_too_large", {
        file_name: file.name,
        file_size_bytes: file.size,
        file_size_mb: sizeMb,
        file_type: file.type || file.name.split(".").pop() || "unknown",
        limit_bytes: MAX_FILE_BYTES,
      })
      const sizeKb = Math.round(file.size / 1024)
      setErrorMsg(
        `That file is ${sizeKb} KB. We can only accept up to 50 KB right now — try compressing it, or email it to founders@schedulingwiz.com.`,
      )
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }
    setSource(file.name)
    setErrorMsg(null)
    setStage("capture")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) selectFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    // Mirror the dropped file into the hidden input so EmailJS can attach it.
    if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files
    selectFile(file)
  }

  const skipFile = () => {
    // Lets people without a schedule on hand still book an expert consult.
    if (fileInputRef.current) fileInputRef.current.value = ""
    setSource("Expert consult — no schedule")
    setErrorMsg(null)
    setStage("capture")
  }

  const reset = () => {
    if (fileInputRef.current) fileInputRef.current.value = ""
    setSource("")
    setErrorMsg(null)
    setStage("input")
  }

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

  return (
    <section className="hero-background medical-pattern min-h-screen relative overflow-hidden pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: messaging */}
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl hero-text mb-6">
              <span className="hero-text-bold hero-glow">ACGME Duty Hour </span>
              <span className="hero-text-bold text-yellow-400">Compliance Checker</span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed mb-12">
              Drop in your schedule. We&apos;ll check every shift against the
              ACGME duty-hour rules for your specialty.
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
                  title: "Drop your schedule.",
                  body:
                    "Block, call, or clinic — any common format works. No file? Talk to an expert instead.",
                },
                {
                  n: "02",
                  title: "We flag the violations.",
                  body:
                    "Every shift checked against your specialty's ACGME rules — 80-hour, missed days off, short rest, call, home call. We flag the exact dates and residents at risk.",
                },
                {
                  n: "03",
                  title: "An expert gets back to you.",
                  body:
                    "A scheduling expert follows up within one business day with the violations, the residents at risk, and the fix. Or we rebuild it as Excel — ready for Amion, QGenda, or wherever you publish.",
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

          {/* Right: interactive panel */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {stage === "success" ? (
              <div className="flex flex-col items-center text-center gap-4 py-10">
                <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center">
                  <Check className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Your schedule is in review.
                </h3>
                <p className="text-white/60 text-sm max-w-sm">
                  One of our scheduling experts will follow up within one
                  business day from{" "}
                  <span className="text-yellow-400">founders@schedulingwiz.com</span>{" "}
                  with what we found.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    {stage === "input"
                      ? "Check your schedule"
                      : "Where should we reach you?"}
                  </h2>
                  <span className="text-white/40 text-xs tracking-widest uppercase mt-2">
                    Free
                  </span>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {/* Hidden fields consumed by the existing EmailJS template */}
                  <input
                    type="hidden"
                    name="to_email"
                    value="founders@schedulingwiz.com"
                  />
                  <input
                    type="hidden"
                    name="subject"
                    value={`ACGME Compliance Check — ${source || "schedule"}`}
                  />

                  {/* File input persists across stages so EmailJS can attach it on submit.
                      Accepts the common formats schedules show up as: calendars, spreadsheets,
                      docs, and screenshots. */}
                  <input
                    id="cc-schedule-file"
                    ref={fileInputRef}
                    type="file"
                    name="schedule"
                    accept=".ics,.csv,.tsv,.xlsx,.xls,.ods,.numbers,.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.heic"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {stage === "input" && (
                    <>
                      <label
                        htmlFor="cc-schedule-file"
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragging(true)
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center gap-3 cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                          isDragging
                            ? "border-yellow-400 bg-yellow-400/5"
                            : "border-white/15 hover:border-yellow-400/50 hover:bg-white/5"
                        }`}
                      >
                        <UploadCloud className="w-8 h-8 text-yellow-400" />
                        <span className="text-white font-medium">
                          Drop your schedule here
                        </span>
                        <span className="text-white/40 text-sm">
                          .ics, .csv, Excel, PDF, Word, or screenshot — or click to browse
                        </span>
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/60">
                          {MAX_FILE_LABEL}
                        </span>
                      </label>

                      {errorMsg && (
                        <p className="text-sm text-red-400">{errorMsg}</p>
                      )}

                      <p className="text-center text-xs text-white/40">
                        Our team personally reviews every submission — no
                        automated reports.
                      </p>

                      <div className="flex items-center gap-4">
                        <span className="h-px flex-1 bg-white/10" />
                        <span className="text-white/30 text-xs uppercase tracking-widest">
                          or
                        </span>
                        <span className="h-px flex-1 bg-white/10" />
                      </div>

                      <Button
                        type="button"
                        onClick={skipFile}
                        variant="outline"
                        className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white h-12 rounded-lg"
                      >
                        Talk to a scheduling expert →
                      </Button>
                    </>
                  )}

                  {stage === "capture" && (
                    <>
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                        <span className="flex items-center gap-2 text-sm text-white/80">
                          <FileText className="w-4 h-4 text-yellow-400" />
                          {source}
                        </span>
                        <button
                          type="button"
                          onClick={reset}
                          className="text-xs text-white/40 hover:text-yellow-400 transition-colors"
                        >
                          Change
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="cc-name"
                            className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2"
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
                            className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2"
                          >
                            Email <span className="text-yellow-400">*</span>
                          </label>
                          <Input
                            id="cc-email"
                            name="email"
                            type="email"
                            required
                            placeholder="your.email@example.com"
                            disabled={isSubmitting}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg h-11"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="cc-company"
                          className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2"
                        >
                          Program / Institution{" "}
                          <span className="text-yellow-400">*</span>
                        </label>
                        <Input
                          id="cc-company"
                          name="company"
                          type="text"
                          required
                          placeholder="e.g. Internal Medicine, Mass General"
                          disabled={isSubmitting}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400/50 focus:ring-0 rounded-lg h-11"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cc-message"
                          className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2"
                        >
                          Anything we should know?
                        </label>
                        <Textarea
                          id="cc-message"
                          name="message"
                          rows={3}
                          placeholder="Specialty, program size, or specific rules you're worried about."
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
                            Get my review
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>

                      <p className="text-center text-xs text-white/40">
                        Free expert review within one business day. No account
                        required.
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
