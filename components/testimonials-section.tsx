"use client"

import React from 'react'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  text: string
  date: string
  projectType?: string
}

// Real customer testimonials - add your reviews here
const testimonials: Testimonial[] = [
  // Add your real testimonials here in this format:
  // {
  //   id: '1',
  //   name: 'Customer Name',
  //   location: 'City, WI',
  //   rating: 5,
  //   text: 'Their review text here...',
  //   date: '2024',
  //   projectType: 'Custom Home Build'
  // },
]

export function TestimonialsSection() {
  // Don't display section if no testimonials
  if (testimonials.length === 0) {
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
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonial.location}
                  </p>
                  {testimonial.projectType && (
                    <p className="text-xs text-gray-500 mt-1">
                      {testimonial.projectType} • {testimonial.date}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 animate-fade-in animate-delay-400">
          <p className="text-gray-600 mb-4">
            Ready to start your dream home project?
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Get Your Free Consultation
          </a>
        </div>
      </div>
    </section>
  )
}

