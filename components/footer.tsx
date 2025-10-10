import React from "react"
import Link from "next/link"
import { Settings } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold text-gray-900 mb-3">Drake Homes LLC</h3>
            <p className="text-sm text-gray-600 mb-2">
              "Where Quality and Value Meet"
            </p>
            <p className="text-sm text-gray-600">
              Building quality custom homes in Wisconsin's Fox Valley for over 20 years.
            </p>
          </div>
          
          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold text-gray-900 mb-3">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📞 (920) 740-6660</p>
              <p>📧 info@drakehomesllc.com</p>
              <p className="text-xs text-gray-500 italic">
                📍 Serving Fox Valley & Surrounding Areas
                {/* TODO: Add actual street address here when available */}
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold text-gray-900 mb-3">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <div><Link href="/available-homes" className="text-gray-600 hover:text-red-600 transition-colors">Available Homes</Link></div>
              <div><Link href="/plans" className="text-gray-600 hover:text-red-600 transition-colors">Floor Plans</Link></div>
              <div><Link href="/about" className="text-gray-600 hover:text-red-600 transition-colors">About Us</Link></div>
              <div><Link href="/contact" className="text-gray-600 hover:text-red-600 transition-colors">Contact</Link></div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 text-center md:text-left">
            © {new Date().getFullYear()} Drake Homes LLC. All rights reserved.
          </p>
          
          <Link 
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="Admin Portal"
          >
            <Settings className="w-3 h-3" />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
} 