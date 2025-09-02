
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, User, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-8">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Scheduling Wizard" width={24} height={30} className="w-6 h-7" />
          <span className="text-lg font-medium text-white">SCHEDULING WIZARD</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="nav-link font-medium">
            Solutions
          </Link>
          <Link href="/demo" className="nav-link font-medium">
            Demo
          </Link>
          <Link href="/team" className="nav-link font-medium">
            Team
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
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-6 bg-black/80 backdrop-blur-sm rounded-2xl p-6">
          <div className="space-y-4">
            <Link
              href="/"
              className="block text-white hover:text-yellow-400 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Solutions
            </Link>
            <Link
              href="/demo"
              className="block text-white hover:text-yellow-400 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="/team"
              className="block text-white hover:text-yellow-400 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Team
            </Link>
            <Link
              href="/customers"
              className="block text-white hover:text-yellow-400 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Customers
            </Link>
            <Link
              href="/contact"
              className="block text-white hover:text-yellow-400 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact us
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}