"use client"

import Image from "next/image"

const logosRow1 = [
  { src: "/logos/johns-hopkins.png", alt: "Johns Hopkins Medicine", width: 160, height: 100 },
  { src: "/logos/mgh.png", alt: "Massachusetts General Hospital", width: 100, height: 120 },
  { src: "/logos/ucsf.png", alt: "UCSF", width: 140, height: 70 },
  { src: "/logos/boston-childrens.png", alt: "Boston Children's Hospital", width: 180, height: 100 },
  { src: "/logos/uw-medicine.png", alt: "UW Medicine", width: 160, height: 110 },
  { src: "/logos/ut-southwestern.png", alt: "UT Southwestern Medical Center", width: 180, height: 70 },
  { src: "/logos/hca-healthcare.png", alt: "HCA Healthcare", width: 160, height: 80 },
  { src: "/logos/mass-general-brigham.png", alt: "Mass General Brigham", width: 160, height: 80 },
]

const logosRow2 = [
  { src: "/logos/usc-la-general.png", alt: "USC LA General Medical Center", width: 200, height: 50 },
  { src: "/logos/university-of-iowa.png", alt: "University of Iowa", width: 110, height: 110 },
  { src: "/logos/westchester-medical-center-logo.png", alt: "Westchester Medical Center", width: 160, height: 80 },
  { src: "/logos/harnett-health.png", alt: "Harnett Health Foundation", width: 160, height: 90 },
  { src: "/logos/texas-tech.png", alt: "Texas Tech", width: 100, height: 120 },
  { src: "/logos/yale.jpg", alt: "Yale", width: 160, height: 80 },
  { src: "/logos/texoma-medical.png", alt: "Texoma Medical Center", width: 160, height: 60 },
]

export default function LogoCarousel() {
  return (
    <div className="space-y-8 overflow-hidden">
      {/* Row 1 - scrolls right */}
      <div className="logo-carousel-track">
        <div className="logo-carousel-slide animate-scroll-right">
          {[...logosRow1, ...logosRow1].map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center px-8 shrink-0 group"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="max-h-16 w-auto object-contain transition-all duration-300 group-hover:grayscale group-hover:opacity-40"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - scrolls left */}
      <div className="logo-carousel-track">
        <div className="logo-carousel-slide animate-scroll-left">
          {[...logosRow2, ...logosRow2].map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center px-8 shrink-0 group"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="max-h-16 w-auto object-contain transition-all duration-300 group-hover:grayscale group-hover:opacity-40"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
