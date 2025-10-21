import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Simple in-memory rate limiting (in production, use Redis or similar)
const uploadAttempts = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const attempts = uploadAttempts.get(ip)
  
  if (!attempts || now > attempts.resetTime) {
    // Reset or initialize
    uploadAttempts.set(ip, { count: 1, resetTime: now + 60000 }) // 1 minute window
    return false
  }
  
  if (attempts.count >= 100) { // Max 100 uploads per minute (increased for bulk uploads)
    return true
  }
  
  attempts.count++
  return false
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many upload attempts. Please try again in a moment.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as string // 'image' or 'document'
    const uploadContext = formData.get('context') as string || 'plan' // 'plan' or 'property'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Strict file type validation
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
    const allowedDocumentTypes = ['application/pdf']
    
    // Validate file extension as well (prevent MIME type spoofing)
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'webp']
    const allowedDocumentExtensions = ['pdf']
    
    if (fileType === 'image') {
      if (!allowedImageTypes.includes(file.type) || !allowedImageExtensions.includes(fileExtension || '')) {
        return NextResponse.json({ error: 'Invalid image file. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 })
      }
    } else if (fileType === 'document') {
      if (!allowedDocumentTypes.includes(file.type) || !allowedDocumentExtensions.includes(fileExtension || '')) {
        return NextResponse.json({ error: 'Invalid document file. Only PDF files are allowed.' }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: 'Invalid file type specified.' }, { status: 400 })
    }

    // Validate file size (5MB max for both documents and images)
    const maxSize = 5 * 1024 * 1024 // 5MB for both types
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File size too large. Maximum size is 5MB.` }, { status: 400 })
    }

    // Validate filename (prevent directory traversal)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename.' }, { status: 400 })
    }

    // Generate secure filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const sanitizedExtension = fileExtension?.replace(/[^a-zA-Z0-9]/g, '')
    const fileName = `${timestamp}_${randomString}.${sanitizedExtension}`
    
    // Determine storage bucket path based on context
    let bucketPath: string
    if (fileType === 'image') {
      bucketPath = uploadContext === 'property' ? `property-images/${fileName}` : `plan-images/${fileName}`
    } else {
      bucketPath = uploadContext === 'property' ? `property-documents/${fileName}` : `plan-documents/${fileName}`
    }
    
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