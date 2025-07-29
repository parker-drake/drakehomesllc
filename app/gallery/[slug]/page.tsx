"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X, MapPin, Calendar, ArrowLeft } from 'lucide-react'

interface Gallery {
  id: string
  name: string
  slug: string
  description?: string
}

interface GalleryImage {
  id: string
  title: string
  description: string
  location: string
  year: string
  gallery_id: string
  image_url: string
  is_featured: boolean
}

export default function GalleryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGalleryAndImages()
  }, [slug])

  const fetchGalleryAndImages = async () => {
    setLoading(true)
    try {
      // First, fetch all galleries to find the one with matching slug
      const galleriesResponse = await fetch('/api/galleries')
      if (galleriesResponse.ok) {
        const galleries = await galleriesResponse.json()
        const currentGallery = galleries.find((g: Gallery) => g.slug === slug)
        
        if (currentGallery) {
          setGallery(currentGallery)
          
          // Fetch images for this gallery
          const imagesResponse = await fetch(`/api/gallery?galleryId=${currentGallery.id}`)
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json()
            // Sort featured images first
            const sortedData = imagesData.sort((a: GalleryImage, b: GalleryImage) => {
              if (a.is_featured && !b.is_featured) return -1
              if (!a.is_featured && b.is_featured) return 1
              return 0
            })
            setImages(sortedData)
          }
        } else {
          // Gallery not found, redirect to galleries page
          router.push('/gallery')
        }
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image)
    setImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = imageIndex > 0 ? imageIndex - 1 : images.length - 1
      setImageIndex(newIndex)
      setSelectedImage(images[newIndex])
    } else {
      const newIndex = imageIndex < images.length - 1 ? imageIndex + 1 : 0
      setImageIndex(newIndex)
      setSelectedImage(images[newIndex])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading gallery...</p>
      </div>
    )
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Gallery not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/gallery')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Galleries
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{gallery.name}</h1>
          {gallery.description && (
            <p className="text-lg text-gray-600 max-w-3xl">{gallery.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {images.length} {images.length === 1 ? 'Image' : 'Images'}
          </p>
        </div>

        {/* Images Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                onClick={() => openLightbox(image, index)}
              >
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
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
            <p className="text-gray-500">No images in this gallery yet.</p>
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