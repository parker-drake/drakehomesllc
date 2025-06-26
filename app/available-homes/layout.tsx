import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Available Homes - Quality New Construction in Wisconsin",
  description: "Browse available new construction homes by Drake Homes LLC in Wisconsin's Fox Valley area. Quality custom homes with no shortcuts, modern features, and excellent craftsmanship.",
  keywords: ["available homes Wisconsin", "new construction Fox Valley", "quality homes for sale", "custom homes Wisconsin", "Drake Homes properties", "Fox Valley new homes"],
  openGraph: {
    title: "Available Homes - Quality New Construction in Wisconsin",
    description: "Browse available new construction homes in Wisconsin's Fox Valley area. Quality custom homes with excellent craftsmanship.",
    url: "https://drakehomesllc.com/available-homes",
    type: "website",
  },
  twitter: {
    title: "Available Homes - Quality New Construction",
    description: "Browse available new construction homes in Wisconsin's Fox Valley area.",
  },
  alternates: {
    canonical: "/available-homes",
  },
}

export default function AvailableHomesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 