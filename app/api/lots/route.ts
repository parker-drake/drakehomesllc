import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const supabase = supabaseAdmin
    
    const { data: lots, error } = await supabase
      .from('lots')
      .select(`
        *,
        lot_images (*),
        lot_features (*)
      `)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching lots:', error)
      return NextResponse.json({ error: 'Failed to fetch lots' }, { status: 500 })
    }
    
    return NextResponse.json(lots)
  } catch (error) {
    console.error('Error in lots API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    
    const {
      lot_number,
      address,
      city,
      state,
      zip_code,
      subdivision,
      lot_size,
      price,
      status,
      latitude,
      longitude,
      description,
      main_image,
      utilities_status,
      hoa_fees,
      school_district,
      is_featured,
      features,
      images
    } = body
    
    // Insert the lot
    const { data: lot, error: lotError } = await supabase
      .from('lots')
      .insert({
        lot_number,
        address,
        city: city || 'Appleton',
        state: state || 'Wisconsin',
        zip_code: zip_code || '54913',
        subdivision,
        lot_size: lot_size ? parseFloat(lot_size) : null,
        price: price ? parseFloat(price) : null,
        status: status || 'available',
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        description,
        main_image,
        utilities_status,
        hoa_fees: hoa_fees ? parseFloat(hoa_fees) : null,
        school_district,
        is_featured: Boolean(is_featured),
        is_active: true
      })
      .select()
      .single()
    
    if (lotError) {
      console.error('Error creating lot:', lotError)
      return NextResponse.json({ error: 'Failed to create lot' }, { status: 500 })
    }
    
    // Insert features if provided
    if (features && features.length > 0) {
      const featureInserts = features.map((feature: string) => ({
        lot_id: lot.id,
        feature_name: feature
      }))
      
      const { error: featuresError } = await supabase
        .from('lot_features')
        .insert(featureInserts)
      
      if (featuresError) {
        console.error('Error adding features:', featuresError)
      }
    }
    
    // Insert additional images if provided
    if (images && images.length > 0) {
      const imageInserts = images.map((image: any, index: number) => ({
        lot_id: lot.id,
        image_url: image.url,
        image_type: image.type || 'photo',
        title: image.title || '',
        description: image.description || '',
        sort_order: index
      }))
      
      const { error: imagesError } = await supabase
        .from('lot_images')
        .insert(imageInserts)
      
      if (imagesError) {
        console.error('Error adding images:', imagesError)
      }
    }
    
    return NextResponse.json({ message: 'Lot created successfully', lot })
  } catch (error) {
    console.error('Error in lots POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 