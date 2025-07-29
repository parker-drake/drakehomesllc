"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LazyImage } from '@/components/ui/lazy-image'
import { ChevronLeft, ChevronRight, X, MapPin, Calendar } from 'lucide-react'

interface Gallery {
  id: string
  name: string
  slug: string
  description?: string
  image_count?: number
}

interface GalleryImage {
  id: string
  title: string
  description: string
  location: string
  year: string
  gallery_id: string
  gallery?: Gallery
  image_url: string
  is_featured: boolean
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [selectedGallery, setSelectedGallery] = useState('all')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGalleries()
    fetchImages()
  }, [selectedGallery])

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/galleries')
      if (response.ok) {
        const data = await response.json()
        setGalleries(data.filter((g: Gallery) => g.image_count && g.image_count > 0))
      }
    } catch (error) {
      console.error('Error fetching galleries:', error)
    }
  }

  const fetchImages = async () => {
    setLoading(true)
    try {
      let url = '/api/gallery'
      if (selectedGallery !== 'all') {
        url += `?galleryId=${selectedGallery}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        // Sort featured images first
        const sortedData = data.sort((a: GalleryImage, b: GalleryImage) => {
          if (a.is_featured && !b.is_featured) return -1
          if (!a.is_featured && b.is_featured) return 1
          return 0
        })
        setImages(sortedData)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = selectedGallery === 'all' 
    ? images 
    : images.filter(img => img.gallery_id === selectedGallery)

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image)
    setImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    const currentImages = filteredImages
    if (direction === 'prev') {
      const newIndex = imageIndex > 0 ? imageIndex - 1 : currentImages.length - 1
      setImageIndex(newIndex)
      setSelectedImage(currentImages[newIndex])
    } else {
      const newIndex = imageIndex < currentImages.length - 1 ? imageIndex + 1 : 0
      setImageIndex(newIndex)
      setSelectedImage(currentImages[newIndex])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading gallery...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Gallery</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our portfolio of custom homes and renovations. Each project showcases our commitment to quality craftsmanship and attention to detail.
          </p>
        </div>

        {/* Gallery Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={selectedGallery === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedGallery('all')}
            className={selectedGallery === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            All Projects
          </Button>
          {galleries.map((gallery) => (
            <Button
              key={gallery.id}
              variant={selectedGallery === gallery.id ? 'default' : 'outline'}
              onClick={() => setSelectedGallery(gallery.id)}
              className={selectedGallery === gallery.id ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {gallery.name}
            </Button>
          ))}
        </div>

        {/* Images Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                onClick={() => openLightbox(image, index)}
              >
                <div className="relative h-64 bg-gray-200">
                  <LazyImage
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold mb-1">{image.title}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        {image.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {image.location}
                          </span>
                        )}
                        {image.year && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {image.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {image.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No images available in this gallery.</p>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="max-w-5xl max-h-[90vh] flex flex-col">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain"
              />
              <div className="text-white mt-4 text-center">
                <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-gray-300 mb-2">{selectedImage.description}</p>
                )}
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                  {selectedImage.gallery?.name && (
                    <span>{selectedImage.gallery.name}</span>
                  )}
                  {selectedImage.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedImage.location}
                    </span>
                  )}
                  {selectedImage.year && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {selectedImage.year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 