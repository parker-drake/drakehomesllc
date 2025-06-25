import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// PUT - Update gallery image
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, location, year, category, is_featured, sort_order } = body

    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .update({
        title,
        description,
        location,
        year,
        category,
        is_featured,
        sort_order
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating gallery image:', error)
      return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in gallery PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete gallery image
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // First, get the image data to find the file path
    const { data: imageData, error: fetchError } = await supabaseAdmin
      .from('gallery_images')
      .select('image_path')
      .eq('id', id)
      .single()

    if (fetchError || !imageData) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 })
    }

    // Delete the image from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('property-images')
      .remove([imageData.image_path])

    if (storageError) {
      console.error('Error deleting image from storage:', storageError)
    }

    // Delete the record from database
    const { error: deleteError } = await supabaseAdmin
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting gallery image:', deleteError)
      return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Gallery image deleted successfully' })
  } catch (error) {
    console.error('Error in gallery DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 