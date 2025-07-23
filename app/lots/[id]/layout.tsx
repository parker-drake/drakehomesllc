import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateCanonicalUrl, generateMetaTags } from '@/lib/seo-utils'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data: lot, error } = await supabaseAdmin
      .from('lots')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !lot) {
      return {
        title: 'Lot Not Found | Drake Homes LLC',
        description: 'This lot listing is no longer available.',
        robots: 'noindex, nofollow',
      }
    }

    const title = `${lot.lot_number} - ${lot.subdivision} | Available Lot`
    const description = `${lot.lot_number} in ${lot.subdivision}, ${lot.city}, WI. ${lot.lot_size} acres for $${lot.price?.toLocaleString()}. ${lot.description?.slice(0, 120)}...`

    return generateMetaTags({
      title,
      description,
      canonical: generateCanonicalUrl(`/lots/${params.id}`),
      ogImage: lot.main_image || '/DrakeHomes_Logo.jpg',
    })
  } catch (error) {
    console.error('Error generating lot metadata:', error)
    return {
      title: 'Lot Details | Drake Homes LLC',
      description: 'View available building lots in Wisconsin\'s Fox Valley area.',
    }
  }
}

export default function LotDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 