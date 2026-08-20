import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="hero-background medical-glow text-white py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left - Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <Image src="/logo.png" alt="Scheduling Wizard" width={20} height={25} className="w-5 h-6 transition-transform duration-300 group-hover:scale-105" />
                <span className="text-sm font-medium text-white/80 tracking-wide">SCHEDULING WIZARD</span>
              </Link>
              <a href="https://www.linkedin.com/company/scheduling-wizard/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#0A66C2] transition-colors duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Making Your Scheduling Problems Disappear
            </p>
          </div>

          {/* Right - Contact */}
          <div className="text-center sm:text-right text-xs text-white/60 space-y-0.5">
            <a href="mailto:founders@schedulingwiz.com" className="hover:text-white transition-colors duration-300">founders@schedulingwiz.com</a>
            <p>(302) 932-1448</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-5 pt-4 text-center">
        <p className="text-xs text-white/50">
          &copy; {new Date().getFullYear()} Scheduling Wizard. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
