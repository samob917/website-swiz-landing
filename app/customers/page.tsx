"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

const customers = [
  {
    id: "johns-hopkins",
    name: "Johns Hopkins Medicine",
    logo: "/logos/johns-hopkins.png",
    width: 120,
    height: 80,
    testimonial: {
      quote: "We used Scheduling Wizard to create our fellowship block schedule for our training program. We provided the team with the vacation requests of our clinical fellows and scheduling requirements for various rotations, and Scheduling Wizard quickly followed up with a couple of clarifying questions. Within such a short time, our yearly block fellowship schedule was complete!\n\nAs a chief fellow, scheduling can be one of the most stressful and time-consuming parts of the role, but Scheduling Wizard made the entire process seamless. I would highly recommend their services to any program looking for a reliable and efficient way to build equitable schedules!",
      author: "Miriam Quinlan",
      role: "Clinical Fellow, Johns Hopkins Neurocritical Care Fellowship",
      initials: "MQ",
    },
  },
  {
    id: "mass-general",
    name: "Mass General Brigham",
    logo: "/logos/mass-general-brigham.png",
    width: 160,
    height: 80,
    testimonial: {
      quote: "This was Mass General Neurology's first year working with Scheduling Wizard. Our schedules are quite complex, and we were initially skeptical but hopeful about Scheduling Wizard's work with us. They completely delivered on their promises, making it a great overall experience. They were extremely responsive and crafted a schedule that met each of our program's specific requests and requirements. They were excellent and I could not recommend them more.",
      author: "Ashwin Amurthur",
      role: "Chief Resident, Mass General Neurology Residency",
      initials: "AA",
    },
  },
]

function useTestimonialParam(setSelected: (i: number) => void) {
  const searchParams = useSearchParams()
  useEffect(() => {
    const t = searchParams.get('t')
    if (t !== null) {
      const index = parseInt(t)
      if (index >= 0 && index < customers.length) {
        setSelected(index)
      }
      setTimeout(() => {
        const el = document.getElementById('testimonial')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [searchParams, setSelected])
  return null
}

function TestimonialParamReader({ setSelected }: { setSelected: (i: number) => void }) {
  useTestimonialParam(setSelected)
  return null
}

export default function CustomersPage() {
  const [selected, setSelected] = useState(0)

  const scrollToContent = () => {
    const contentSection = document.getElementById('content-section')
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <Suspense fallback={null}>
        <TestimonialParamReader setSelected={setSelected} />
      </Suspense>
      {/* Hero Section */}
      <section className="hero-background medical-pattern min-h-screen flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl hero-text text-white mb-8">
            Expert <span className="text-yellow-400">Schedulers</span>
          </h1>
          <div className="mt-6">
            <span className="inline-block border border-white/20 text-white/70 text-xs sm:text-sm font-medium uppercase tracking-widest px-5 py-2 rounded-full backdrop-blur-sm">
              Serving 30+ Departments
            </span>
          </div>
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

      {/* Content */}
      <section id="content-section" className="bg-white py-24 scroll-mt-4">
        <div className="max-w-4xl mx-auto px-8">
          {/* Logo Tabs */}
          <div id="testimonial" className="flex justify-center gap-10 sm:gap-20 mb-14 scroll-mt-8">
            {customers.map((customer, index) => (
              <button
                key={customer.id}
                onClick={() => setSelected(index)}
                className={`flex flex-col items-center gap-3 pb-4 border-b-2 transition-all duration-500 cursor-pointer ${
                  selected === index
                    ? "border-yellow-400 opacity-100"
                    : "border-transparent opacity-30 hover:opacity-60"
                }`}
              >
                <Image
                  src={customer.logo}
                  alt={customer.name}
                  width={customer.width * 2}
                  height={customer.height * 2}
                  className="max-h-24 w-auto object-contain"
                />
              </button>
            ))}
          </div>

          {/* Testimonial Card */}
          <div className="relative">
            {customers.map((customer, index) => (
              <div
                key={customer.id}
                className={`transition-all duration-500 ${
                  selected === index
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                }`}
              >
                <div className="glass-card rounded-2xl p-8 sm:p-12">
                  <p className="text-3xl text-yellow-400/50 font-serif mb-4">&ldquo;</p>
                  <blockquote className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
                    {customer.testimonial.quote}
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-xs">
                      {customer.testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{customer.testimonial.author}</p>
                      <p className="text-xs text-gray-400">{customer.testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-300 mt-12 text-center text-sm tracking-wide">...and many others</p>
        </div>
      </section>
    </>
  )
}
