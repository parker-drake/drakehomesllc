import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    
    const {
      name,
      description,
      image_url,
      is_default,
      is_active,
      sort_order
    } = body
    
    // Build update object with only provided fields
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (image_url !== undefined) updateData.image_url = image_url
    if (is_default !== undefined) updateData.is_default = is_default
    if (is_active !== undefined) updateData.is_active = is_active
    if (sort_order !== undefined) updateData.sort_order = sort_order
    
    updateData.updated_at = new Date().toISOString()
    
    // Update the option
    const { data: option, error } = await supabase
      .from('customization_options')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating option:', error)
      return NextResponse.json({ error: 'Failed to update option' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Option updated successfully', option })
  } catch (error) {
    console.error('Error in option PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin
    
    // Delete the option
    const { error } = await supabase
      .from('customization_options')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting option:', error)
      return NextResponse.json({ error: 'Failed to delete option' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Option deleted successfully' })
  } catch (error) {
    console.error('Error in option DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 