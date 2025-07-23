import { Metadata } from 'next'
import { generateCanonicalUrl, generateMetaTags } from '@/lib/seo-utils'

export function generateMetadata(): Metadata {
  return generateMetaTags({
    title: 'Project Gallery | Drake Homes LLC',
    description: 'Browse our portfolio of completed homes showcasing quality construction, custom features, and attention to detail in Wisconsin\'s Fox Valley area.',
    canonical: generateCanonicalUrl('/gallery'),
    ogImage: '/DrakeHomes_Logo.jpg',
  })
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 