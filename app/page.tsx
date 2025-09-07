"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-background medical-pattern min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl hero-text text-white mb-4 sm:mb-6 md:mb-8">
            <span className="hero-text-bold block">Improve your program's</span>
            <span className="hero-text-bold text-yellow-400 block mt-2">schedule creation</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 max-w-6xl mx-auto mb-8 md:mb-12 leading-relaxed px-2">
            We save residency program directors, chief residents, and attending physicians 
            hundreds of hours through our cutting-edge approach to Block, Call, Clinic, and Attending schedule creation.
          </p>

          <Link href="/contact">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg sm:text-xl md:text-2xl px-8 sm:px-12 md:px-16 lg:px-24 py-4 sm:py-6 md:py-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Take back your time!
            </Button>
          </Link>
        </div>

        {/* Scroll Indicator - Permanent small arrow */}
        <div 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        >
          <div className="flex flex-col items-center">
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1 group-hover:text-white transition-colors">
              Scroll Down
            </span>
            {/* Small arrow indicator */}
            <svg 
              className="w-4 h-4 text-white/70 group-hover:text-white transition-colors animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trusted By */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-6 sm:mb-8">
              Trusted by Leading Medical Institutions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-12 items-center">
              <div className="flex items-center justify-center">
                <Image
                  src="/johns-hopkins-logo.png"
                  alt="Johns Hopkins"
                  width={120}
                  height={80}
                  className="max-h-10 sm:max-h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/mass-general-brigham-logo.png"
                  alt="Mass General Brigham"
                  width={160}
                  height={80}
                  className="max-h-10 sm:max-h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/hca-healthcare-logo.png"
                  alt="HCA Healthcare"
                  width={140}
                  height={80}
                  className="max-h-10 sm:max-h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Block Schedules</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Automated generation of rotation blocks with resident preferences and educational requirements built-in.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Clinic Schedules</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Optimize clinic assignments balancing educational goals with patient care requirements.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Call Schedules</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Fair and efficient call distribution with ACGME duty hour compliance and coverage optimization.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Attending Schedules</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Meeting contractual obligations, ensuring fair coverage distribution, and easily handling time-off requests.
              </p>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="mt-12 sm:mt-16 md:mt-20 bg-blue-50 rounded-3xl p-6 sm:p-8 md:p-10">
            <div className="max-w-4xl mx-auto text-center">
              <blockquote className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                <p className="mb-4">
                  "We used Scheduling Wizard to create our fellowship block schedule for our training program. We provided the team with the vacation requests of our clinical fellows and scheduling requirements for various rotations, and Scheduling Wizard quickly followed up with a couple of clarifying questions. Within such a short time, our yearly block fellowship schedule was complete!"
                </p>
                <p>
                  "As a chief fellow, scheduling can be one of the most stressful and time-consuming parts of the role, but Scheduling Wizard made the entire process seamless. I would highly recommend their services to any program looking for a reliable and efficient way to build equitable schedules!"
                </p>
              </blockquote>
              
              <div className="flex items-center justify-center">
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Miriam Quinlan</p>
                  <p className="text-xs sm:text-sm text-gray-600">Clinical Fellow, Johns Hopkins Neurocritical Care Fellowship</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}