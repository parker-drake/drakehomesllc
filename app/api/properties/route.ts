import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET /api/properties - Get all properties
export async function GET() {
  try {
    const { data: properties, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      )
    }

    // Features are already stored as JSON arrays in Supabase
    return NextResponse.json(properties)
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
      longitude
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
        longitude: longitude !== undefined && longitude !== null && longitude !== '' ? parseFloat(longitude.toString()) : null
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
    return NextResponse.json(
      { error: 'Failed to create property', details: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
} 