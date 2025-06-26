export const enhancedLocalBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "name": "Drake Homes LLC",
  "alternateName": ["Drake Homes", "Drake Homes Wisconsin"],
  "description": "Premier home construction company in Wisconsin's Fox Valley area specializing in custom homes, quality construction, and exceptional customer service.",
  "url": "https://drakehomesllc.com",
  "logo": "https://drakehomesllc.com/DrakeHomes_Logo.jpg",
  "image": "https://drakehomesllc.com/DrakeHomes_Logo.jpg",
  "email": "info@drakehomesllc.com",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Wisconsin",
    "addressLocality": "Fox Valley",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 44.2619,
    "longitude": -88.4154
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Appleton",
      "containedInPlace": {
        "@type": "State",
        "name": "Wisconsin"
      }
    },
    {
      "@type": "City", 
      "name": "Green Bay",
      "containedInPlace": {
        "@type": "State",
        "name": "Wisconsin"
      }
    },
    {
      "@type": "City",
      "name": "Oshkosh", 
      "containedInPlace": {
        "@type": "State",
        "name": "Wisconsin"
      }
    },
    {
      "@type": "State",
      "name": "Wisconsin",
      "description": "Fox Valley area and surrounding communities"
    }
  ],
  "serviceType": [
    "Custom Home Construction",
    "New Home Building", 
    "Residential Construction",
    "Quality Home Construction",
    "Home Design and Build"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Construction Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Custom Home Construction",
          "description": "Complete custom home building services from design to completion"
        },
        "areaServed": "Wisconsin Fox Valley"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "New Home Construction",
          "description": "Quality new home construction with modern features and craftsmanship"
        },
        "areaServed": "Wisconsin Fox Valley"
      }
    ]
  },
  "openingHours": [
    "Mo 08:00-17:00",
    "Tu 08:00-17:00", 
    "We 08:00-17:00",
    "Th 08:00-17:00",
    "Fr 08:00-17:00"
  ],
  "priceRange": "$$",
  "paymentAccepted": ["Cash", "Check", "Financing"],
  "currenciesAccepted": "USD",
  "foundingDate": "2020",
  "slogan": "Where Quality and Value Meet",
  "keywords": "home construction, custom homes, quality builder, Wisconsin homes, Fox Valley construction",
  "sameAs": [
    "https://www.facebook.com/drakehomesllc",
    "https://www.linkedin.com/company/drake-homes-llc"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "email": "info@drakehomesllc.com",
      "contactType": "customer service",
      "areaServed": "Wisconsin",
      "availableLanguage": "English"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "ratingCount": "15",
    "bestRating": "5",
    "worstRating": "1"
  }
} 