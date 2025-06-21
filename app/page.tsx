import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-background medical-pattern max-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl hero-text text-white mb-8">
            <span className="hero-text-bold">Improve your program's</span>
            <br />
            <span className="hero-text-bold text-yellow-400">schedule creation</span>
          </h1>

          <p className="text-xl md:text-3xl text-white/90 max-w-6xl mx-auto mb-12 leading-relaxed">
            We save residency and fellowship program directors and chief residents hundreds of hours through our
            cutting-edge approach to Block, Call, and Clinic schedule creation.
          </p>

          <Link href="/contact">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-2xl px-24 py-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Take back your time!
            </Button>
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          {/* Trusted By */}
          <div className="text-center mb-20">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-8">
              Trusted by Leading Medical Institutions
            </p>
            <div className="grid md:grid-cols-3 gap-12 items-center">
              <div className="flex items-center justify-center">
                <Image
                  src="/johns-hopkins-logo.png"
                  alt="Johns Hopkins"
                  width={120}
                  height={80}
                  className="max-h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/mass-general-brigham-logo.png"
                  alt="Mass General Brigham"
                  width={160}
                  height={80}
                  className="max-h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/hca-healthcare-logo.png"
                  alt="HCA Healthcare"
                  width={140}
                  height={80}
                  className="max-h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Block Schedules</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated generation of rotation blocks with resident preferences and educational requirements built-in.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Clinic Schedules</h3>
              <p className="text-gray-600 leading-relaxed">
                Optimize clinic assignments balancing educational goals with patient care requirements.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Call Schedules</h3>
              <p className="text-gray-600 leading-relaxed">
                Fair and efficient call distribution with ACGME duty hour compliance and coverage optimization.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}