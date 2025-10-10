"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Testimonial {
  id: string
  customer_name: string
  location: string
  rating: number
  testimonial_text: string
  project_type?: string
  completion_date?: string
  is_featured: boolean
  created_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Customers Say
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from homeowners who chose Drake Homes for their custom home construction.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No testimonials yet</h3>
              <p className="text-gray-600">Check back soon for customer reviews!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={testimonial.id} 
                  className={`hover-lift animate-fade-in animate-delay-${Math.min(index, 4) * 100}`}
                >
                  <CardContent className="p-6">
                    {/* Featured Badge */}
                    {testimonial.is_featured && (
                      <div className="mb-4">
                        <Badge className="bg-yellow-500">Featured Review</Badge>
                      </div>
                    )}

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
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join our satisfied customers and experience the Drake Homes difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-red-600 bg-white rounded-md hover:bg-gray-100 transition-colors"
            >
              Get Your Free Consultation
            </a>
            <a 
              href="/available-homes" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border-2 border-white rounded-md hover:bg-white hover:text-red-600 transition-colors"
            >
              View Available Homes
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

