"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import PropertyMap from "@/components/property-map"
import { 
  ArrowLeft,
  ArrowRight,
  MapPin,
  Ruler,
  School,
  Zap,
  Trees,
  Phone,
  Mail,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  Check
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
  lot_images: { 
    image_url: string
    image_type: string
    title?: string
    description?: string
  }[]
}

interface LotDetailPageProps {
  params: { id: string }
}

export default function LotDetailPage({ params }: LotDetailPageProps) {
  const [lot, setLot] = useState<Lot | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedImageType, setSelectedImageType] = useState<string>('all')

  useEffect(() => {
    fetchLot()
  }, [params.id])

  const fetchLot = async () => {
    try {
      const response = await fetch(`/api/lots/${params.id}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setLot(data)
      } else {
        console.error('Lot not found')
      }
    } catch (error) {
      console.error('Error fetching lot:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAllImages = () => {
    if (!lot) return []
    
    const images = []
    
    // Add main image first
    if (lot.main_image) {
      images.push({
        image_url: lot.main_image,
        image_type: 'main',
        title: lot.lot_number,
        description: 'Main view'
      })
    }
    
    // Add additional images
    if (lot.lot_images) {
      images.push(...lot.lot_images)
    }
    
    return images
  }

  const getFilteredImages = () => {
    const allImages = getAllImages()
    if (selectedImageType === 'all') {
      return allImages
    }
    return allImages.filter(img => img.image_type === selectedImageType)
  }

  const filteredImages = getFilteredImages()
  const imageTypes = ['all', ...Array.from(new Set(getAllImages().map(img => img.image_type)))]

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev >= filteredImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev <= 0 ? filteredImages.length - 1 : prev - 1
    )
  }

  const getImageTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      all: 'All Images',
      main: 'Main View',
      photo: 'Photos',
      survey: 'Survey',
      aerial: 'Aerial View',
      plat: 'Plat Map',
      other: 'Other'
    }
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-600 hover:bg-green-700">Available</Badge>
      case 'reserved':
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Reserved</Badge>
      case 'sold':
        return <Badge className="bg-gray-600 hover:bg-gray-700">Sold</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lot details...</p>
        </div>
      </div>
    )
  }

  if (!lot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trees className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lot Not Found</h1>
          <p className="text-gray-600 mb-6">The lot you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/lots">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lots
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="outline" asChild>
            <Link href="/lots">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Available Lots
            </Link>
          </Button>
        </div>
      </div>

      {/* Lot Gallery - Hero Section */}
      {filteredImages.length > 0 && (
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            {/* Image Type Filter */}
            {imageTypes.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {imageTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedImageType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedImageType(type)
                      setCurrentImageIndex(0)
                    }}
                    className={selectedImageType === type ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    {getImageTypeLabel(type)}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Main Image Display */}
            <div className="relative mb-4">
              <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-lg overflow-hidden">
                {filteredImages[currentImageIndex] ? (
                  <Image
                    src={filteredImages[currentImageIndex].image_url}
                    alt={filteredImages[currentImageIndex].title || lot.lot_number}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Trees className="w-16 h-16 text-gray-500" />
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {filteredImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                    {currentImageIndex + 1} / {filteredImages.length}
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {getStatusBadge(lot.status)}
                </div>

                {/* Featured Badge */}
                {lot.is_featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white">
                      Featured Lot
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {filteredImages.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-4">
                  {filteredImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 bg-gray-200 rounded overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-red-600' : 'hover:opacity-80'
                      }`}
                    >
                      <Image
                        src={image.image_url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Lot Details Section */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Lot Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{lot.lot_number}</h1>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-red-600" />
                      {lot.address && `${lot.address}, `}{lot.subdivision}
                    </p>
                    <p className="text-gray-600">
                      {lot.city}, {lot.state} {lot.zip_code}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      ${lot.price?.toLocaleString()}
                    </div>
                    <span className="text-gray-500 text-sm">lot price</span>
                  </div>
                </div>

                {/* Lot Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Ruler className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{lot.lot_size}</div>
                    <div className="text-sm text-gray-600">acres</div>
                  </div>
                  <div className="text-center">
                    <School className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-sm font-bold text-gray-900">{lot.school_district?.split(' ')[0]}</div>
                    <div className="text-sm text-gray-600">School District</div>
                  </div>
                  {lot.hoa_fees && (
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-gray-900">${lot.hoa_fees}</div>
                      <div className="text-sm text-gray-600">HOA/month</div>
                    </div>
                  )}
                  {lot.utilities_status && (
                    <div className="text-center">
                      <Zap className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-sm font-bold text-gray-900">Ready</div>
                      <div className="text-sm text-gray-600">Utilities</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Lot</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {lot.description || `This ${lot.lot_size} acre lot in ${lot.subdivision} offers an excellent opportunity to build your dream home. Located in the desirable ${lot.school_district}, this lot provides the perfect setting for your new home.`}
                  </p>
                </div>

                {/* Utilities */}
                {lot.utilities_status && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Utilities</h2>
                    <p className="text-gray-700">{lot.utilities_status}</p>
                  </div>
                )}

                {/* Features */}
                {lot.lot_features && lot.lot_features.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Lot Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {lot.lot_features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">{feature.feature_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Map Section */}
              {lot.latitude && lot.longitude && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <div className="h-96 rounded-lg overflow-hidden">
                    <PropertyMap 
                      latitude={lot.latitude} 
                      longitude={lot.longitude}
                      title={lot.lot_number}
                      location={`${lot.address || lot.subdivision}, ${lot.city}, ${lot.state}`}
                      price={`$${lot.price?.toLocaleString()}`}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Interested in this lot?
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                      <Link href="/contact">
                        <Phone className="w-4 h-4 mr-2" />
                        Schedule Site Visit
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/plans">
                        <Home className="w-4 h-4 mr-2" />
                        View House Plans
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/contact">
                        <Mail className="w-4 h-4 mr-2" />
                        Ask Questions
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Listed {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {lot.city}, {lot.state}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build on This Lot?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Let us help you turn this lot into your dream home. Contact us today to discuss your vision and explore our house plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Link href="/contact">
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Link href="/lots">
                View More Lots
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 