import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Free Construction Consultation & Quote",
  description: "Contact Drake Homes LLC for your construction needs in Wisconsin's Fox Valley. Call (920) 740-6660 for a free consultation. Quality home builders serving Wisconsin.",
  keywords: ["contact Drake Homes", "Wisconsin home builder contact", "Fox Valley construction quote", "free construction consultation", "home builder Wisconsin phone", "custom home quote"],
  openGraph: {
    title: "Contact Drake Homes LLC - Free Construction Consultation",
    description: "Get a free consultation for your construction project. Quality home builders serving Wisconsin's Fox Valley area.",
    url: "https://drakehomesllc.com/contact",
    type: "website",
  },
  twitter: {
    title: "Contact Drake Homes LLC - Free Consultation",
    description: "Get a free consultation for your construction project in Wisconsin's Fox Valley area.",
  },
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 