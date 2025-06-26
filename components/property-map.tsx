"use client"

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

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

interface PropertyMapProps {
  location: string
  title: string
  price: string
  latitude?: number
  longitude?: number
}

// Helper function to get coordinates from location string
const getCoordinatesFromLocation = (location: string) => {
  // For demo purposes, mapping some locations to coordinates
  // In production, you'd use a geocoding service
  const locationMap: { [key: string]: [number, number] } = {
    'Green Bay, WI': [44.5133, -88.0133],
    'Milwaukee, WI': [43.0389, -87.9065],
    'Madison, WI': [43.0731, -89.4012],
    'Appleton, WI': [44.2619, -88.4154],
    'Oshkosh, WI': [44.0247, -88.5426],
    'Eau Claire, WI': [44.8113, -91.4985],
  }

  // Check if we have coordinates for this location
  for (const [key, coords] of Object.entries(locationMap)) {
    if (location.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(location.toLowerCase())) {
      return coords
    }
  }

  // Default to center of Wisconsin if no match found
  return [44.2619, -89.6165] as [number, number]
}

export default function PropertyMap({ location, title, price, latitude, longitude }: PropertyMapProps) {
  const mapRef = useRef<any>(null)

  // Use provided coordinates or derive from location string
  const coordinates: [number, number] = latitude && longitude 
    ? [latitude, longitude]
    : getCoordinatesFromLocation(location)

  useEffect(() => {
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

  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={coordinates}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-600 mb-1">{location}</p>
              <p className="text-lg font-bold text-red-600">{price}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
} 