"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Building } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-20 px-4 md:px-6">
          <Link href="/" className="flex items-center">
            <img 
              src="/DrakeHomes_Logo.jpg" 
              alt="Drake Homes LLC Logo" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                // Fallback to Building icon if logo not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Building className="w-8 h-8 hidden" />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="/available-homes" className="text-sm font-medium hover:underline underline-offset-4">
              Available Homes
            </Link>
            <Link href="/gallery" className="text-sm font-medium hover:underline underline-offset-4">
              Gallery
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild className="hidden md:flex bg-red-600 hover:bg-red-700">
              <Link href="/contact">Get a Quote</Link>
            </Button>
            <MobileNav mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Moved outside header */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black bg-opacity-90" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-80 bg-white p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="Drake Homes LLC Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Building className="w-6 h-6 hidden" />
                <span className="text-lg font-bold">Drake Homes LLC</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <nav className="flex flex-col gap-6">
              <Link 
                href="/" 
                className="text-lg font-medium hover:text-red-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/available-homes" 
                className="text-lg font-medium hover:text-red-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Available Homes
              </Link>
              <Link 
                href="/gallery" 
                className="text-lg font-medium hover:text-red-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link 
                href="/about" 
                className="text-lg font-medium hover:text-red-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-lg font-medium hover:text-red-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-6 border-t">
                <Button asChild className="w-full bg-red-600 hover:bg-red-700" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/contact">Get a Quote</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

function MobileNav({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean, setMobileMenuOpen: (open: boolean) => void }) {
  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
        <Menu className="w-6 h-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  )
} 