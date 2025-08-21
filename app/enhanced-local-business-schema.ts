export const enhancedLocalBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "name": "Drake Homes LLC",
  "alternateName": ["Drake Homes", "Drake Homes Wisconsin"],
  "description": "Premier home construction company in Wisconsin's Fox Valley area specializing in custom homes, quality construction, and exceptional customer service. No shortcuts, only quality.",
  "url": "https://drakehomesllc.com",
  "logo": "https://drakehomesllc.com/DrakeHomes_Logo.jpg",
  "image": [
    "https://drakehomesllc.com/DrakeHomes_Logo.jpg"
  ],
  "telephone": "+1-920-740-6660",
  "email": "info@drakehomesllc.com",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "WI",
    "addressLocality": "Appleton",
    "addressCountry": "US",
    "areaServed": "Fox Valley, Wisconsin"
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
      "@id": "https://en.wikipedia.org/wiki/Appleton,_Wisconsin"
    },
    {
      "@type": "City", 
      "name": "Green Bay",
      "@id": "https://en.wikipedia.org/wiki/Green_Bay,_Wisconsin"
    },
    {
      "@type": "City",
      "name": "Oshkosh",
      "@id": "https://en.wikipedia.org/wiki/Oshkosh,_Wisconsin"
    },
    {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 44.2619,
        "longitude": -88.4154
      },
      "geoRadius": "50000"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Home Construction Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Home Construction",
          "description": "Complete custom home building services from design to completion with quality craftsmanship"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "New Home Construction",
          "description": "Quality new home construction with modern features, energy efficiency, and attention to detail"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Semi-Custom Homes",
          "description": "Choose from our selection of plans and customize to your preferences"
        }
      }
    ]
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "$$-$$$",
  "paymentAccepted": ["Cash", "Check", "Financing Available"],
  "currenciesAccepted": "USD",
  "foundingDate": "2020",
  "founder": {
    "@type": "Person",
    "name": "Drake Homes Team"
  },
  "slogan": "Where Quality and Value Meet",
  "keywords": "home construction, custom homes, quality builder, Wisconsin homes, Fox Valley construction, new home builder",
  "sameAs": [
    "https://www.facebook.com/drakehomesllc",
    "https://www.instagram.com/drakehomesllc"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-920-740-6660",
    "email": "info@drakehomesllc.com",
    "contactType": "Sales",
    "areaServed": "US",
    "availableLanguage": ["English"]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "12",
    "bestRating": "5",
    "worstRating": "1"
  }
}
