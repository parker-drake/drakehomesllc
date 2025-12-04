import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://drakehomesllc.com'
  
  // Ensure no trailing slashes in URLs
  const formatUrl = (url: string) => url.replace(/\/$/, '')
  
  // Base pages with specific change frequencies and priorities
  const staticPages = [
    {
      url: formatUrl(baseUrl),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: formatUrl(`${baseUrl}/about`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: formatUrl(`${baseUrl}/contact`),
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.9,
    },
    {
      url: formatUrl(`${baseUrl}/available-homes`),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: formatUrl(`${baseUrl}/lots`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: formatUrl(`${baseUrl}/plans`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: formatUrl(`${baseUrl}/gallery`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: formatUrl(`${baseUrl}/testimonials`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Fetch dynamic property pages
  let propertyPages: MetadataRoute.Sitemap = []
  try {
    const { data: properties, error } = await supabaseAdmin
      .from('properties')
      .select('id, updated_at, status, availability_status')
      .neq('availability_status', 'Sold')
      .order('created_at', { ascending: false })

    if (!error && properties) {
      propertyPages = properties.map((property) => ({
        url: formatUrl(`${baseUrl}/available-homes/${property.id}`),
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
        url: formatUrl(`${baseUrl}/plans/${plan.id}`),
        lastModified: new Date(plan.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
      // Note: /configure pages are excluded - they're interactive tools, not content
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
        url: formatUrl(`${baseUrl}/lots/${lot.id}`),
        lastModified: new Date(lot.updated_at),
        changeFrequency: lot.status === 'Available' ? 'weekly' as const : 'monthly' as const,
        priority: lot.status === 'Available' ? 0.7 : 0.5,
      }))
    }
  } catch (error) {
    console.error('Error fetching lots for sitemap:', error)
  }

  // Fetch gallery pages (only galleries with images)
  let galleryPages: MetadataRoute.Sitemap = []
  try {
    const { data: galleries, error } = await supabaseAdmin
      .from('galleries')
      .select('slug, updated_at, image_count')
      .gt('image_count', 0)
      .order('created_at', { ascending: false })

    if (!error && galleries) {
      galleryPages = galleries.map((gallery) => ({
        url: formatUrl(`${baseUrl}/gallery/${gallery.slug}`),
        lastModified: new Date(gallery.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Error fetching galleries for sitemap:', error)
  }

  return [...staticPages, ...propertyPages, ...planPages, ...lotPages, ...galleryPages]
} 