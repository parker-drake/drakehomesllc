import React from "react"
import Link from "next/link"
import { ArrowRight, Award, Building, CheckCircle, Clock, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
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

      {/* Available Homes Preview */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Available Homes</h2>
            <p className="max-w-[600px] text-gray-600 text-lg mx-auto">
              Browse our current inventory of quality homes ready for your family.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Building className="w-12 h-12 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Custom Family Homes</h3>
                <p className="text-gray-600 mb-4">Spacious homes designed for modern families with quality finishes throughout.</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>3-5 Bedrooms</span>
                  <span>2-4 Bathrooms</span>
                  <span>1,800-3,500 sq ft</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Building className="w-12 h-12 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Move-In Ready</h3>
                <p className="text-gray-600 mb-4">Completed homes ready for immediate occupancy with no waiting time.</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>Immediate</span>
                  <span>Fully Finished</span>
                  <span>Warranties Included</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Building className="w-12 h-12 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Pre-Construction</h3>
                <p className="text-gray-600 mb-4">Reserve your lot and customize your dream home before construction begins.</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>Customizable</span>
                  <span>Early Pricing</span>
                  <span>8-12 Months</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
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