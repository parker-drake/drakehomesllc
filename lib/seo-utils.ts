// SEO utility functions for better search engine optimization

/**
 * Convert property address to URL-friendly slug
 * Example: "2020 Red Fox Ln, Kaukauna" => "2020-red-fox-ln-kaukauna"
 */
export function addressToSlug(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

/**
 * Generate SEO-friendly title from property data
 */
export function generatePropertyTitle(property: {
  location: string
  beds: number
  baths: number
  sqft: string
  status: string
}): string {
  const city = property.location.split(',')[1]?.trim() || 'Wisconsin'
  return `${property.location} | ${property.beds} Bed ${property.baths} Bath ${property.sqft} Sq Ft Home in ${city} | ${property.status}`
}

/**
 * Generate meta description from property data
 */
export function generatePropertyDescription(property: {
  location: string
  beds: number
  baths: number
  sqft: string
  price: string
  status: string
  features?: string[]
}): string {
  const features = property.features?.slice(0, 3).join(', ') || ''
  const featuresText = features ? ` Features: ${features}.` : ''
  
  return `${property.location} - ${property.beds} bedroom, ${property.baths} bathroom home with ${property.sqft} sq ft.${featuresText} ${property.status}. Price: ${property.price}. Call Drake Homes LLC at (920) 740-6660.`
}

/**
 * Generate keywords from property data
 */
export function generatePropertyKeywords(property: {
  location: string
  beds: number
  baths: number
  status: string
  school_district?: string
  property_type?: string
}): string[] {
  const keywords = [
    property.location,
    `${property.location} home for sale`,
    `${property.beds} bedroom home`,
    `${property.baths} bathroom home`,
    property.status.toLowerCase(),
    'Drake Homes LLC',
    'Wisconsin real estate',
    'Fox Valley homes',
    'custom homes Wisconsin'
  ]

  // Add city-specific keywords
  const city = property.location.split(',')[1]?.trim()
  if (city) {
    keywords.push(
      `${city} homes for sale`,
      `${city} real estate`,
      `${city} new construction`
    )
  }

  // Add school district if available
  if (property.school_district) {
    keywords.push(
      `${property.school_district} schools`,
      `homes in ${property.school_district} district`
    )
  }

  // Add property type if available
  if (property.property_type) {
    keywords.push(property.property_type.toLowerCase())
  }

  return keywords.filter(Boolean)
}

/**
 * Get canonical URL for a property
 */
export function getPropertyCanonicalUrl(propertyId: string, baseUrl: string = 'https://drakehomesllc.com'): string {
  return `${baseUrl}/available-homes/${propertyId}`
}

/**
 * Format price for structured data (remove currency symbols and commas)
 */
export function formatPriceForStructuredData(price: string): string | undefined {
  if (price === 'SOLD' || price === 'PENDING' || !price) {
    return undefined
  }
  return price.replace(/[$,]/g, '')
} 

export function generateCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://drakehomesllc.com'
  // Remove trailing slashes and ensure proper formatting
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const finalPath = cleanPath === '/' ? '' : cleanPath.replace(/\/$/, '')
  return `${baseUrl}${finalPath}`
}

export function generateMetaTags({
  title,
  description,
  canonical,
  ogImage,
  noIndex = false,
}: {
  title: string
  description: string
  canonical: string
  ogImage?: string
  noIndex?: boolean
}) {
  const metaTags: any = {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Drake Homes LLC',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }

  if (ogImage) {
    metaTags.openGraph.images = [{
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    }]
    metaTags.twitter.images = [ogImage]
  }

  if (noIndex) {
    metaTags.robots = {
      index: false,
      follow: false,
    }
  }

  return metaTags
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

export function generatePropertySchema(property: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description,
    image: property.main_image,
    offers: {
      '@type': 'Offer',
      price: property.price?.replace(/[^0-9]/g, '') || '0',
      priceCurrency: 'USD',
      availability: property.status === 'Move-In Ready' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/PreOrder',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location,
      addressLocality: property.city || 'Appleton',
      addressRegion: 'WI',
      addressCountry: 'US',
    },
    numberOfRooms: property.beds,
    numberOfBathroomsTotal: property.baths,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.sqft,
      unitCode: 'FTK', // Square feet
    },
  }
} 