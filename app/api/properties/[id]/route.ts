import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface PropertyImage {
  id: string
  image_url: string
  is_main: boolean
  display_order: number
}

// GET /api/properties/[id] - Get a single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Map main_image to image for frontend compatibility
    let imageUrl = property.main_image

    // If no main_image, look for main image in property_images table
    if (!imageUrl && property.property_images && property.property_images.length > 0) {
      // First try to find image marked as main
             const mainImage = property.property_images.find((img: PropertyImage) => img.is_main)
      if (mainImage) {
        imageUrl = mainImage.image_url
      } else {
        // If no main image marked, use first image
        imageUrl = property.property_images[0].image_url
      }
    }

    const mappedProperty = {
      ...property,
      image: imageUrl
    }

    return NextResponse.json(mappedProperty)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// PUT /api/properties/[id] - Update a property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      price,
      location,
      beds,
      baths,
      sqft,
      main_image,
      status,
      description,
      features,
      completion_date,
      latitude,
      longitude
    } = body

    // Validate required fields
    if (!title || !price || !location || beds === undefined || beds === null || baths === undefined || baths === null || !sqft || !status || !description || !completion_date) {
      return NextResponse.json(
        { error: 'Missing required fields. Required: title, price, location, beds, baths, sqft, status, description, completion_date' },
        { status: 400 }
      )
    }

    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .update({
        title,
        price,
        location,
        beds: parseInt(beds),
        baths: parseInt(baths),
        sqft,
        main_image: main_image || null,
        status,
        description,
        features: features || [],
        completion_date,
        latitude: latitude !== undefined && latitude !== null && latitude !== '' ? parseFloat(latitude.toString()) : null,
        longitude: longitude !== undefined && longitude !== null && longitude !== '' ? parseFloat(longitude.toString()) : null
      })
      .eq('id', params.id)
      .select(`
        *,
        property_images (
          id,
          image_url,
          is_main,
          display_order
        )
      `)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update property', details: error.message },
        { status: 500 }
      )
    }

    // Map main_image to image for frontend compatibility  
    let imageUrl = property.main_image

    // If no main_image, look for main image in property_images table
    if (!imageUrl && property.property_images && property.property_images.length > 0) {
      // First try to find image marked as main
      const mainImage = property.property_images.find((img: PropertyImage) => img.is_main)
      if (mainImage) {
        imageUrl = mainImage.image_url
      } else {
        // If no main image marked, use first image
        imageUrl = property.property_images[0].image_url
      }
    }

    const mappedProperty = {
      ...property,
      image: imageUrl
    }

    return NextResponse.json(mappedProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to update property', details: errorMessage },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/[id] - Delete a property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('properties')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to delete property' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
} 