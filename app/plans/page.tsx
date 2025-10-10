"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
// import Image from "next/image" // Using standard img tags for Supabase external URLs
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Home, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Star,
  ArrowRight,
  Filter
} from "lucide-react"

interface Plan {
  id: string
  title: string
  description: string
  square_footage: number
  bedrooms: number
  bathrooms: number
  floors: number
  garage_spaces: number
  style: string
  price: number
  main_image: string
  is_featured: boolean
  plan_features: { feature_name: string }[]
  plan_images: { image_url: string; image_type: string }[]
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const styles = ['all', ...Array.from(new Set(plans.map(plan => plan.style).filter(Boolean)))]

  const filteredPlans = plans
    .filter(plan => filter === 'all' || plan.style === filter)
    .sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.is_featured && !b.is_featured) return -1
        if (!a.is_featured && b.is_featured) return 1
        return 0
      }
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'size') return a.square_footage - b.square_footage
      return 0
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading plans...</p>
          </div>
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
              House Plans
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Discover our collection of thoughtfully designed home plans. 
              From cozy ranch-style homes to spacious two-story designs, 
              find the perfect plan for your dream home.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Filter by style:</span>
              <div className="flex gap-2 flex-wrap">
                {styles.map(style => (
                  <Button
                    key={style}
                    variant={filter === style ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(style)}
                    className={filter === style ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    {style === 'all' ? 'All Plans' : style}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="featured">Featured First</option>
                <option value="price">Price (Low to High)</option>
                <option value="size">Size (Small to Large)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No plans found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more plans.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''}
                  {filter !== 'all' && ` in ${filter} style`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlans.map((plan) => (
                  <Card key={plan.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <div className="relative h-64 bg-gray-200">
                      {plan.is_featured && (
                        <Badge className="absolute top-3 left-3 z-10 bg-red-600 hover:bg-red-700">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      )}
                      
                      {plan.main_image ? (
                        <img
                          src={plan.main_image}
                          alt={`${plan.title} - ${plan.bedrooms} bed, ${plan.bathrooms} bath, ${plan.square_footage?.toLocaleString()} sqft ${plan.style} floor plan. Starting at $${plan.price?.toLocaleString()}.`}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                          <Home className="w-12 h-12 text-gray-500" />
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {plan.style}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {plan.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4 text-red-600" />
                          <span>{plan.square_footage?.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-red-600" />
                          <span>{plan.bedrooms} bed{plan.bedrooms !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4 text-red-600" />
                          <span>{plan.bathrooms} bath{plan.bathrooms !== 1 ? 's' : ''}</span>
                        </div>
                        {plan.garage_spaces > 0 && (
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-red-600" />
                            <span>{plan.garage_spaces} car garage</span>
                          </div>
                        )}
                      </div>
                      
                      {plan.plan_features && plan.plan_features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {plan.plan_features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature.feature_name}
                              </Badge>
                            ))}
                            {plan.plan_features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{plan.plan_features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-red-600">
                            ${plan.price?.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">starting</span>
                        </div>
                        
                        <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                          <Link href={`/plans/${plan.id}`}>
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
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
            Have questions about our plans or want to customize one for your needs? 
            Let's discuss your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Link href="/contact">
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Link href="/available-homes">
                View Available Homes
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 