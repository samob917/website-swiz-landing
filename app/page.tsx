"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import LogoCarousel from "@/components/logo-carousel"

const testimonials = [
  {
    quote: "We used Scheduling Wizard to create our fellowship block schedule for our training program. We provided the team with the vacation requests of our clinical fellows and scheduling requirements for various rotations, and Scheduling Wizard quickly followed up with a couple of clarifying questions. Within such a short time, our yearly block fellowship schedule was complete!\n\nAs a chief fellow, scheduling can be one of the most stressful and time-consuming parts of the role, but Scheduling Wizard made the entire process seamless. I would highly recommend their services to any program looking for a reliable and efficient way to build equitable schedules!",
    author: "Miriam Quinlan",
    role: "Clinical Fellow, Johns Hopkins Neurocritical Care Fellowship",
    initials: "MQ",
  },
  {
    quote: "This was Mass General Neurology's first year working with Scheduling Wizard. Our schedules are quite complex, and we were initially skeptical but hopeful about Scheduling Wizard's work with us. They completely delivered on their promises, making it a great overall experience. They were extremely responsive and crafted a schedule that met each of our program's specific requests and requirements. They were excellent and I could not recommend them more.",
    author: "Ashwin Amurthur",
    role: "Chief Resident, Mass General Neurology Residency",
    initials: "AA",
  },
]

export default function HomePage() {
  const [typedText, setTypedText] = useState("")
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const fullText = "Again."

  useEffect(() => {
    if (typedText.length === fullText.length) return
    const timeout = setTimeout(() => {
      setTypedText(fullText.slice(0, typedText.length + 1))
    }, 120)
    return () => clearTimeout(timeout)
  }, [typedText])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-background medical-pattern min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 sm:mb-8 flex items-center justify-center">
            <a
              href="https://www.ycombinator.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/15 text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-300"
            >
              <span>Backed by</span>
              <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-[#F26522] text-white font-bold text-[10px] sm:text-xs leading-none rounded-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Y
              </span>
              <span>Combinator</span>
            </a>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl hero-text text-white mb-4 sm:mb-6 md:mb-8">
            <span className="hero-text-bold hero-glow">Never Schedule </span>
            <span className="hero-text-bold text-yellow-400">{typedText}</span>
            <span className="hero-cursor">|</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 max-w-5xl mx-auto mb-8 md:mb-12 leading-relaxed px-2">
            We save GME programs, provider groups and private practices hundreds of hours through our cutting-edge approach to <span className="text-yellow-400 font-semibold">physician schedule creation.</span>
          </p>

          <div className="mb-10 md:mb-12">
            <span className="inline-block border border-white/20 text-white/70 text-xs sm:text-sm font-medium uppercase tracking-widest px-5 py-2 rounded-full backdrop-blur-sm">
              Serving 25+ Departments
            </span>
          </div>

          <a href="https://calendly.com/zacdermody-schedulingwiz/new-meeting?back=1&month=2025-10" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-lg hover:bg-white/20 hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] transition-all duration-500 cursor-pointer">
            <span className="relative z-10">Schedule a call to learn more</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 text-yellow-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
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

      {/* Logo Carousel Section */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center tracking-tight">
            We build schedules for you.
          </h2>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-10 text-center">
            Trusted by Leading Medical Institutions
          </p>
          <LogoCarousel />
        </div>
      </section>

      {/* GME Tagline - DARK */}
      <section className="hero-background medical-pattern py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            The First Effective <span className="text-yellow-400">GME & Attending</span><br className="hidden sm:block" />{" "}Scheduling Service.
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {["Reduce scheduling time by 95%+", "Handling your most complex and granular rules", "Seamless workflow integration"].map((text) => (
              <span key={text} className="smooth-pill bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 px-5 py-2.5 rounded-full text-sm font-medium cursor-default hover:bg-white/15 hover:text-white/90">
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Building Every Schedule */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 tracking-tight">Building Every Schedule</h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {["Block", "Daily Call", "Clinic"].map((type) => (
              <span key={type} className="smooth-pill bg-gray-900 text-white px-6 py-3 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-800 cursor-default">
                {type}
              </span>
            ))}
            <span className="smooth-pill bg-gray-100 text-gray-400 px-6 py-3 rounded-xl text-sm sm:text-base font-medium italic cursor-default">
              & others
            </span>
          </div>
        </div>
      </section>

      {/* Departments Section - DARK */}
      <section className="hero-background medical-pattern py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Serving Any Specialty</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {["Neurology", "Internal Medicine", "Emergency Medicine", "Family Medicine", "General Surgery", "Psychiatry", "Urology", "Neurocritical Care", "Pediatrics"].map((dept) => (
              <span key={dept} className="smooth-pill bg-white/10 backdrop-blur-sm border border-white/10 text-white px-6 py-3 rounded-xl text-sm sm:text-base font-medium hover:bg-white/20 cursor-default transition-all duration-300">
                {dept}
              </span>
            ))}
            <span className="smooth-pill bg-white/5 border border-white/10 text-white/40 px-6 py-3 rounded-xl text-sm sm:text-base font-medium italic cursor-default">
              & others
            </span>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center tracking-tight">Testimonials</h2>
          <div className="max-w-3xl mx-auto">
            {/* Carousel */}
            <Link href={`/customers?t=${activeTestimonial}#testimonial`} className="block group">
              <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[620px] sm:h-[500px] md:h-[420px]">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 glass-card rounded-2xl p-8 sm:p-10 transition-all duration-700 ease-in-out flex flex-col justify-center group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] ${
                      activeTestimonial === i
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-8 pointer-events-none"
                    }`}
                  >
                    <p className="text-2xl text-yellow-400/60 font-serif leading-none mb-4">&ldquo;</p>
                    <blockquote className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 text-left whitespace-pre-line">
                      {t.quote}
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-xs">{t.initials}</div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{t.author}</p>
                          <p className="text-xs text-gray-400">{t.role}</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </Link>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setActiveTestimonial(i) }}
                  className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    activeTestimonial === i ? "bg-yellow-400 w-6" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
