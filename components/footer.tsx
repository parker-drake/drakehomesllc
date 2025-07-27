import React from "react"
import Link from "next/link"
import { Settings } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Drake Homes LLC. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              "Where Quality and Value Meet"
            </p>
            <p className="text-xs text-gray-500 mt-1">
              hello dayne
            </p>
          </div>
          
          <div className="flex items-center gap-4">
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
      </div>
    </footer>
  )
} 