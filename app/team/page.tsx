"use client"

import Image from "next/image"

const teamMembers = [
  {
    name: "Samuel Oberly",
    title: "CEO",
    education: "Johns Hopkins University &\nUniversity of Cambridge",
    degree: "MS, BS Applied Math & Statistics, BS Pure Math,\nBA Economics (2024)",
    bullets: [
      "Award Winning Mathematician",
      "Expert in Scheduling Algorithms",
      "Civilian Service Medal for DoD Predictive Logistics",
    ],
    image: "/team/sam-oberly.jpg",
    imageStyle: "object-cover object-center",
    imageInline: {},
    linkedin: "https://www.linkedin.com/in/sam-oberly/",
  },
  {
    name: "Abdelrahman Hamimi",
    title: "CTO",
    education: "Johns Hopkins University",
    degree: "MS, BS Computer Science (2025),\nBA Economics (2024)",
    bullets: [
      "AWS Certified Cloud Solutions Architect",
      "Built internal automation tools used at GEICO",
      "Sports Analytics Simulation Research",
    ],
    image: "/team/abdelrahman-hamimi.jpeg",
    imageStyle: "object-cover",
    imageInline: { transform: "scale(1.5)", transformOrigin: "30% 25%" },
    linkedin: "https://www.linkedin.com/in/abdelrahman-hamimi-2064ab202/",
  },
  {
    name: "Zachary Dermody",
    title: "COO",
    education: "Johns Hopkins University",
    degree: "BA Economics, Minor in Computer Science (2024)",
    bullets: [
      "Operations Supervisor at McMaster-Carr",
      "Operations Analysis at Amazon",
    ],
    image: "/team/zachary-dermody-new.jpeg",
    imageStyle: "object-cover object-center",
    imageInline: {},
    linkedin: "https://www.linkedin.com/in/zachary-dermody-41238a202/",
  },
]

export default function TeamPage() {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-background medical-pattern min-h-screen flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl hero-text text-white mb-8">
            Meet the <span className="text-yellow-400">Team</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            The minds behind Scheduling Wizard, bringing together expertise in mathematics, computer science, and
            logistical operations.
          </p>
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

      {/* Team Grid */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="group w-full max-w-sm">
                <div className="aspect-square relative mb-6 overflow-hidden rounded-2xl bg-gray-50">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className={`${member.imageStyle} transition-transform duration-700 ease-out`}
                    style={member.imageInline}
                  />
                </div>
                <div className="text-center">
                  <div className="h-7 flex items-center justify-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#0A66C2] transition-colors duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                  <p className="text-yellow-500 font-medium text-sm h-6 flex items-center justify-center">{member.title}</p>
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="font-medium whitespace-pre-line text-gray-600 text-sm h-12 flex items-center justify-center">{member.education}</p>
                    <p className="text-xs text-gray-500 h-10 flex items-center justify-center whitespace-pre-line text-center">{member.degree}</p>
                    <div className="mt-2">
                      <ul className="space-y-1 text-xs text-gray-400">
                        {member.bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
