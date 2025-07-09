import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Available Lots - Prime Building Sites in Wisconsin",
  description: "Browse available lots for building your custom home in Wisconsin's Fox Valley area. Prime locations with utilities, excellent schools, and neighborhood amenities.",
  keywords: ["available lots Wisconsin", "building lots Fox Valley", "land for sale Wisconsin", "Drake Homes lots", "residential lots", "home sites", "building sites"],
  openGraph: {
    title: "Available Lots - Prime Building Sites in Wisconsin",
    description: "Find the perfect lot for your dream home in Wisconsin's Fox Valley area with Drake Homes LLC.",
    url: "https://drakehomesllc.com/lots",
    type: "website",
  },
  twitter: {
    title: "Available Lots - Prime Building Sites",
    description: "Browse available lots for building your custom home in Wisconsin's Fox Valley area.",
  },
  alternates: {
    canonical: "/lots",
  },
}

export default function LotsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 