"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Home } from 'lucide-react'

interface GalleryImage {
  id: string
  title: string
  location: string
  year: string
  category: 'exterior' | 'interior' | 'kitchen' | 'living' | 'bedroom' | 'bathroom'
  description: string
  image_url: string
  is_featured: boolean
}

const categories = [
  { key: 'all', label: 'All Projects' },
  { key: 'exterior', label: 'Exteriors' },
  { key: 'interior', label: 'Interiors' },
  { key: 'kitchen', label: 'Kitchens' },
  { key: 'living', label: 'Living Areas' },
  { key: 'bedroom', label: 'Bedrooms' },
  { key: 'bathroom', label: 'Bathrooms' }
]

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Explore our portfolio of quality homes built with excellence and attention to detail
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.key)}
                className={selectedCategory === category.key ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <Card 
                key={image.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => openLightbox(index)}
              >
                <div className="relative h-64 bg-gray-200">
                  {image.image_url ? (
                    <img 
                      src={image.image_url} 
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <Home className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-lg font-semibold">View Full Size</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{image.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{image.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{image.year}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{image.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Dream Home?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            See how we can bring your vision to life with our quality craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <a href="/contact">Get Your Free Quote</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <a href="/available-homes">View Available Homes</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
              <X className="w-8 h-8" />
            </button>
            
            <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10">
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10">
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                {filteredImages[currentImageIndex]?.image_url ? (
                  <img 
                    src={filteredImages[currentImageIndex].image_url} 
                    alt={filteredImages[currentImageIndex].title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Home className="w-24 h-24 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {filteredImages[currentImageIndex]?.title}
                </h3>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{filteredImages[currentImageIndex]?.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{filteredImages[currentImageIndex]?.year}</span>
                  </div>
                </div>
                <p className="text-gray-700">{filteredImages[currentImageIndex]?.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  Image {currentImageIndex + 1} of {filteredImages.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 