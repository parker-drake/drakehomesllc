import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const supabase = supabaseAdmin
    
    const { data: plans, error } = await supabase
      .from('plans')
      .select(`
        *,
        plan_images (*),
        plan_features (*)
      `)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching plans:', error)
      return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
    }
    
    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error in plans API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    
    const {
      title,
      description,
      square_footage,
      bedrooms,
      bathrooms,
      floors,
      garage_spaces,
      style,
      price,
      main_image,
      is_featured,
      features,
      images,
      documents
    } = body
    
    // Insert the plan
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .insert({
        title,
        description,
        square_footage: parseInt(square_footage),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseFloat(bathrooms),
        floors: parseInt(floors) || 1,
        garage_spaces: parseInt(garage_spaces) || 0,
        style,
        price: price ? parseFloat(price) : null,
        main_image,
        is_featured: Boolean(is_featured),
        is_active: true
      })
      .select()
      .single()
    
    if (planError) {
      console.error('Error creating plan:', planError)
      return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
    }
    
    // Insert features if provided
    if (features && features.length > 0) {
      const featureInserts = features.map((feature: string) => ({
        plan_id: plan.id,
        feature_name: feature
      }))
      
      const { error: featuresError } = await supabase
        .from('plan_features')
        .insert(featureInserts)
      
      if (featuresError) {
        console.error('Error adding features:', featuresError)
      }
    }
    
    // Insert additional images if provided
    if (images && images.length > 0) {
      const imageInserts = images.map((image: any, index: number) => ({
        plan_id: plan.id,
        image_url: image.url,
        image_type: image.type || 'photo',
        title: image.title || '',
        description: image.description || '',
        sort_order: index
      }))
      
      const { error: imagesError } = await supabase
        .from('plan_images')
        .insert(imageInserts)
      
      if (imagesError) {
        console.error('Error adding images:', imagesError)
      }
    }

    // Insert documents if provided
    if (documents && documents.length > 0) {
      const documentInserts = documents.map((document: any, index: number) => ({
        plan_id: plan.id,
        document_url: document.url,
        document_type: document.type || 'floor_plan',
        file_type: document.file_type || 'pdf',
        title: document.title || '',
        description: document.description || '',
        sort_order: index
      }))
      
      const { error: documentsError } = await supabase
        .from('plan_documents')
        .insert(documentInserts)
      
      if (documentsError) {
        console.error('Error adding documents:', documentsError)
      }
    }
    
    return NextResponse.json({ message: 'Plan created successfully', plan })
  } catch (error) {
    console.error('Error in plans POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 