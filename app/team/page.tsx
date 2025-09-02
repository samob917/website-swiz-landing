"use client"

import Image from "next/image"

const teamMembers = [
  {
    name: "Samuel Oberly",
    title: "Cofounder & CEO",
    education: "Johns Hopkins University & University of Cambridge",
    degree: "BA Mathematics, Economics (2024), BS/MS Applied Math & Statistics (2024)",
    experience: "Minor League Baseball Scheduling, Modeling & Analysis for DoD",
    image: "/team/sam-oberly.png",
  },
  {
    name: "Abdelrahman Hamimi",
    title: "Cofounder & CTO",
    education: "Johns Hopkins University",
    degree: "BS/MS Computer Science (2024), BA Economics (2024)",
    experience: "Data Analyst at GEICO, Software Engineering & Sports Analytics Research",
    image: "/team/abdelrahman-hamimi.jpeg",
  },
  {
    name: "Zachary Dermody",
    title: "Cofounder & CFO",
    education: "Johns Hopkins University",
    degree: "BA Economics (2024), Minor in Computer Science (2024)",
    experience: "Operations Analyst at Amazon, NLP Research to Combat Vaccine Misinformation",
    image: "/team/zachary-dermody-new.jpeg",
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
            Meet the <span className="hero-text-bold text-yellow-400">Team</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            The minds behind Scheduling Wizard, bringing together expertise in mathematics, computer science, and
            medical operations.
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

      {/* Team Grid with proper centering */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="group w-full max-w-sm">
                <div className="aspect-square relative mb-6 overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-3 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.title}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">{member.education}</p>
                    <p>{member.degree}</p>
                    <p className="text-xs">{member.experience}</p>
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