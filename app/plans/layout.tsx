import { Metadata } from "next"

export const metadata: Metadata = {
  title: "House Plans - Custom Home Designs in Wisconsin",
  description: "Browse our collection of thoughtfully designed house plans. From ranch-style to two-story homes, find the perfect custom home design for your needs in Wisconsin's Fox Valley area.",
  keywords: ["house plans", "home designs", "custom home plans", "Wisconsin home plans", "Drake Homes plans", "residential plans", "home blueprints"],
  openGraph: {
    title: "House Plans - Custom Home Designs in Wisconsin",
    description: "Browse our collection of thoughtfully designed house plans and find the perfect design for your dream home.",
    url: "https://drakehomesllc.com/plans",
    type: "website",
  },
  twitter: {
    title: "House Plans - Custom Home Designs",
    description: "Browse our collection of thoughtfully designed house plans for your dream home.",
  },
  alternates: {
    canonical: "/plans",
  },
}

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 