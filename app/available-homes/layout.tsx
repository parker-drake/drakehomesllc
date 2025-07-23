import { Metadata } from 'next'
import { generateCanonicalUrl, generateMetaTags } from '@/lib/seo-utils'

export function generateMetadata(): Metadata {
  return generateMetaTags({
    title: 'Available Homes | Drake Homes LLC',
    description: 'Browse our selection of quality homes available in Wisconsin\'s Fox Valley area. Find move-in ready homes and properties under construction.',
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