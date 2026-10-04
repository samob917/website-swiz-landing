"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Calendar, ArrowRight, Copy, Check } from "lucide-react"
import emailjs from "@emailjs/browser"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const copyToClipboard = (e: React.MouseEvent, text: string) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      if (!formRef.current) return

      const data = new FormData(formRef.current)
      const field = (key: string) => (data.get(key) as string | null)?.trim() ?? ""
      const department = field("department")
      const message = field("message")

      // `department` is sent as its own variable, but the EmailJS template only
      // renders variables it names. Until {{department}} is added there, prefix
      // it onto the message so it still reaches the inbox rather than being
      // silently dropped.
      const result = await emailjs.send(
        "service_x9kkaxn",
        "template_pw6eygq",
        {
          name: field("name"),
          email: field("email"),
          company: field("company"),
          department,
          subject: field("subject"),
          message: department ? `Department: ${department}\n\n${message}` : message,
        },
        "gH4mRyjdPmvSERjtQ",
      )

      if (result.status === 200) {
        setSubmitStatus({ type: "success", message: "Message sent successfully!" })
        formRef.current.reset()
      } else {
        setSubmitStatus({ type: "error", message: "Failed to send message" })
      }
    } catch (error) {
      console.error("EmailJS error:", error)
      setSubmitStatus({ type: "error", message: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-background medical-pattern min-h-screen flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl hero-text text-white mb-8">
            Get in <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Ready to save hundreds of hours on scheduling? Let&apos;s meet!
          </p>
        </div>

        <div
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        >
          <div className="flex flex-col items-center">
            <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1 group-hover:text-white/80 transition-colors duration-300">
              Scroll Down
            </span>
            <svg
              className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors duration-300 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white py-20" id="ContactForm">
        <div className="max-w-4xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              {submitStatus && (
                <div
                  className={`mb-6 p-4 rounded-xl text-sm ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      disabled={isSubmitting}
                      className="rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                      className="rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Medical Institution
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Your hospital or medical group"
                    disabled={isSubmitting}
                    className="rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Department
                  </label>
                  <Input
                    id="department"
                    name="department"
                    type="text"
                    placeholder="EM residency, radiology practice, etc."
                    disabled={isSubmitting}
                    className="rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What can we help you with?"
                    disabled={isSubmitting}
                    className="rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <p className="text-sm text-gray-500 mb-2 leading-relaxed">
                    Helpful to include: your scheduling challenges; how many
                    providers or residents; the schedules you want built.
                  </p>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us about your scheduling challenges; let's set up a meeting!"
                    disabled={isSubmitting}
                    className="rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors duration-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg btn-smooth"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <a
                href="https://calendly.com/zacdermody-schedulingwiz/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-gray-900 hover:bg-gray-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">Schedule a Call</h3>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Book a time on Calendly</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </a>

              <a href="mailto:founders@schedulingwiz.com" className="group glass-card block rounded-2xl p-6 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">Email Us</h3>
                      <p className="text-gray-500 text-sm group-hover:text-gray-900 transition-colors duration-300 underline decoration-gray-300 underline-offset-4 group-hover:decoration-gray-500">founders@schedulingwiz.com</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => copyToClipboard(e, "founders@schedulingwiz.com")}
                    title="Copy email address"
                    aria-label="Copy email address"
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300"
                  >
                    {copied === "founders@schedulingwiz.com" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </a>

              <a href="tel:+13029321448" className="group glass-card block rounded-2xl p-6 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">Call Us</h3>
                      <p className="text-gray-500 text-sm group-hover:text-gray-900 transition-colors duration-300 underline decoration-gray-300 underline-offset-4 group-hover:decoration-gray-500">(302) 932-1448</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => copyToClipboard(e, "(302) 932-1448")}
                    title="Copy phone number"
                    aria-label="Copy phone number"
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300"
                  >
                    {copied === "(302) 932-1448" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
