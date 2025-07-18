"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  FileDown, 
  Plus, 
  X, 
  Check, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Search,
  Loader2
} from "lucide-react"

interface Property {
  id: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: string
  main_image?: string
  status: string
  availability_status?: string
}

export default function PropertyFlyersPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    filterProperties()
  }, [properties, searchTerm])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
      // Only show available properties
      const available = data.filter((p: Property) => 
        p.availability_status === 'Available' || !p.availability_status
      )
      setProperties(available)
      setFilteredProperties(available)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProperties = () => {
    const filtered = properties.filter(property => {
      const search = searchTerm.toLowerCase()
      return (
        property.title.toLowerCase().includes(search) ||
        property.location.toLowerCase().includes(search) ||
        property.price.toLowerCase().includes(search)
      )
    })
    setFilteredProperties(filtered)
  }

  const togglePropertySelection = (property: Property) => {
    if (selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties(selectedProperties.filter(p => p.id !== property.id))
    } else {
      if (selectedProperties.length < 6) {
        setSelectedProperties([...selectedProperties, property])
      } else {
        alert("You can select a maximum of 6 properties for a single flyer")
      }
    }
  }

  const isPropertySelected = (property: Property) => {
    return selectedProperties.some(p => p.id === property.id)
  }

  const clearSelection = () => {
    setSelectedProperties([])
  }

  const generateFlyer = async () => {
    if (selectedProperties.length === 0) {
      alert("Please select at least one property")
      return
    }

    setGenerating(true)
    try {
      const propertyIds = selectedProperties.map(p => p.id).join(',')
      const response = await fetch(`/api/property-flyer?ids=${propertyIds}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `property-flyer-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to generate flyer. Please try again.')
      }
    } catch (error) {
      console.error('Error generating flyer:', error)
      alert('Error generating flyer. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Flyers</h1>
        <p className="text-gray-600">
          Select up to 6 properties to create a single-page marketing flyer
        </p>
      </div>

      {/* Selected Properties Summary */}
      {selectedProperties.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Selected Properties ({selectedProperties.length}/6)
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  These properties will be included in your flyer
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearSelection}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
                <Button 
                  onClick={generateFlyer}
                  disabled={generating}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4 mr-2" />
                      Generate Flyer
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedProperties.map((property) => (
                <div 
                  key={property.id}
                  className="bg-white p-3 rounded-lg border border-red-200"
                >
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {property.title}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {property.location}
                  </div>
                  <div className="text-sm font-semibold text-red-600 mt-1">
                    {property.price}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search properties by title, location, or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const isSelected = isPropertySelected(property)
          return (
            <Card 
              key={property.id} 
              className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-red-600 bg-red-50' : ''
              }`}
              onClick={() => togglePropertySelection(property)}
            >
              <div className="relative h-48 bg-gray-100">
                {property.main_image ? (
                  <img
                    src={property.main_image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                {!isSelected && selectedProperties.length < 6 && (
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4 text-gray-700" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-white/90 text-gray-900">
                    {property.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                  {property.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {property.location}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-red-600">
                    {property.price}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.beds} Beds
                  </span>
                  <span className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.baths} Baths
                  </span>
                  <span className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {property.sqft}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No properties found matching your search.</p>
        </div>
      )}
    </div>
  )
} 