import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Fetch single gallery with images
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { data: gallery, error } = await supabaseAdmin
      .from('galleries')
      .select(`
        *,
        gallery_images (
          id,
          title,
          description,
          location,
          year,
          image_url,
          image_path,
          sort_order,
          is_featured,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .single()

    if (error || !gallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }

    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error in gallery GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update gallery
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    const { name, description, is_active } = data

    const updates: any = {}
    
    if (name !== undefined) {
      updates.name = name
      // Update slug if name changes
      updates.slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    if (description !== undefined) updates.description = description
    if (is_active !== undefined) updates.is_active = is_active

    const { data: gallery, error } = await supabaseAdmin
      .from('galleries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating gallery:', error)
      return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 })
    }

    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error in gallery PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete gallery
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if gallery has images
    const { data: images, error: checkError } = await supabaseAdmin
      .from('gallery_images')
      .select('id')
      .eq('gallery_id', id)
      .limit(1)

    if (checkError) {
      console.error('Error checking gallery images:', checkError)
      return NextResponse.json({ error: 'Failed to check gallery' }, { status: 500 })
    }

    if (images && images.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete gallery with images. Please delete all images first.' 
      }, { status: 400 })
    }

    // Delete gallery
    const { error } = await supabaseAdmin
      .from('galleries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting gallery:', error)
      return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Gallery deleted successfully' })
  } catch (error) {
    console.error('Error in gallery DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 