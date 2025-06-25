"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Bed, Bath, Square, Phone, Mail } from "lucide-react"
import PropertiesMap from "@/components/properties-map"

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
  features: string[]
  completion_date: string
  created_at: string
  updated_at: string
}

export default function AvailableHomes() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        // Ensure features is always an array and never undefined
        const cleanedData = data.map((property: any) => ({
          ...property,
          features: Array.isArray(property.features) ? property.features : [],
          latitude: property.latitude || null,
          longitude: property.longitude || null
        }))
        setProperties(cleanedData)
      } else {
        console.error('Failed to fetch properties')
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Available Homes by Drake Homes LLC
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Discover our latest completed homes and upcoming construction projects. Quality craftsmanship, modern designs, and energy-efficient features in every home.
            </p>
          </div>


        </div>
      </div>

      {/* Properties Map */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!loading && <PropertiesMap properties={properties} />}
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Our Available Homes</h2>
            <p className="text-gray-600">{properties.length} homes available</p>
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-48 h-12">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="completion">Completion Date</SelectItem>
              <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative">
                <Link href={`/available-homes/${property.id}`}>
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Badge className={`absolute top-4 left-4 text-white ${getStatusColor(property.status)}`}>
                  {property.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white z-10"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(property.id)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(property.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center text-gray-700 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-base font-medium">{property.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.beds} beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.baths} baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">{property.price}</div>
                  <Link href={`/available-homes/${property.id}`}>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View More Homes
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Build Your Dream Home?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
            Schedule a tour of our available homes or discuss building a custom home just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 min-h-[48px] text-base">
              <Phone className="h-5 w-5 mr-2" />
              Schedule a Tour
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 min-h-[48px] text-base">
              <Mail className="h-5 w-5 mr-2" />
              Custom Home Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 