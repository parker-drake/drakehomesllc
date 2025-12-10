import { Metadata } from "next"
import { supabaseAdmin } from "@/lib/supabase-admin"

interface Property {
  id: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: string
  description: string
  main_image?: string
  status: string
  availability_status?: string
  features: string[]
  latitude?: number
  longitude?: number
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Fetch property data
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !property) {
      return {
        title: "Property Not Found",
        description: "This property listing is no longer available.",
      }
    }

    // Create SEO-friendly title with address
    const title = `${property.location} - ${property.beds} Bed ${property.baths} Bath Home`
    
    // Create detailed description with key property features
    const description = `${property.location} - ${property.description.slice(0, 120)}... ${property.beds} bedrooms, ${property.baths} bathrooms, ${property.sqft} sq ft. ${property.status}. Call (920) 740-6660 for details.`

    // Get price for meta tags
    const price = property.price === "SOLD" ? "SOLD" : property.price

    return {
      title,
      description,
      keywords: [
        property.location,
        `${property.location} home for sale`,
        `${property.beds} bedroom home ${property.location.split(',')[1]?.trim() || 'Wisconsin'}`,
        "Drake Homes LLC",
        property.status,
        "Wisconsin real estate",
        "Fox Valley homes",
        property.school_district ? `${property.school_district} schools` : "",
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        url: `https://drakehomesllc.com/available-homes/${params.id}`,
        type: "website",
        images: property.main_image ? [
          {
            url: property.main_image,
            width: 1200,
            height: 630,
            alt: `${property.location} - Exterior view`,
          }
        ] : [],
        locale: "en_US",
        siteName: "Drake Homes LLC",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: property.main_image ? [property.main_image] : [],
      },
      alternates: {
        canonical: `/available-homes/${params.id}`,
      },
      robots: {
        index: property.availability_status !== 'Sold',
        follow: property.availability_status !== 'Sold',
        "max-image-preview": "large",
        "max-snippet": -1,
      },
      other: {
        "property:price": price,
        "property:location": property.location,
        "property:bedrooms": property.beds.toString(),
        "property:bathrooms": property.baths.toString(),
        "property:square_feet": property.sqft,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Property Details",
      description: "View property details from Drake Homes LLC in Wisconsin's Fox Valley area.",
    }
  }
}

import { PropertyStructuredData } from './property-structured-data'

export default function PropertyLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <>
      <PropertyStructuredData propertyId={params.id} />
      {children}
    </>
  )
} 