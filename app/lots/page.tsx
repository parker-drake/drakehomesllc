"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MapPin, 
  Ruler, 
  DollarSign,
  Home,
  ArrowRight,
  Filter,
  School,
  Zap,
  Trees
} from "lucide-react"

interface Lot {
  id: string
  lot_number: string
  address: string
  city: string
  state: string
  zip_code: string
  subdivision: string
  lot_size: number
  price: number
  status: string
  latitude: number
  longitude: number
  description: string
  main_image: string
  utilities_status: string
  hoa_fees: number
  school_district: string
  is_featured: boolean
  lot_features: { feature_name: string }[]
  lot_images: { image_url: string; image_type: string }[]
}

export default function LotsPage() {
  const [lots, setLots] = useState<Lot[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')

  useEffect(() => {
    fetchLots()
  }, [])

  const fetchLots = async () => {
    try {
      const response = await fetch('/api/lots')
      if (response.ok) {
        const data = await response.json()
        setLots(data)
      }
    } catch (error) {
      console.error('Error fetching lots:', error)
    } finally {
      setLoading(false)
    }
  }

  const subdivisions = ['all', ...Array.from(new Set(lots.map(lot => lot.subdivision).filter(Boolean)))]

  const filteredLots = lots
    .filter(lot => lot.status === 'available')
    .filter(lot => filter === 'all' || lot.subdivision === filter)
    .sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.is_featured && !b.is_featured) return -1
        if (!a.is_featured && b.is_featured) return 1
        return 0
      }
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'size') return a.lot_size - b.lot_size
      return 0
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading available lots...</p>
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
              Available Lots
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Find the perfect lot for your dream home in Wisconsin's Fox Valley. 
              Our carefully selected lots offer prime locations with excellent schools, 
              utilities, and neighborhood amenities.
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
              <span className="text-gray-700 font-medium">Filter by subdivision:</span>
              <div className="flex gap-2 flex-wrap">
                {subdivisions.map(subdivision => (
                  <Button
                    key={subdivision}
                    variant={filter === subdivision ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(subdivision)}
                    className={filter === subdivision ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    {subdivision === 'all' ? 'All Lots' : subdivision}
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

      {/* Lots Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredLots.length === 0 ? (
            <div className="text-center py-12">
              <Trees className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No lots found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more lots.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredLots.length} available lot{filteredLots.length !== 1 ? 's' : ''}
                  {filter !== 'all' && ` in ${filter}`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLots.map((lot) => (
                  <Card key={lot.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <div className="relative h-64 bg-gray-200">
                      {lot.is_featured && (
                        <Badge className="absolute top-3 left-3 z-10 bg-red-600 hover:bg-red-700">
                          Featured Lot
                        </Badge>
                      )}
                      
                      {lot.main_image ? (
                        <Image
                          src={lot.main_image}
                          alt={lot.lot_number}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                          <Trees className="w-12 h-12 text-gray-500" />
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{lot.lot_number}</h3>
                        <p className="text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {lot.subdivision}
                        </p>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {lot.description || `Beautiful lot in ${lot.subdivision}, ready for your dream home.`}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-red-600" />
                          <span>{lot.lot_size} acres</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-red-600" />
                          <span className="truncate">{lot.school_district?.split(' ')[0]}</span>
                        </div>
                        {lot.utilities_status && (
                          <div className="flex items-center gap-2 col-span-2">
                            <Zap className="w-4 h-4 text-red-600" />
                            <span className="text-xs truncate">{lot.utilities_status}</span>
                          </div>
                        )}
                      </div>
                      
                      {lot.lot_features && lot.lot_features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {lot.lot_features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature.feature_name}
                              </Badge>
                            ))}
                            {lot.lot_features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{lot.lot_features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-red-600">
                            ${lot.price?.toLocaleString()}
                          </span>
                        </div>
                        
                        <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                          <Link href={`/lots/${lot.id}`}>
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
            Have questions about our available lots or want to schedule a site visit? 
            Let's discuss your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Link href="/contact">
                Contact Us Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Link href="/plans">
                View House Plans
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 