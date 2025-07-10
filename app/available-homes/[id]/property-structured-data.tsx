import Script from "next/script"
import { supabaseAdmin } from "@/lib/supabase-admin"

interface PropertyStructuredDataProps {
  propertyId: string
}

export async function PropertyStructuredData({ propertyId }: PropertyStructuredDataProps) {
  try {
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          image_url,
          is_main,
          display_order
        )
      `)
      .eq('id', propertyId)
      .single()

    if (error || !property) {
      return null
    }

    // Get all images
    const images: string[] = []
    if (property.main_image) {
      images.push(property.main_image)
    }
    if (property.property_images) {
      property.property_images.forEach((img: { image_url: string }) => {
        if (!images.includes(img.image_url)) {
          images.push(img.image_url)
        }
      })
    }

    // Create Real Estate Listing structured data
    const realEstateListingSchema = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "@id": `https://drakehomesllc.com/available-homes/${property.id}`,
      "name": property.title,
      "description": property.description,
      "url": `https://drakehomesllc.com/available-homes/${property.id}`,
      "datePosted": property.created_at,
      "dateModified": property.updated_at,
      "offers": {
        "@type": "Offer",
        "price": property.price === "SOLD" ? undefined : property.price.replace(/[$,]/g, ''),
        "priceCurrency": "USD",
        "availability": property.availability_status === "Sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        "validFrom": property.created_at,
      },
      "realestateListing": {
        "@type": "RealEstateListing",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": property.location.split(',')[0]?.trim() || property.location,
          "addressLocality": property.location.split(',')[1]?.trim() || "Fox Valley",
          "addressRegion": "WI",
          "addressCountry": "US"
        },
        "geo": property.latitude && property.longitude ? {
          "@type": "GeoCoordinates",
          "latitude": property.latitude,
          "longitude": property.longitude
        } : undefined,
      },
      "property": {
        "@type": "Residence",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": property.location.split(',')[0]?.trim() || property.location,
          "addressLocality": property.location.split(',')[1]?.trim() || "Fox Valley",
          "addressRegion": "WI",
          "addressCountry": "US"
        },
        "numberOfRooms": property.beds + property.baths + 2, // Bedrooms + bathrooms + estimated other rooms
        "numberOfBedrooms": property.beds,
        "numberOfBathroomsTotal": property.baths,
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": property.sqft.replace(/[^0-9]/g, ''),
          "unitCode": "FTK" // Square feet
        },
        "lotSize": property.lot_size ? {
          "@type": "QuantitativeValue",
          "value": property.lot_size,
          "unitCode": "ACR" // Acres
        } : undefined,
        "yearBuilt": property.year_built,
        "amenityFeature": property.features.map((feature: string) => ({
          "@type": "LocationFeatureSpecification",
          "name": feature,
          "value": true
        }))
      },
      "image": images,
      "seller": {
        "@type": "RealEstateAgent",
        "name": "Drake Homes LLC",
        "telephone": "920-740-6660",
        "email": "info@drakehomesllc.com",
        "url": "https://drakehomesllc.com"
      }
    }

    // Breadcrumb structured data
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://drakehomesllc.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Available Homes",
          "item": "https://drakehomesllc.com/available-homes"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": property.location,
          "item": `https://drakehomesllc.com/available-homes/${property.id}`
        }
      ]
    }

    return (
      <>
        <Script
          id="property-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateListingSchema) }}
        />
        <Script
          id="property-breadcrumb-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </>
    )
  } catch (error) {
    console.error("Error generating structured data:", error)
    return null
  }
} 