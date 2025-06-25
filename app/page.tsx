"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Award, Building, CheckCircle, Clock, Mail, MapPin, Phone, ChevronLeft, ChevronRight, Bed, Bath, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Property {
  id: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: string
  image?: string
  status: string
  description: string
  completion_date: string
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        // Get up to 6 properties for the slider
        setProperties(data.slice(0, 6))
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, properties.length - 2))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, properties.length - 2)) % Math.max(1, properties.length - 2))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Move-In Ready":
        return "bg-green-500"
      case "Nearly Complete":
        return "bg-blue-500"
      case "Under Construction":
        return "bg-orange-500"
      case "Pre-Construction":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 xl:py-48 min-h-[60vh] md:min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="bg-gradient-to-r from-red-600 to-red-800 w-full h-full opacity-90"></div>
        </div>
        <div className="container relative z-10 px-4 md:px-6 w-full">
          <div className="flex flex-col items-start gap-6 text-white md:gap-8 md:max-w-[60%]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
              Building Your Dreams From The Ground Up
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
              Quality construction services with a focus on excellence, reliability, and customer satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-base px-8 py-3 min-h-[48px]" asChild>
                <Link href="/contact">Get a Free Quote</Link>
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
          <div className="text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              Welcome to Drake Homes LLC
            </h2>
            <p className="max-w-[900px] text-gray-500 text-lg sm:text-xl md:text-xl leading-relaxed mx-auto px-4">
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
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No Shortcuts, Only Quality</h3>
                    <p className="text-gray-600">While others cut corners to boost profits, we increase quality and customer satisfaction.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">20+ Years Experience</h3>
                    <p className="text-gray-600">Over two decades of real estate and construction experience building homes customers expect.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
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

      {/* Featured Properties Slider */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Featured Available Homes</h2>
            <p className="max-w-[600px] text-gray-600 text-lg mx-auto">
              Discover our latest quality homes ready for your family.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading properties...</div>
            </div>
          ) : properties.length > 0 ? (
            <div className="relative">
              {/* Slider Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
                >
                  {properties.map((property) => (
                    <div key={property.id} className="w-full md:w-1/3 flex-shrink-0 px-4">
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                        {/* Property Image */}
                        <div className="relative h-48 overflow-hidden">
                          {property.image ? (
                            <Image
                              src={property.image}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full bg-gray-200 flex items-center justify-center">
                              <Building className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <Badge 
                            className={`absolute top-4 left-4 text-white ${getStatusColor(property.status)}`}
                          >
                            {property.status}
                          </Badge>
                        </div>
                        
                        {/* Property Details */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2 line-clamp-2">{property.title}</h3>
                          <p className="text-2xl font-bold text-green-600 mb-3">{property.price}</p>
                          
                          <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm line-clamp-1">{property.location}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              <span>{property.beds} bed</span>
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              <span>{property.baths} bath</span>
                            </div>
                            <div className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              <span>{property.sqft}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-red-600 font-medium">
                              Available: {property.completion_date}
                            </span>
                            <Button size="sm" asChild className="bg-red-600 hover:bg-red-700">
                              <Link href={`/available-homes/${property.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Arrows */}
              {properties.length > 3 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </>
              )}
              
              {/* Slide Indicators */}
              {properties.length > 3 && (
                <div className="flex justify-center space-x-2 mt-8">
                  {Array.from({ length: Math.max(1, properties.length - 2) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === currentSlide ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No properties available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button size="lg" asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/available-homes">
                View All Available Homes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-red-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Your Dream Home?</h2>
            <p className="max-w-[600px] text-red-100 text-lg mx-auto">
              Contact us today for a free consultation and let's discuss your vision.
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
          <div className="text-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100" asChild>
              <Link href="/contact">
                Get Your Free Quote Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
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