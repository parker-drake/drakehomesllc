"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
// import Image from "next/image" // Using standard img tags for Supabase external URLs
import { ArrowRight, Award, CheckCircle, Clock, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Script from "next/script"
import { faqSchema } from "./faq-schema"
import { TestimonialsSection } from "@/components/testimonials-section"

interface Property {
  id: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: string
  image?: string
  main_image?: string
  status: string
  description: string
  completion_date: string
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [autoAdvance, setAutoAdvance] = useState(true)

  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        // Get up to 4 properties for the background slider
        setProperties(data.slice(0, 4))
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  // Respect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setAutoAdvance(!mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener?.('change', handleChange)
    return () => mediaQuery.removeEventListener?.('change', handleChange)
  }, [])

  // Auto-advance the slider (disabled when reduced motion is preferred)
  useEffect(() => {
    if (!autoAdvance) return
    if (properties.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => {
          const maxSlides = Math.min(4, properties.length)
          return (prev + 1) % maxSlides
        })
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [properties.length, autoAdvance])
  // Removed duplicate LocalBusiness JSON-LD. Sitewide Organization schema remains in `app/layout.tsx`.

  return (
    <div className="flex flex-col min-h-screen">
      {/* LocalBusiness/GeneralContractor JSON-LD removed to avoid duplication/conflicts */}
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero Section with Background Image Slider */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 xl:py-48 min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
        {/* Static Background - Loads Instantly for Fast LCP */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-red-600 to-red-800"></div>
        
        {/* Background Image Slider - Fades in after loading */}
        <div className="absolute inset-0 z-0">
          {!loading && properties.length > 0 ? (
            <>
              {/* Background Images */}
              {properties.slice(0, 4).map((property, index) => (
                <div
                  key={property.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {(property.image || property.main_image) ? (
                    <img
                      src={property.image || property.main_image || "/placeholder.svg"}
                      alt={`${property.title} - ${property.beds} bedroom, ${property.baths} bath home in ${property.location}. Drake Homes LLC quality construction.`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "low"}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
              ))}
              
              {/* Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex space-x-2">
                  {properties.slice(0, 4).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        index === currentSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="container relative z-10 px-4 md:px-6 w-full">
          <div className="flex flex-col items-start gap-6 text-white md:gap-8 md:max-w-[60%]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight animate-fade-in">
              Building Your Dreams From The Ground Up
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
              Quality construction services with a focus on excellence, reliability, and customer satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-base px-8 py-3 min-h-[48px]" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-black text-base px-8 py-3 min-h-[48px]"
                asChild
              >
                <Link href="/available-homes">View Available Homes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-6 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              Welcome to Drake Homes LLC
            </h2>
            <p className="max-w-[900px] text-gray-500 text-lg sm:text-xl md:text-xl leading-relaxed mx-auto px-4 animate-fade-in animate-delay-200">
              "Where Quality and Value Meet" - Your trusted partner in home construction with over 20 years of experience.
            </p>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Drake Homes LLC?</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 animate-fade-in animate-delay-100">
                  <CheckCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No Shortcuts, Only Quality</h3>
                    <p className="text-gray-600">While others cut corners to boost profits, we increase quality and customer satisfaction.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 animate-fade-in animate-delay-200">
                  <Clock className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">20+ Years Experience</h3>
                    <p className="text-gray-600">Over two decades of real estate and construction experience building homes customers expect.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 animate-fade-in animate-delay-300">
                  <Award className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Strong Partnerships</h3>
                    <p className="text-gray-600">Great relationships with suppliers and sub-contractors as partners and friends.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-red-800">Our Promise</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "After over 20 years of real estate sales experience, we noticed that some builders were taking shortcuts. 
                We didn't like having to explain to customers why builders took shortcuts and why the finished products 
                were not as home buyers would expect. This is why we started Drake Homes!"
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-red-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Your Dream Home?</h2>
            <p className="max-w-[600px] text-red-100 text-lg mx-auto">
              Contact us today for a consultation and let's discuss your vision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-red-100">Ready to discuss your project?</p>
            </div>
            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-red-100">Send us your questions anytime</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-red-100">Located in Wisconsin</p>
            </div>
          </div>
          <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100" asChild>
              <Link href="/contact">
                Contact Us Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600" asChild>
              <a href="tel:+19207406660" aria-label="Call Drake Homes at (920) 740-6660">Call (920) 740-6660</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600" asChild>
              <a href="mailto:info@drakehomesllc.com" aria-label="Email Drake Homes">Email Us</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="flex flex-col items-center p-6 space-y-4 text-center bg-white rounded-lg shadow-sm">
      <div className="p-3 bg-red-50 rounded-full text-red-600">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
}

function ProjectCard({ image, title, description }: ProjectCardProps) {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-sm">
      <img src={image || "/placeholder.svg"} alt={title} className="object-cover w-full h-48" />
      <div className="p-6 space-y-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-500">{description}</p>
        <Button variant="link" className="p-0 text-red-600">
          View Project
        </Button>
      </div>
    </div>
  )
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <div className="p-6 space-y-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-gray-300"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
        </svg>
      </div>
      <p className="text-gray-600 italic">{quote}</p>
      <div className="text-center">
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  )
} 