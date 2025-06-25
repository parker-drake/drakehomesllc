import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Fetch all gallery images
export async function GET() {
  try {
    const { data: images, error } = await supabaseAdmin
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching gallery images:', error)
      return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
    }

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error in gallery GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new gallery image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const year = formData.get('year') as string
    const category = formData.get('category') as string
    const isFeatured = formData.get('is_featured') === 'true'

    if (!file || !title || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `gallery/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('property-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('property-images')
      .getPublicUrl(filePath)

    // Save image metadata to database
    const { data: imageData, error: dbError } = await supabaseAdmin
      .from('gallery_images')
      .insert({
        title,
        description,
        location,
        year,
        category,
        image_url: urlData.publicUrl,
        image_path: filePath,
        is_featured: isFeatured
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file if database insert fails
      await supabaseAdmin.storage.from('property-images').remove([filePath])
      return NextResponse.json({ error: 'Failed to save image data' }, { status: 500 })
    }

    return NextResponse.json(imageData, { status: 201 })
  } catch (error) {
    console.error('Error in gallery POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 