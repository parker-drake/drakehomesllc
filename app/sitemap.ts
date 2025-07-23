import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://drakehomesllc.com'
  
  // Base pages with specific change frequencies and priorities
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/available-homes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/lots`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/plans`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Fetch dynamic property pages
  let propertyPages: MetadataRoute.Sitemap = []
  try {
    const { data: properties, error } = await supabaseAdmin
      .from('properties')
      .select('id, updated_at, status, availability_status')
      .order('created_at', { ascending: false })

    if (!error && properties) {
      propertyPages = properties.map((property) => ({
        url: `${baseUrl}/available-homes/${property.id}`,
        lastModified: new Date(property.updated_at),
        changeFrequency: property.status === 'Move-In Ready' ? 'monthly' as const : 'weekly' as const,
        priority: property.availability_status === 'Available' ? 0.9 : 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error)
  }

  // Fetch dynamic plan pages
  let planPages: MetadataRoute.Sitemap = []
  try {
    const { data: plans, error } = await supabaseAdmin
      .from('plans')
      .select('id, updated_at, title')
      .order('created_at', { ascending: false })

    if (!error && plans) {
      planPages = plans.map((plan) => ({
        url: `${baseUrl}/plans/${plan.id}`,
        lastModified: new Date(plan.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
      
      // Add plan configuration pages
      plans.forEach((plan) => {
        planPages.push({
          url: `${baseUrl}/plans/${plan.id}/configure`,
          lastModified: new Date(plan.updated_at),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        })
      })
    }
  } catch (error) {
    console.error('Error fetching plans for sitemap:', error)
  }

  // Fetch dynamic lot pages
  let lotPages: MetadataRoute.Sitemap = []
  try {
    const { data: lots, error } = await supabaseAdmin
      .from('lots')
      .select('id, updated_at, status')
      .order('created_at', { ascending: false })

    if (!error && lots) {
      lotPages = lots.map((lot) => ({
        url: `${baseUrl}/lots/${lot.id}`,
        lastModified: new Date(lot.updated_at),
        changeFrequency: lot.status === 'Available' ? 'weekly' as const : 'monthly' as const,
        priority: lot.status === 'Available' ? 0.7 : 0.5,
      }))
    }
  } catch (error) {
    console.error('Error fetching lots for sitemap:', error)
  }

  return [...staticPages, ...propertyPages, ...planPages, ...lotPages]
} 