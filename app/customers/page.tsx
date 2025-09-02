"use client"

import Image from "next/image"

export default function CustomersPage() {
  const scrollToContent = () => {
    const contentSection = document.getElementById('content-section')
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-background medical-pattern min-h-screen flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl hero-text text-white mb-8">
            Trusted by <span className="hero-text-bold text-yellow-400">Leaders</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our scheduling solutions power residency and fellowship programs at top medical institutions.
          </p>
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

      {/* Content - Added ID for scrolling target and increased padding */}
      <section id="content-section" className="bg-white py-32 scroll-mt-4">
        <div className="max-w-6xl mx-auto px-8">
          {/* Customer Logos */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Scheduling Solutions</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-16">
              We have delivered high-quality clinic, call, block, and attending schedules for these institutions, and others, and are trusted as the premier scheduler in the industry.
            </p>

            <div className="grid md:grid-cols-3 gap-16 items-center">
              <div className="text-center">
                <Image
                  src="/johns-hopkins-logo.png"
                  alt="Johns Hopkins"
                  width={120}
                  height={80}
                  className="max-h-20 w-auto object-contain mx-auto mb-6"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Johns Hopkins Medicine</h3>
                <p className="text-gray-600">Neurocritical Care residency program scheduling solutions.</p>
              </div>

              <div className="text-center">
                <Image
                  src="/mass-general-brigham-logo.png"
                  alt="Mass General Brigham"
                  width={160}
                  height={80}
                  className="max-h-20 w-auto object-contain mx-auto mb-6"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mass General Brigham</h3>
                <p className="text-gray-600">Neurology residency program scheduling automation.</p>
              </div>

              <div className="text-center">
                <Image
                  src="/hca-healthcare-logo.png"
                  alt="UCF"
                  width={140}
                  height={80}
                  className="max-h-20 w-auto object-contain mx-auto mb-6"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">UCF</h3>
                <p className="text-gray-600">Family Medicine residency program scheduling solutions.</p>
              </div>
            </div>
          </div>

          {/* Industry Leadership - Added bottom margin */}
          <div className="bg-gray-50 rounded-2xl p-12 text-center mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Expert Residency Schedulers</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              We are expert schedulers who decided to fix a problem we saw in the medical niche. As an early company, we
              have already been working with top medical programs. We are rapidly expanding to scheduling attendings,
              and would love to solve any scheduling challenges you have.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">7+</div>
                <div className="text-gray-700">Programs Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">2025</div>
                <div className="text-gray-700">Founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}