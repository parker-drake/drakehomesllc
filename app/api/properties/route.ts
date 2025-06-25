import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface PropertyImage {
  id: string
  image_url: string
  is_main: boolean
  display_order: number
}

// GET /api/properties - Get all properties
export async function GET() {
  try {
    const { data: properties, error } = await supabaseAdmin
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
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      )
    }

    // Map main_image to image for frontend compatibility
    const mappedProperties = properties.map(property => {
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

      return {
        ...property,
        image: imageUrl
      }
    })

    return NextResponse.json(mappedProperties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
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
      longitude,
      // Property Information fields
      lot_size,
      year_built,
      property_type,
      garage_spaces,
      heating_cooling,
      flooring_type,
      school_district,
      hoa_fee,
      utilities_included,
      exterior_materials
    } = body

    // Validate required fields (latitude, longitude, and main_image are optional)
    if (!title || !price || !location || beds === undefined || beds === null || baths === undefined || baths === null || !sqft || !status || !description || !completion_date) {
      return NextResponse.json(
        { error: 'Missing required fields. Required: title, price, location, beds, baths, sqft, status, description, completion_date' },
        { status: 400 }
      )
    }

    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .insert({
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
        longitude: longitude !== undefined && longitude !== null && longitude !== '' ? parseFloat(longitude.toString()) : null,
        // Property Information fields
        lot_size: lot_size || null,
        year_built: year_built ? parseInt(year_built) : null,
        property_type: property_type || null,
        garage_spaces: garage_spaces ? parseInt(garage_spaces) : null,
        heating_cooling: heating_cooling || null,
        flooring_type: flooring_type || null,
        school_district: school_district || null,
        hoa_fee: hoa_fee || null,
        utilities_included: utilities_included || null,
        exterior_materials: exterior_materials || null
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create property', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to create property', details: errorMessage },
      { status: 500 }
    )
  }
} 