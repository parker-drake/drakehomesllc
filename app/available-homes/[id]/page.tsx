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

// Revalidate property pages every 60 seconds
export const revalidate = 60

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
    .select('*')
    .neq('id', params.id)
    .limit(3)
    .order('created_at', { ascending: false })

  const relatedProperties = allProperties || []

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