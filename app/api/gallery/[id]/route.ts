import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// PUT - Update gallery image
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    
    // Validate gallery_id if provided
    if (data.gallery_id) {
      const { data: gallery, error } = await supabaseAdmin
        .from('galleries')
        .select('id')
        .eq('id', data.gallery_id)
        .single()
      
      if (error || !gallery) {
        return NextResponse.json({ error: 'Invalid gallery ID' }, { status: 400 })
      }
    }

    const { data: imageData, error } = await supabaseAdmin
      .from('gallery_images')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating gallery image:', error)
      return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
    }

    return NextResponse.json(imageData)
  } catch (error) {
    console.error('Error in gallery PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete gallery image
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get image path before deletion
    const { data: image, error: fetchError } = await supabaseAdmin
      .from('gallery_images')
      .select('image_path')
      .eq('id', id)
      .single()

    if (fetchError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting gallery image:', deleteError)
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }

    // Delete from storage
    if (image.image_path) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('property-images')
        .remove([image.image_path])

      if (storageError) {
        console.error('Error deleting image from storage:', storageError)
      }
    }

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error in gallery DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 