import { Metadata } from "next"
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateCanonicalUrl, generateMetaTags } from '@/lib/seo-utils'

interface PlanLayoutProps {
  children: React.ReactNode
  params: { id: string }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data: plan, error } = await supabaseAdmin
      .from('plans')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !plan) {
      return {
        title: 'Plan Not Found | Drake Homes LLC',
        description: 'This house plan is no longer available.',
        robots: 'noindex, nofollow',
      }
    }

    const title = `${plan.title} - ${plan.bedrooms} Bed ${plan.bathrooms} Bath House Plan`
    const description = `${plan.title}: ${plan.square_footage} sq ft, ${plan.bedrooms} bedrooms, ${plan.bathrooms} bathrooms. ${plan.description?.slice(0, 120)}... Starting at $${plan.price?.toLocaleString()}.`

    return generateMetaTags({
      title,
      description,
      canonical: generateCanonicalUrl(`/plans/${params.id}`),
      ogImage: plan.main_image || '/DrakeHomes_Logo.jpg',
    })
  } catch (error) {
    console.error('Error generating plan metadata:', error)
    return {
      title: "House Plan Details | Drake Homes LLC",
      description: "View detailed information about this custom house plan from Drake Homes LLC.",
    }
  }
}

export default function PlanLayout({ children }: PlanLayoutProps) {
  return <>{children}</>
} 