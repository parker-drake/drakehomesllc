import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { renderToBuffer } from '@react-pdf/renderer'
import { PropertyBrochurePDF } from '@/components/property-brochure-pdf'
import React from 'react'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch property data with images
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          image_url,
          is_main,
          display_order
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfElement = React.createElement(PropertyBrochurePDF, { property })
    const pdfBuffer = await renderToBuffer(pdfElement as any)

    // Create filename
    const filename = `${property.location.replace(/[^a-zA-Z0-9]/g, '-')}-brochure.pdf`

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating property brochure:', error)
    return NextResponse.json(
      { error: 'Failed to generate brochure' },
      { status: 500 }
    )
  }
} 