"use client"

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square } from "lucide-react"

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

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
  latitude?: number | null
  longitude?: number | null
}

interface PropertiesMapProps {
  properties: Property[]
}

// Helper function to get coordinates from location string
const getCoordinatesFromLocation = (location: string) => {
  // Mapping Wisconsin locations to coordinates
  const locationMap: { [key: string]: [number, number] } = {
    'Green Bay, WI': [44.5133, -88.0133],
    'Milwaukee, WI': [43.0389, -87.9065],
    'Madison, WI': [43.0731, -89.4012],
    'Appleton, WI': [44.2619, -88.4154],
    'Oshkosh, WI': [44.0247, -88.5426],
    'Eau Claire, WI': [44.8113, -91.4985],
    'Kenosha, WI': [42.5847, -87.8212],
    'Racine, WI': [42.7261, -87.7829],
    'Waukesha, WI': [43.0117, -88.2315],
    'Fond du Lac, WI': [43.7730, -88.4470],
  }

  // Check if we have coordinates for this location
  for (const [key, coords] of Object.entries(locationMap)) {
    if (location.toLowerCase().includes(key.toLowerCase().split(',')[0])) {
      return coords
    }
  }

  // Default to center of Wisconsin if no match found
  return [44.2619, -89.6165] as [number, number]
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

export default function PropertiesMap({ properties }: PropertiesMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Fix for default markers in react-leaflet
    if (typeof window !== 'undefined') {
      const setupLeafletIcons = async () => {
        const L = (await import('leaflet')).default
        
        // Only delete if the property exists
        if ((L.Icon?.Default?.prototype as any)?._getIconUrl) {
          delete (L.Icon.Default.prototype as any)._getIconUrl
        }
        
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })
      }
      
      setupLeafletIcons()
    }
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
      </div>
    )
  }

  // Filter properties that have valid coordinates
  const propertiesWithCoords = properties.map(property => {
    const coordinates = property.latitude && property.longitude 
      ? [property.latitude, property.longitude] as [number, number]
      : getCoordinatesFromLocation(property.location)
    
    return {
      ...property,
      coordinates
    }
  })

  // Calculate center point for the map
  const centerCoords: [number, number] = propertiesWithCoords.length > 0 
    ? [
        propertiesWithCoords.reduce((sum, property) => sum + property.coordinates[0], 0) / propertiesWithCoords.length,
        propertiesWithCoords.reduce((sum, property) => sum + property.coordinates[1], 0) / propertiesWithCoords.length
      ]
    : [44.2619, -89.6165] // Default center of Wisconsin

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={centerCoords}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {propertiesWithCoords.map(property => (
          <Marker key={property.id} position={property.coordinates}>
            <Popup maxWidth={300} className="custom-popup">
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-white text-xs ${getStatusColor(property.status)}`}>
                    {property.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="text-xs">{property.location}</span>
                </div>
                <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-3 w-3 mr-1" />
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-3 w-3 mr-1" />
                    <span>{property.baths}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-3 w-3 mr-1" />
                    <span>{property.sqft}</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600 mb-2">{property.price}</p>
                <Link 
                  href={`/available-homes/${property.id}`}
                  className="inline-block bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 