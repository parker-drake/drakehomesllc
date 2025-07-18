import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { renderToBuffer } from '@react-pdf/renderer'
import { PropertyFlyerPDF } from '@/components/property-flyer-pdf'
import React from 'react'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ids = searchParams.get('ids')
    
    if (!ids) {
      return NextResponse.json(
        { error: 'Property IDs are required' },
        { status: 400 }
      )
    }

    const propertyIds = ids.split(',').filter(id => id.trim())
    
    if (propertyIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid property IDs provided' },
        { status: 400 }
      )
    }

    if (propertyIds.length > 6) {
      return NextResponse.json(
        { error: 'Maximum 6 properties allowed per flyer' },
        { status: 400 }
      )
    }

    // Fetch properties data
    const { data: properties, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .in('id', propertyIds)
      .order('created_at', { ascending: false })

    if (error || !properties || properties.length === 0) {
      return NextResponse.json(
        { error: 'Properties not found' },
        { status: 404 }
      )
    }

    // Log properties for debugging
    console.log('Generating PDF for properties:', properties.map(p => ({
      id: p.id,
      title: p.title,
      main_image: p.main_image ? 'Has image' : 'No image'
    })))

    // Generate PDF
    let pdfBuffer
    try {
      const pdfElement = React.createElement(PropertyFlyerPDF, { properties })
      pdfBuffer = await renderToBuffer(pdfElement as any)
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError)
      throw new Error(`PDF generation failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`)
    }

    // Create filename
    const filename = `property-flyer-${new Date().toISOString().split('T')[0]}.pdf`

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error('Error generating property flyer:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to generate flyer', details: errorMessage },
      { status: 500 }
    )
  }
} 