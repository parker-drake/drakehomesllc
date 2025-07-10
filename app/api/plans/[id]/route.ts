import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin
    
    const { data: plan, error } = await supabase
      .from('plans')
      .select(`
        *,
        plan_images (*),
        plan_features (*),
        plan_documents (*)
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single()
    
    if (error || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Sort documents by sort_order
    if (plan.plan_documents) {
      plan.plan_documents.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    }
    
    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error fetching plan:', error)
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
    
    // Update the plan
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .update({
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
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (planError) {
      console.error('Error updating plan:', planError)
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
    }
    
    // Delete existing features, images, and documents
    await supabase.from('plan_features').delete().eq('plan_id', params.id)
    await supabase.from('plan_images').delete().eq('plan_id', params.id)
    await supabase.from('plan_documents').delete().eq('plan_id', params.id)
    
    // Insert new features if provided
    if (features && features.length > 0) {
      const featureInserts = features.map((feature: string) => ({
        plan_id: params.id,
        feature_name: feature
      }))
      
      const { error: featuresError } = await supabase
        .from('plan_features')
        .insert(featureInserts)
      
      if (featuresError) {
        console.error('Error updating features:', featuresError)
      }
    }
    
    // Insert new images if provided
    if (images && images.length > 0) {
      const imageInserts = images.map((image: any, index: number) => ({
        plan_id: params.id,
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
        console.error('Error updating images:', imagesError)
      }
    }

    // Insert new documents if provided
    if (documents && documents.length > 0) {
      const documentInserts = documents.map((document: any, index: number) => ({
        plan_id: params.id,
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
        console.error('Error updating documents:', documentsError)
      }
    }
    
    return NextResponse.json({ message: 'Plan updated successfully', plan })
  } catch (error) {
    console.error('Error updating plan:', error)
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
      .from('plans')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting plan:', error)
      return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Plan deleted successfully' })
  } catch (error) {
    console.error('Error in plan DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 