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

  // Optional: Add a refresh mechanism if documents disappear
  const refreshPlan = () => {
    setLoading(true)
    fetchPlan()
  }

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/plans/${params.id}`, {
        // Add cache headers to prevent stale data
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      if (response.ok) {
        const data = await response.json()
        // Validate that plan_documents is properly formatted
        if (data.plan_documents && !Array.isArray(data.plan_documents)) {
          console.warn('Plan documents is not an array, converting:', data.plan_documents)
          data.plan_documents = []
        }
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

      {/* Plan Gallery - Hero Section */}
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

                {/* Featured Badge */}
                {plan.is_featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
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
          </div>
        </section>
      )}

      {/* Plan Details Section */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Plan Info */}
            <div className="flex-1">
              <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{plan.title}</h1>
                    <Badge variant="outline" className="mb-4">{plan.style} Style</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      ${plan.price?.toLocaleString()}
                    </div>
                    <span className="text-gray-500 text-sm">starting</span>
                  </div>
                </div>

                {/* Plan Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Square className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{plan.square_footage?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">sq ft</div>
                  </div>
                  <div className="text-center">
                    <Bed className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{plan.bedrooms}</div>
                    <div className="text-sm text-gray-600">bedroom{plan.bedrooms !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-center">
                    <Bath className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{plan.bathrooms}</div>
                    <div className="text-sm text-gray-600">bathroom{plan.bathrooms !== 1 ? 's' : ''}</div>
                  </div>
                  {plan.garage_spaces > 0 && (
                    <div className="text-center">
                      <Car className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-gray-900">{plan.garage_spaces}</div>
                      <div className="text-sm text-gray-600">car garage</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Plan</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {plan.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Card */}
            <div className="lg:w-80">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested in this plan?</h3>
                  
                  <div className="space-y-3 mb-6">
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

                  <div className="text-center text-sm text-gray-600 border-t pt-4">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Serving Wisconsin's Fox Valley
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Floor Plans & Documents */}
      {plan.plan_documents && plan.plan_documents.length > 0 ? (
        <section className="py-8 bg-white border-t">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Floor Plans & Documents</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshPlan}
                className="text-gray-600 hover:text-gray-800"
              >
                Refresh
              </Button>
            </div>
            
            {/* Document Tabs */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {plan.plan_documents.map((doc, index) => (
                  <Button
                    key={index}
                    variant={selectedDocument === doc.document_url ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDocument(doc.document_url)}
                    className={`${
                      selectedDocument === doc.document_url 
                        ? "bg-red-600 hover:bg-red-700 text-white" 
                        : "hover:bg-gray-100"
                    } transition-all`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {doc.title}
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 text-xs ${
                        selectedDocument === doc.document_url ? "bg-red-500 text-white" : ""
                      }`}
                    >
                      {doc.file_type.toUpperCase()}
                    </Badge>
                  </Button>
                ))}
              </div>
              
              {/* Document Info */}
              {selectedDocument && (
                <div className="bg-gray-50 p-3 rounded-lg border mb-4">
                  {(() => {
                    const selectedDoc = plan.plan_documents.find(doc => doc.document_url === selectedDocument);
                    return selectedDoc ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{selectedDoc.title}</h3>
                          <p className="text-xs text-gray-600">{selectedDoc.description}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={selectedDoc.document_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </a>
                        </Button>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
            
            {/* Document Viewer */}
            <div className="w-full">
              {selectedDocument ? (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-[60vh] bg-gray-100">
                      {selectedDocument.toLowerCase().endsWith('.pdf') ? (
                        <iframe
                          src={`${selectedDocument}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
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
                    <div className="p-3 bg-gray-50 border-t">
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <p>Use browser controls to zoom and navigate</p>
                        <Button variant="outline" size="sm" asChild>
                          <a href={selectedDocument} target="_blank" rel="noopener noreferrer">
                            <ZoomIn className="w-3 h-3 mr-1" />
                            Full Screen
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
                    <p className="text-gray-600 mb-6">
                      Choose from the available floor plans and documents above.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-xl mx-auto">
                      {plan.plan_documents.map((doc, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => setSelectedDocument(doc.document_url)}
                          className="h-auto p-3 text-left hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="bg-red-100 p-1.5 rounded">
                              <FileText className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                              <p className="text-xs text-gray-500">{doc.file_type.toUpperCase()}</p>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* Plan Features */}
      {plan.plan_features && plan.plan_features.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {plan.plan_features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-900 text-sm">{feature.feature_name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plan Specifications */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Square className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Square Footage</h3>
                <p className="text-xl font-bold text-red-600">{plan.square_footage?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">sq ft</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Home className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Stories</h3>
                <p className="text-xl font-bold text-red-600">{plan.floors}</p>
                <p className="text-xs text-gray-500">floor{plan.floors !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Bed className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Bedrooms</h3>
                <p className="text-xl font-bold text-red-600">{plan.bedrooms}</p>
                <p className="text-xs text-gray-500">bedroom{plan.bedrooms !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Bath className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Bathrooms</h3>
                <p className="text-xl font-bold text-red-600">{plan.bathrooms}</p>
                <p className="text-xs text-gray-500">bathroom{plan.bathrooms !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build {plan.title}?
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