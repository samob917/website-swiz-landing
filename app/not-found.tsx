import Link from "next/link"

export default function NotFound() {
  return (
    <section className="hero-background medical-pattern min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-4">
          404
        </p>
        <h1 className="hero-text hero-text-bold text-white text-4xl sm:text-5xl md:text-6xl mb-6">
          Page not found
        </h1>
        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-base sm:text-lg px-8 py-3.5 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300"
          >
            Back to homepage
          </Link>
          <Link
            href="/uses"
            className="inline-flex items-center gap-3 text-white/70 hover:text-white font-medium text-base sm:text-lg px-4 py-3.5 transition-colors duration-300"
          >
            Browse use cases
          </Link>
        </div>
      </div>
    </section>
  )
}
