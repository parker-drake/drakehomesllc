export const getBreadcrumbSchema = (path: string) => {
  const baseUrl = 'https://drakehomesllc.com'
  
  const breadcrumbMap: Record<string, any> = {
    '/': {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        }
      ]
    },
    '/about': {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About Us",
          "item": `${baseUrl}/about`
        }
      ]
    },
    '/contact': {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact Us",
          "item": `${baseUrl}/contact`
        }
      ]
    },
    '/available-homes': {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Available Homes",
          "item": `${baseUrl}/available-homes`
        }
      ]
    },
    '/gallery': {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Gallery",
          "item": `${baseUrl}/gallery`
        }
      ]
    }
  }
  
  return breadcrumbMap[path] || breadcrumbMap['/']
} 