import React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "Drake Homes LLC - Quality Home Construction in Wisconsin",
    template: "%s | Drake Homes LLC"
  },
  description: "Drake Homes LLC builds quality custom homes in Wisconsin's Fox Valley area. Over 20 years of construction experience with no shortcuts, only quality. Contact us for your dream home.",
  keywords: ["home construction", "custom homes", "Wisconsin builder", "Fox Valley construction", "quality homes", "Drake Homes", "residential construction"],
  authors: [{ name: "Drake Homes LLC" }],
  creator: "Drake Homes LLC",
  publisher: "Drake Homes LLC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://drakehomesllc.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Drake Homes LLC - Quality Home Construction in Wisconsin",
    description: "Quality construction services with over 20 years of experience. Building custom homes in Wisconsin's Fox Valley area with excellence and reliability.",
    url: 'https://drakehomesllc.com',
    siteName: 'Drake Homes LLC',
    images: [
      {
        url: '/DrakeHomes_Logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Drake Homes LLC - Quality Home Construction',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Drake Homes LLC - Quality Home Construction",
    description: "Quality construction services with over 20 years of experience in Wisconsin's Fox Valley area.",
    images: ['/DrakeHomes_Logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Drake Homes LLC",
    url: "https://drakehomesllc.com",
    logo: "https://drakehomesllc.com/DrakeHomes_Logo.jpg",
    description: "Quality home construction in Wisconsin's Fox Valley area with over 20 years of experience.",
    address: {
      "@type": "PostalAddress",
      addressRegion: "WI",
      addressCountry: "US",
      addressLocality: "Appleton"
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-920-740-6660",
      contactType: "sales",
      areaServed: "US",
      availableLanguage: "English"
    },
    sameAs: [
      "https://www.facebook.com/drakehomesllc",
      "https://www.instagram.com/drakehomesllc"
    ]
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  )
}

 