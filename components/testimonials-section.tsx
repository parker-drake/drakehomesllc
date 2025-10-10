"use client"

import React, { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface Testimonial {
  id: string
  customer_name: string
  location: string
  rating: number
  testimonial_text: string
  completion_date?: string
  project_type?: string
  is_featured: boolean
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedTestimonials()
  }, [])

  const fetchFeaturedTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data = await response.json()
        // Only show featured testimonials on homepage (max 3)
        const featured = data.filter((t: Testimonial) => t.is_featured).slice(0, 3)
        setTestimonials(featured)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  // Don't display section if no testimonials
  if (loading || testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from homeowners who chose Drake Homes for their custom home construction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className={`hover-lift animate-fade-in animate-delay-${(index + 1) * 100}`}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-10 h-10 text-red-600 opacity-20" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                      "{testimonial.testimonial_text}"
                    </p>

                    {/* Author Info */}
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-900">
                        {testimonial.customer_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.location}
                      </p>
                      {testimonial.project_type && (
                        <p className="text-xs text-gray-500 mt-1">
                          {testimonial.project_type}
                          {testimonial.completion_date && ` • ${testimonial.completion_date}`}
                        </p>
                      )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12 animate-fade-in animate-delay-400">
          <Link 
            href="/testimonials" 
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-red-600 border-2 border-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            View All Customer Reviews
          </Link>
        </div>
      </div>
    </section>
  )
}

