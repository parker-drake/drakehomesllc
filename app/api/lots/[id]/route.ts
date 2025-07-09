import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin
    
    const { data: lot, error } = await supabase
      .from('lots')
      .select(`
        *,
        lot_images (*),
        lot_features (*)
      `)
      .eq('id', params.id)
      .single()
    
    if (error || !lot) {
      return NextResponse.json({ error: 'Lot not found' }, { status: 404 })
    }
    
    return NextResponse.json(lot)
  } catch (error) {
    console.error('Error fetching lot:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    // Update the lot
    const { data: lot, error: lotError } = await supabase
      .from('lots')
      .update({
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
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (lotError) {
      console.error('Error updating lot:', lotError)
      return NextResponse.json({ error: 'Failed to update lot' }, { status: 500 })
    }
    
    // Delete existing features and images to replace with new ones
    await supabase.from('lot_features').delete().eq('lot_id', params.id)
    await supabase.from('lot_images').delete().eq('lot_id', params.id)
    
    // Insert new features if provided
    if (features && features.length > 0) {
      const featureInserts = features.map((feature: string) => ({
        lot_id: params.id,
        feature_name: feature
      }))
      
      const { error: featuresError } = await supabase
        .from('lot_features')
        .insert(featureInserts)
      
      if (featuresError) {
        console.error('Error adding features:', featuresError)
      }
    }
    
    // Insert new images if provided
    if (images && images.length > 0) {
      const imageInserts = images.map((image: any, index: number) => ({
        lot_id: params.id,
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
    
    return NextResponse.json({ message: 'Lot updated successfully', lot })
  } catch (error) {
    console.error('Error in lot PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin
    
    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('lots')
      .update({ is_active: false })
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting lot:', error)
      return NextResponse.json({ error: 'Failed to delete lot' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Lot deleted successfully' })
  } catch (error) {
    console.error('Error in lot DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 