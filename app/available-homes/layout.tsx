import { Metadata } from 'next'
import { generateCanonicalUrl, generateMetaTags } from '@/lib/seo-utils'

export function generateMetadata(): Metadata {
  return generateMetaTags({
    title: 'Available Homes',
    description: 'View 15+ available homes in Fox Valley, WI. Move-in ready & under construction properties from $250K-$500K. Virtual tours & financing available. Drake Homes LLC (920) 740-6660',
    canonical: generateCanonicalUrl('/available-homes'),
    ogImage: '/DrakeHomes_Logo.jpg',
  })
}

export default function AvailableHomesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 