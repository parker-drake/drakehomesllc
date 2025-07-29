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
    
    // Check if this is a multi-upload request
    const isMultiUpload = formData.get('multiUpload') === 'true'
    
    if (isMultiUpload) {
      // Handle multiple file uploads
      const files: File[] = []
      const uploadData: any[] = []
      
      // Collect all files from formData
      const formDataEntries = Array.from(formData.entries())
      for (const [key, value] of formDataEntries) {
        if (key.startsWith('images[') && value instanceof File) {
          files.push(value)
        }
      }
      
      if (files.length === 0) {
        return NextResponse.json({ error: 'No files provided' }, { status: 400 })
      }
      
      // Common metadata for all images
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const location = formData.get('location') as string
      const year = formData.get('year') as string
      const category = formData.get('category') as string
      const isFeatured = formData.get('is_featured') === 'true'
      
      if (!category) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 })
      }
      
      const successfulUploads = []
      const failedUploads = []
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        try {
          // Generate unique filename with delay to ensure different timestamps
          await new Promise(resolve => setTimeout(resolve, 10))
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${i}.${fileExt}`
          const filePath = `gallery/${fileName}`
          
          // Upload file to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('property-images')
            .upload(filePath, file)
          
          if (uploadError) {
            failedUploads.push({ fileName: file.name, error: uploadError.message })
            continue
          }
          
          // Get public URL
          const { data: urlData } = supabaseAdmin.storage
            .from('property-images')
            .getPublicUrl(filePath)
          
          // Generate title for individual image if not provided
          const imageTitle = title || `${file.name.split('.')[0]} ${i + 1}`
          
          // Save image metadata to database
          const { data: imageData, error: dbError } = await supabaseAdmin
            .from('gallery_images')
            .insert({
              title: imageTitle,
              description,
              location,
              year,
              category,
              image_url: urlData.publicUrl,
              image_path: filePath,
              is_featured: isFeatured && i === 0 // Only first image can be featured in batch
            })
            .select()
            .single()
          
          if (dbError) {
            // Clean up uploaded file if database insert fails
            await supabaseAdmin.storage.from('property-images').remove([filePath])
            failedUploads.push({ fileName: file.name, error: dbError.message })
          } else {
            successfulUploads.push(imageData)
          }
        } catch (error) {
          failedUploads.push({ fileName: file.name, error: 'Unknown error' })
        }
      }
      
      return NextResponse.json({
        successful: successfulUploads,
        failed: failedUploads,
        total: files.length
      }, { status: 201 })
    }
    
    // Single file upload (existing code)
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