import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase-admin"
import PropertyClientWrapper from "./property-client-wrapper"

interface PropertyPageProps {
  params: {
    id: string
  }
}

// Generate static paths for all properties
export async function generateStaticParams() {
  const { data: properties } = await supabaseAdmin
    .from('properties')
    .select('id')
    .order('created_at', { ascending: false })

  return properties?.map((property) => ({
    id: property.id,
  })) || []
}

// Revalidate property pages every 10 seconds for faster updates
export const revalidate = 10

export default async function PropertyPage({ params }: PropertyPageProps) {
  // Fetch property data
  const { data: property, error } = await supabaseAdmin
    .from('properties')
    .select(`
      *,
      property_images (
        id,
        image_url,
        is_main,
        display_order
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !property) {
    notFound()
  }

  // Fetch related properties
  const { data: allProperties } = await supabaseAdmin
    .from('properties')
    .select(`
      *,
      property_images (
        id,
        image_url,
        is_main,
        display_order
      )
    `)
    .neq('id', params.id)
    .limit(3)
    .order('created_at', { ascending: false })

  // Map related properties to include image field
  const relatedProperties = (allProperties || []).map(prop => {
    let imageUrl = prop.main_image
    
    // If no main_image, look for main image in property_images table
    if (!imageUrl && prop.property_images && prop.property_images.length > 0) {
      // First try to find image marked as main
      const mainImage = prop.property_images.find((img: any) => img.is_main)
      if (mainImage) {
        imageUrl = mainImage.image_url
      } else {
        // If no main image marked, use first image
        imageUrl = prop.property_images[0].image_url
      }
    }
    
    return {
      ...prop,
      image: imageUrl
    }
  })

  // Clean up property data
  const cleanedProperty = {
    ...property,
    features: Array.isArray(property.features) ? property.features : [],
    latitude: property.latitude || null,
    longitude: property.longitude || null
  }

  return (
    <PropertyClientWrapper 
      property={cleanedProperty} 
      relatedProperties={relatedProperties}
    />
  )
} 