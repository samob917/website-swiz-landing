"use client"

import { useRunDownTo } from "@/lib/use-run-down"

export default function DemoPage() {
  useRunDownTo("video-section")
  const scrollToContent = () => {
    const videoSection = document.getElementById('video-section')
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-background medical-pattern min-h-screen flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-24 pb-24 sm:pt-28 sm:pb-28 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl hero-text text-white mb-5 sm:mb-8">
            See Scheduling Wizard <span className="text-yellow-400">in Action</span>
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-3xl mx-auto">
            Walk through how our schedule creation service transforms complex physician scheduling into an efficient, automated process that saves our clients hundreds of hours.
          </p>
        </div>

        <div
          onClick={scrollToContent}
          className="absolute bottom-5 sm:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group [@media(max-height:620px)]:hidden"
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

      {/* Video Demo Section */}
      <section id="video-section" className="bg-white py-24 sm:py-32 scroll-mt-4">
        <div className="max-w-5xl mx-auto px-8">
          <div className="mb-16">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] mx-auto">
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.loom.com/embed/5589881eb2de4ab28698f710c653ce09"
                  frameBorder="0"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="Scheduling Wizard Demo"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
