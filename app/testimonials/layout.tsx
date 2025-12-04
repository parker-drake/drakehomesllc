import { Metadata } from "next"
import { generateCanonicalUrl, generateMetaTags } from "@/lib/seo-utils"

export function generateMetadata(): Metadata {
  return generateMetaTags({
    title: "Customer Testimonials | Drake Homes LLC",
    description: "Read what our satisfied customers say about Drake Homes LLC. Real reviews from homeowners who built their dream homes in Wisconsin's Fox Valley area. Quality construction, excellent service.",
    canonical: generateCanonicalUrl("/testimonials"),
    ogImage: "/DrakeHomes_Logo.jpg",
  })
}

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

