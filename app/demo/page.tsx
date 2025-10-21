"use client"

export default function DemoPage() {
  const scrollToContent = () => {
    // Get the video section and scroll it into view
    const videoSection = document.getElementById('video-section')
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-background medical-pattern min-h-screen flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl hero-text text-white mb-8">
            See Scheduling Wizard <span className="hero-text-bold text-yellow-400">in Action</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Walkthrough how our schedule creation service transforms complex medical scheduling into an efficient, automated process that saves your program hundreds of hours.
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

      {/* Video Demo Section - Added ID for scrolling target */}
      <section id="video-section" className="bg-white py-32 scroll-mt-4">
        <div className="max-w-6xl mx-auto px-8">
          {/* Loom Video Embed */}
          <div className="mb-16">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mx-auto" style={{ maxWidth: '900px' }}>
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

          {/* CTA Section */}
          <div className="mt-16 mb-20 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Scheduling?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join leading medical institutions who are already saving hundreds of hours with Scheduling Wizard.
            </p>
            <a target="_blank" href="https://calendly.com/zacdermody-schedulingwiz/new-meeting?back=1&month=2025-10">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Schedule a Personalized Consultation
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
// Comment