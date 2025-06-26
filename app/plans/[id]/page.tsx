"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft,
  ArrowRight,
  Bed, 
  Bath, 
  Square, 
  Car,
  Home,
  Star,
  Phone,
  Mail,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  ZoomIn
} from "lucide-react"

interface Plan {
  id: string
  title: string
  description: string
  square_footage: number
  bedrooms: number
  bathrooms: number
  floors: number
  garage_spaces: number
  style: string
  price: number
  main_image: string
  is_featured: boolean
  plan_features: { feature_name: string }[]
  plan_images: { 
    image_url: string
    image_type: string
    title?: string
    description?: string
  }[]
  plan_documents?: {
    document_url: string
    document_type: string
    file_type: string
    title?: string
    description?: string
  }[]
}

interface PlanDetailPageProps {
  params: { id: string }
}

export default function PlanDetailPage({ params }: PlanDetailPageProps) {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedImageType, setSelectedImageType] = useState<string>('all')
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)

  useEffect(() => {
    fetchPlan()
  }, [params.id])

  useEffect(() => {
    // Auto-select first floor plan document when available
    if (plan?.plan_documents && plan.plan_documents.length > 0 && !selectedDocument) {
      const floorPlan = plan.plan_documents.find(doc => doc.document_type === 'floor_plan')
      if (floorPlan) {
        setSelectedDocument(floorPlan.document_url)
      }
    }
  }, [plan, selectedDocument])

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/plans/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPlan(data)
      } else {
        console.error('Plan not found')
      }
    } catch (error) {
      console.error('Error fetching plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAllImages = () => {
    if (!plan) return []
    
    const images = []
    
    // Add main image first
    if (plan.main_image) {
      images.push({
        image_url: plan.main_image,
        image_type: 'main',
        title: plan.title,
        description: 'Main view'
      })
    }
    
    // Add additional images
    if (plan.plan_images) {
      images.push(...plan.plan_images)
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
      floor_plan: 'Floor Plans',
      elevation: 'Elevations',
      interior: 'Interior Views'
    }
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan details...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plan Not Found</h1>
          <p className="text-gray-600 mb-6">The plan you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/plans">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
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
            <Link href="/plans">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Link>
          </Button>
        </div>
      </div>

      {/* Plan Header */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{plan.title}</h1>
                {plan.is_featured && (
                  <Badge className="bg-red-600 hover:bg-red-700">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="mb-4">{plan.style} Style</Badge>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                {plan.description}
              </p>
            </div>
            
            <div className="lg:w-80">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-red-600">
                      ${plan.price?.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-2">starting</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="text-center">
                      <Square className="w-5 h-5 text-red-600 mx-auto mb-1" />
                      <p className="font-medium">{plan.square_footage?.toLocaleString()}</p>
                      <p className="text-gray-500">sq ft</p>
                    </div>
                    <div className="text-center">
                      <Bed className="w-5 h-5 text-red-600 mx-auto mb-1" />
                      <p className="font-medium">{plan.bedrooms}</p>
                      <p className="text-gray-500">bedroom{plan.bedrooms !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-center">
                      <Bath className="w-5 h-5 text-red-600 mx-auto mb-1" />
                      <p className="font-medium">{plan.bathrooms}</p>
                      <p className="text-gray-500">bathroom{plan.bathrooms !== 1 ? 's' : ''}</p>
                    </div>
                    {plan.garage_spaces > 0 && (
                      <div className="text-center">
                        <Car className="w-5 h-5 text-red-600 mx-auto mb-1" />
                        <p className="font-medium">{plan.garage_spaces}</p>
                        <p className="text-gray-500">car garage</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                      <Link href="/contact">
                        <Phone className="w-4 h-4 mr-2" />
                        Request Quote
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/contact">
                        <Mail className="w-4 h-4 mr-2" />
                        Ask Questions
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

             {/* Floor Plans & Documents */}
      {plan.plan_documents && plan.plan_documents.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Floor Plans & Documents</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Document List */}
              <div className="lg:col-span-1">
                <div className="space-y-3">
                  {plan.plan_documents.map((doc, index) => (
                    <Card 
                      key={index} 
                      className={`cursor-pointer transition-all ${
                        selectedDocument === doc.document_url ? 'ring-2 ring-red-600 bg-red-50' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedDocument(doc.document_url)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{doc.title}</h3>
                            <p className="text-sm text-gray-600">{doc.description}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {doc.file_type.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedDocument(doc.document_url)
                              }}
                            >
                              <ZoomIn className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Document Viewer */}
              <div className="lg:col-span-2">
                {selectedDocument ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative h-96 md:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                        {selectedDocument.toLowerCase().endsWith('.pdf') ? (
                          <iframe
                            src={`${selectedDocument}#toolbar=1&navpanes=1&scrollbar=1`}
                            className="w-full h-full border-0"
                            title="Floor Plan PDF"
                          />
                        ) : (
                          <Image
                            src={selectedDocument}
                            alt="Floor plan"
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="p-4 bg-gray-50 border-t">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            Click and drag to navigate • Use browser zoom for details
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <a href={selectedDocument} target="_blank" rel="noopener noreferrer">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Select a Document to View
                      </h3>
                      <p className="text-gray-600">
                        Click on any floor plan or document from the list to view it here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

       {/* Image Gallery */}
      {filteredImages.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Gallery</h2>
            
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
            <div className="relative mb-6">
              <div className="relative h-96 md:h-[500px] bg-gray-200 rounded-lg overflow-hidden">
                {filteredImages[currentImageIndex] ? (
                  <Image
                    src={filteredImages[currentImageIndex].image_url}
                    alt={filteredImages[currentImageIndex].title || plan.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Home className="w-16 h-16 text-gray-500" />
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {filteredImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {filteredImages.length}
                  </div>
                )}
              </div>
              
              {/* Image Title/Description */}
              {filteredImages[currentImageIndex]?.title && (
                <div className="mt-2 text-center">
                  <p className="font-medium text-gray-900">{filteredImages[currentImageIndex].title}</p>
                  {filteredImages[currentImageIndex].description && (
                    <p className="text-sm text-gray-600">{filteredImages[currentImageIndex].description}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {filteredImages.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {filteredImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 bg-gray-200 rounded overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-red-600' : ''
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-1 right-1 text-xs"
                    >
                      {getImageTypeLabel(image.image_type)}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Plan Features */}
      {plan.plan_features && plan.plan_features.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.plan_features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-900">{feature.feature_name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plan Specifications */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Square className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Square Footage</h3>
                <p className="text-2xl font-bold text-red-600">{plan.square_footage?.toLocaleString()}</p>
                <p className="text-sm text-gray-500">sq ft</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Home className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Stories</h3>
                <p className="text-2xl font-bold text-red-600">{plan.floors}</p>
                <p className="text-sm text-gray-500">floor{plan.floors !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Bed className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Bedrooms</h3>
                <p className="text-2xl font-bold text-red-600">{plan.bedrooms}</p>
                <p className="text-sm text-gray-500">bedroom{plan.bedrooms !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Bath className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Bathrooms</h3>
                <p className="text-2xl font-bold text-red-600">{plan.bathrooms}</p>
                <p className="text-sm text-gray-500">bathroom{plan.bathrooms !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Interested in {plan.title}?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss customization options, pricing, and timeline for your dream home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Link href="/contact">
                <Phone className="w-4 h-4 mr-2" />
                Call (920) 740-6660
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-red-500">
            <div className="flex items-center justify-center gap-2 text-red-100">
              <MapPin className="w-4 h-4" />
              <span>Serving Wisconsin's Fox Valley and surrounding areas</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 