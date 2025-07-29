"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ImageIcon, ImagePlus } from 'lucide-react'

interface Gallery {
  id: string
  name: string
  slug: string
  description?: string
  image_count?: number
  cover_image?: {
    image_url: string
  }
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/galleries')
      if (response.ok) {
        const data = await response.json()
        // Only show galleries with images
        const activeGalleries = data.filter((g: Gallery) => g.image_count && g.image_count > 0)
        
        // Fetch cover image for each gallery
        const galleriesWithCovers = await Promise.all(
          activeGalleries.map(async (gallery: Gallery) => {
            try {
              const imgResponse = await fetch(`/api/gallery?galleryId=${gallery.id}&limit=1`)
              if (imgResponse.ok) {
                const images = await imgResponse.json()
                if (images.length > 0) {
                  return { ...gallery, cover_image: images[0] }
                }
              }
            } catch (error) {
              console.error('Error fetching cover image:', error)
            }
            return gallery
          })
        )
        
        setGalleries(galleriesWithCovers)
      }
    } catch (error) {
      console.error('Error fetching galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading galleries...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Gallery</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the quality and craftsmanship that defines every Drake Homes project. Browse our galleries to explore our home builds.
          </p>
        </div>

        {/* Galleries Grid */}
        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((gallery) => (
              <Link key={gallery.id} href={`/gallery/${gallery.slug}`}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 bg-gray-200">
                    {gallery.cover_image ? (
                      <img
                        src={gallery.cover_image.image_url}
                        alt={gallery.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{gallery.name}</h3>
                      {gallery.description && (
                        <p className="text-sm text-gray-200 line-clamp-2 mb-2">
                          {gallery.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <ImagePlus className="w-4 h-4" />
                        <span>{gallery.image_count} {gallery.image_count === 1 ? 'Image' : 'Images'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No galleries available yet.</p>
            <p className="text-gray-400 mt-2">Check back soon for our latest projects!</p>
          </div>
        )}
      </div>
    </div>
  )
} 