import Image from "next/image"

export default function CustomersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-background medical-pattern min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl hero-text text-white mb-8">
            Trusted by <span className="hero-text-bold text-yellow-400">Leaders</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our scheduling solutions power residency and fellowship programs at top medical institutions.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          {/* Customer Logos */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Residency Scheduling Solutions</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-16">
              We have delivered high-quality clinic, call, and block schedules for these institutions and are trusted as
              the premier scheduler in the industry.
            </p>

            <div className="grid md:grid-cols-3 gap-16 items-center">
              <div className="text-center">
                <Image
                  src="./johns-hopkins-logo.png"
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
                  src="./mass-general-brigham-logo.png"
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
                  src="./hca-healthcare-logo.png"
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

          {/* Industry Leadership */}
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Expert Residency Schedulers</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              We are expert schedulers who decided to fix a problem we saw in the medical niche. As an early company, we
              have already been working with top medical programs. We are rapidly expanding to scheduling attendings,
              and would love to solve any scheduling challenges you have.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">5+</div>
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