import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as string // 'image' or 'document'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const allowedDocumentTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/dwg', 'application/x-dwg']
    
    if (fileType === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid image file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 })
    }
    
    if (fileType === 'document' && !allowedDocumentTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid document file type. Only PDF, JPEG, PNG, and DWG are allowed.' }, { status: 400 })
    }

    // Validate file size (10MB max for documents, 5MB max for images)
    const maxSize = fileType === 'document' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = fileType === 'document' ? '10MB' : '5MB'
      return NextResponse.json({ error: `File size too large. Maximum size is ${maxSizeMB}.` }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${randomString}.${fileExtension}`
    
    // Determine storage bucket path
    const bucketPath = fileType === 'image' ? `plan-images/${fileName}` : `plan-documents/${fileName}`
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('plan-files')
      .upload(bucketPath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('plan-files')
      .getPublicUrl(bucketPath)

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: urlData.publicUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 