"use client"

import React, { useState, useEffect } from "react"
// import Image from "next/image" // Using standard img tags for Supabase external URLs
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, MapPin, Bed, Bath, Square, Phone, Mail, Search, Filter, X, SlidersHorizontal } from "lucide-react"
import PropertiesMap from "@/components/properties-map"
import Script from "next/script"
import { optimizeForCard } from "@/lib/image-utils"

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
  availability_status?: string
  description: string
  features: string[]
  completion_date: string
  created_at: string
  updated_at: string
}

export default function AvailableHomes() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedroomsFilter, setBedroomsFilter] = useState('')
  const [bathroomsFilter, setBathroomsFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  // Apply filters whenever search/filter criteria change
  useEffect(() => {
    applyFilters()
  }, [properties, searchTerm, minPrice, maxPrice, bedroomsFilter, bathroomsFilter, statusFilter])

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
        setFilteredProperties(cleanedData)
      } else {
        console.error('Failed to fetch properties')
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...properties]

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Price range filters
    if (minPrice) {
      const min = parseFloat(minPrice.replace(/[$,]/g, ''))
      filtered = filtered.filter(p => {
        const price = parseFloat(p.price.replace(/[$,]/g, ''))
        return price >= min
      })
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice.replace(/[$,]/g, ''))
      filtered = filtered.filter(p => {
        const price = parseFloat(p.price.replace(/[$,]/g, ''))
        return price <= max
      })
    }

    // Bedrooms filter
    if (bedroomsFilter) {
      filtered = filtered.filter(p => p.beds >= parseInt(bedroomsFilter))
    }

    // Bathrooms filter
    if (bathroomsFilter) {
      filtered = filtered.filter(p => p.baths >= parseInt(bathroomsFilter))
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    setFilteredProperties(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setMinPrice('')
    setMaxPrice('')
    setBedroomsFilter('')
    setBathroomsFilter('')
    setStatusFilter('')
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

  const getAvailabilityStatusColor = (availabilityStatus: string) => {
    switch (availabilityStatus) {
      case "Available":
        return "bg-green-600"
      case "Under Contract":
        return "bg-yellow-600"
      case "Coming Soon":
        return "bg-blue-600"
      case "Sold":
        return "bg-red-600"
      default:
        return "bg-green-600"
    }
  }

  // Create structured data for property listings
  const propertyListingsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Available Homes by Drake Homes LLC",
    "description": "Browse our collection of available new construction homes in Wisconsin's Fox Valley area",
    "numberOfItems": properties.length,
    "itemListElement": properties.map((property, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "RealEstateListing",
        "@id": `https://drakehomesllc.com/available-homes/${property.id}`,
        "name": property.title,
        "description": property.description.slice(0, 160),
        "url": `https://drakehomesllc.com/available-homes/${property.id}`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": property.location.split(',')[0]?.trim(),
          "addressLocality": property.location.split(',')[1]?.trim() || "Fox Valley",
          "addressRegion": "WI",
          "addressCountry": "US"
        },
        "offers": {
          "@type": "Offer",
          "price": property.price === "SOLD" ? undefined : property.price.replace(/[$,]/g, ''),
          "priceCurrency": "USD"
        },
        "numberOfBedrooms": property.beds,
        "numberOfBathroomsTotal": property.baths,
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": property.sqft.replace(/[^0-9]/g, ''),
          "unitCode": "FTK"
        }
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        id="property-listings-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyListingsSchema) }}
      />
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

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters Toggle */}
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {(minPrice || maxPrice || bedroomsFilter || bathroomsFilter || statusFilter) && (
                <Badge className="ml-2 bg-red-600">
                  {[minPrice, maxPrice, bedroomsFilter, bathroomsFilter, statusFilter].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <Input
                    type="text"
                    placeholder="$250,000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <Input
                    type="text"
                    placeholder="$500,000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
                  <select
                    value={bedroomsFilter}
                    onChange={(e) => setBedroomsFilter(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Bathrooms</label>
                  <select
                    value={bathroomsFilter}
                    onChange={(e) => setBathroomsFilter(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Construction Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">All</option>
                    <option value="Move-In Ready">Move-In Ready</option>
                    <option value="Nearly Complete">Nearly Complete</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Pre-Construction">Pre-Construction</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full h-10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Map */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!loading && <PropertiesMap properties={filteredProperties} />}
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Our Available Homes</h2>
            <p className="text-gray-600">
              Showing {filteredProperties.length} of {properties.length} homes
              {filteredProperties.length !== properties.length && (
                <Button 
                  variant="link" 
                  onClick={clearFilters}
                  className="text-red-600 p-0 ml-2 h-auto"
                >
                  (Clear filters)
                </Button>
              )}
            </p>
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
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover-lift group">
              <div className="relative overflow-hidden">
                <Link href={`/available-homes/${property.id}`}>
                  <img
                    src={optimizeForCard(property.image || property.main_image || "/placeholder.svg")}
                    alt={`${property.title} - ${property.beds} bed, ${property.baths} bath, ${property.sqft} sqft home in ${property.location}. ${property.status}. Drake Homes quality construction.`}
                    className="w-full h-56 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>
                
                {/* Construction Status Badge - Top Left */}
                <Badge className={`absolute top-4 left-4 text-white ${getStatusColor(property.status)}`}>
                  {property.status}
                </Badge>
                
                {/* Availability Status Badge - Top Right */}
                {property.availability_status && (
                  <Badge className={`absolute top-4 right-4 text-white ${getAvailabilityStatusColor(property.availability_status)} z-10`}>
                    {property.availability_status}
                  </Badge>
                )}
                
                {/* Heart Button - Moved to account for availability status */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute ${property.availability_status ? 'top-16 right-4' : 'top-4 right-4'} bg-white/90 hover:bg-white z-10`}
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

              <CardContent className="p-5">
                <div className="flex items-center text-gray-700 mb-4 mt-1">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-base font-medium">{property.location}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5 text-sm">
                  <div className="text-center">
                    <div className="flex flex-col items-center">
                      <Bed className="h-4 w-4 mb-1 text-gray-500" />
                      <span className="text-gray-700 font-medium">{property.beds}</span>
                      <span className="text-xs text-gray-500">beds</span>
                    </div>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <div className="flex flex-col items-center">
                      <Bath className="h-4 w-4 mb-1 text-gray-500" />
                      <span className="text-gray-700 font-medium">{property.baths}</span>
                      <span className="text-xs text-gray-500">baths</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex flex-col items-center">
                      <Square className="h-4 w-4 mb-1 text-gray-500" />
                      <span className="text-gray-700 font-medium">{property.sqft}</span>
                      <span className="text-xs text-gray-500">sqft</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-2xl font-bold text-red-600">{property.price}</div>
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
            <Button size="lg" className="bg-red-600 hover:bg-red-700 min-h-[48px] text-base">
              <Mail className="h-5 w-5 mr-2" />
              Custom Home Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 