import React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { enhancedLocalBusinessSchema } from "./enhanced-local-business-schema"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "Drake Homes LLC - Quality Home Construction in Wisconsin",
    template: "%s | Drake Homes LLC"
  },
  description: "Drake Homes LLC - Wisconsin's trusted custom home builder with 20+ years experience. Quality construction, no shortcuts. Move-in ready homes from $250K. Call (920) 740-6660 for free consultation!",
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
    description: "Wisconsin's trusted custom home builder with 20+ years experience. Move-in ready & custom homes in Fox Valley. Call (920) 740-6660 for free consultation!",
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
    description: "Wisconsin's trusted builder with 20+ years experience. Call (920) 740-6660 for your free consultation!",
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
  // Use enhanced local business schema for better local SEO
  const organizationSchema = enhancedLocalBusinessSchema

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://dkzfcltmpaskscaynfsm.supabase.co" />
        <link rel="preconnect" href="https://fxaowczkvopxnmbkthtv.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/DrakeHomes_Logo.jpg" as="image" type="image/jpeg" />
      </head>
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

 