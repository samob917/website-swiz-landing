
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-6 sm:p-8">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <Image src="/logo.png" alt="Scheduling Wizard" width={48} height={60} className="w-12 h-14 transition-transform duration-300 group-hover:scale-105" />
          <span className="text-xl font-medium text-white tracking-wide">SCHEDULING WIZARD</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="nav-link font-medium">
            Solutions
          </Link>
          <Link href="/uses" className="nav-link font-medium">
            Use Cases
          </Link>
          <Link href="/blog" className="nav-link font-medium">
            Blog
          </Link>
          <Link href="/demo" className="nav-link font-medium">
            Demo
          </Link>
          <Link href="/customers" className="nav-link font-medium">
            Customers
          </Link>
          <Link href="/contact" className="nav-link font-medium">
            Contact us
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-white hover:bg-white/10">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="space-y-4">
            {[
              { href: "/", label: "Solutions" },
              { href: "/uses", label: "Use Cases" },
              { href: "/blog", label: "Blog" },
              { href: "/demo", label: "Demo" },
              { href: "/team", label: "Team" },
              { href: "/customers", label: "Customers" },
              { href: "/contact", label: "Contact us" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white/80 hover:text-white font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
