"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  Mail, 
  Share2, 
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
  ArrowLeft,
  Grid,
  X
} from "lucide-react"
import PropertyMap from "@/components/property-map"
import emailjs from '@emailjs/browser'

interface PropertyImage {
  id: string
  image_url: string
  is_main: boolean
  display_order: number
}

interface Property {
  id: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: string
  image?: string
  main_image?: string
  property_images?: PropertyImage[]
  status: string
  availability_status?: string
  description: string
  features: string[]
  completion_date: string
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
  // Property Information fields (optional)
  lot_size?: string
  year_built?: number
  property_type?: string
  garage_spaces?: number
  heating_cooling?: string
  flooring_type?: string
  school_district?: string
  hoa_fee?: string
  utilities_included?: string
  exterior_materials?: string
}

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in learning more about ${property?.title || 'this property'}.`
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)

  useEffect(() => {
    fetchProperty()
    fetchRelatedProperties()
  }, [params.id])

  useEffect(() => {
    if (property) {
      setContactForm(prev => ({
        ...prev,
        message: `I'm interested in learning more about ${property.title}.`
      }))
    }
  }, [property])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        // Ensure features is always an array and never undefined
        const cleanedData = {
          ...data,
          features: Array.isArray(data.features) ? data.features : [],
          latitude: data.latitude || null,
          longitude: data.longitude || null
        }
        setProperty(cleanedData)
      } else {
        console.error('Property not found')
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        // Filter out current property and show only 3 related ones
        const filtered = data.filter((p: Property) => p.id !== params.id).slice(0, 3)
        setRelatedProperties(filtered)
      }
    } catch (error) {
      console.error('Error fetching related properties:', error)
    }
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

  const getAvailabilityStatusColor = (availabilityStatus: string) => {
    switch (availabilityStatus) {
      case "Available":
        return "bg-green-600"
      case "Under Contract":
        return "bg-yellow-600"
      case "Coming Soon":
        return "bg-blue-600"
      case "Sold":
        return "bg-red-600"
      default:
        return "bg-green-600"
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Initialize EmailJS (only needs to be done once)
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '')

      const templateParams = {
        from_name: contactForm.name,
        from_email: contactForm.email,
        phone: contactForm.phone,
        message: contactForm.message,
        property_title: property?.title,
        property_price: property?.price,
        property_location: property?.location,
        property_id: property?.id,
        property_url: window.location.href,
        to_email: 'parker@drakehomesllc.com',
      }

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_PROPERTY || '',
        templateParams
      )
      
      alert('Thank you for your interest! We will contact you soon.')
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: `I'm interested in learning more about ${property?.title}.`
      })
    } catch (error) {
      console.error('Email send failed:', error)
      alert('Sorry, there was an error sending your message. Please try again or call us at (920) 740-6660.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  // Get all images for the property
  const getPropertyImages = () => {
    if (!property) return []
    
    const images: string[] = []
    
    // Add main_image if it exists
    if (property.main_image) {
      images.push(property.main_image)
    }
    
    // Add property_images if they exist
    if (property.property_images && property.property_images.length > 0) {
      // Sort by display_order and add to images array
      const sortedImages = [...property.property_images].sort((a, b) => a.display_order - b.display_order)
      sortedImages.forEach(img => {
        // Avoid duplicates if main_image is also in property_images
        if (!images.includes(img.image_url)) {
          images.push(img.image_url)
        }
      })
    }
    
    // Fallback to single image if no other images found
    if (images.length === 0 && property.image) {
      images.push(property.image)
    }
    
    return images
  }

  const propertyImages = getPropertyImages()

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === propertyImages.length - 1 ? 0 : prev + 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Loading property details...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Link href="/available-homes">
            <Button>← Back to Available Homes</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span>/</span>
            <Link href="/available-homes" className="hover:text-red-600">Available Homes</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <Link href="/available-homes">
              <Button variant="outline" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Available Homes
              </Button>
            </Link>

            {/* Property Images Gallery */}
            <div className="mb-6">
              <div className="relative">
                {/* Main Image Display */}
                <div className="relative h-64 lg:h-80 w-full rounded-lg overflow-hidden">
                  <Image
                    src={propertyImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {propertyImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={handlePreviousImage}
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-800" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="h-6 w-6 text-gray-800" />
                      </Button>
                    </>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                  
                  {/* Image Counter and View All Button */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    {propertyImages.length > 1 && (
                      <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {propertyImages.length}
                      </div>
                    )}
                    {propertyImages.length > 1 && (
                      <Button
                        size="sm"
                        className="bg-white/90 text-gray-800 hover:bg-white"
                        onClick={() => setShowAllImages(!showAllImages)}
                      >
                        <Grid className="h-4 w-4 mr-1" />
                        View All Photos
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Compact Thumbnail Strip (only show first 6) */}
                {propertyImages.length > 1 && showAllImages && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">All Photos ({propertyImages.length})</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowAllImages(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {propertyImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentImageIndex(index)
                            setShowAllImages(false)
                          }}
                          className={`relative aspect-square rounded overflow-hidden cursor-pointer ${
                            index === currentImageIndex ? 'ring-2 ring-red-600' : 'hover:opacity-80'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex gap-3 mb-4">
                    <Badge className={`text-white ${getStatusColor(property.status)}`}>
                      {property.status}
                    </Badge>
                    {property.availability_status && (
                      <Badge className={`text-white ${getAvailabilityStatusColor(property.availability_status)}`}>
                        {property.availability_status}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-2">{property.price}</div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{property.completion_date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bed className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.beds}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bath className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.baths}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Square className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.sqft}</div>
                  <div className="text-sm text-gray-600">Square Feet</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Home</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

                            {/* Features */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Information */}
              {(property.lot_size || property.year_built || property.garage_spaces || 
                property.heating_cooling || property.flooring_type || property.school_district || property.hoa_fee || 
                property.utilities_included || property.exterior_materials) && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Property Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.lot_size && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Lot Size:</span>
                        <span className="text-gray-900">{property.lot_size}</span>
                      </div>
                    )}
                    {property.year_built && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Year Built:</span>
                        <span className="text-gray-900">{property.year_built}</span>
                      </div>
                    )}
                    {property.garage_spaces && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Garage Spaces:</span>
                        <span className="text-gray-900">{property.garage_spaces}</span>
                      </div>
                    )}
                    {property.heating_cooling && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Heating & Cooling:</span>
                        <span className="text-gray-900">{property.heating_cooling}</span>
                      </div>
                    )}
                    {property.flooring_type && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Flooring:</span>
                        <span className="text-gray-900">{property.flooring_type}</span>
                      </div>
                    )}
                    {property.school_district && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">School District:</span>
                        <span className="text-gray-900">{property.school_district}</span>
                      </div>
                    )}
                    {property.hoa_fee && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">HOA Fee:</span>
                        <span className="text-gray-900">{property.hoa_fee}</span>
                      </div>
                    )}
                    {property.utilities_included && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Utilities Included:</span>
                        <span className="text-gray-900">{property.utilities_included}</span>
                      </div>
                    )}
                    {property.exterior_materials && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Exterior Materials:</span>
                        <span className="text-gray-900">{property.exterior_materials}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
             </div>

             {/* Location Map */}
             <div className="bg-white rounded-lg p-6 mb-8">
               <h2 className="text-xl font-semibold text-gray-900 mb-4">Location & Neighborhood</h2>
               <PropertyMap
                 location={property.location}
                 title={property.title}
                 price={property.price}
                 latitude={property.latitude}
                 longitude={property.longitude}
               />

             </div>
           </div>

           {/* Contact Form - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact About This Property</h2>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    <textarea
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                      placeholder="Your message..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button variant="outline" className="w-full mb-3">
                      <Phone className="w-4 h-4 mr-2" />
                      Call (920) 740-6660
                    </Button>
                    <Button variant="outline" className="w-full">
                      Schedule a Tour
                    </Button>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More Available Homes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((relatedProperty) => (
                <Card key={relatedProperty.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/available-homes/${relatedProperty.id}`}>
                    <div className="relative">
                      <Image
                        src={relatedProperty.image || "/placeholder.svg"}
                        alt={relatedProperty.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className={`absolute top-3 left-3 text-white ${getStatusColor(relatedProperty.status)}`}>
                        {relatedProperty.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{relatedProperty.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{relatedProperty.location}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-red-600">{relatedProperty.price}</div>
                        <div className="text-sm text-gray-600">
                          {relatedProperty.beds}bd • {relatedProperty.baths}ba
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 