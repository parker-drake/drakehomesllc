import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { renderToBuffer } from '@react-pdf/renderer'
import { PlanBrochurePDF } from '@/components/plan-brochure-pdf'
import React from 'react'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch plan data with images
    const { data: plan, error } = await supabaseAdmin
      .from('plans')
      .select(`
        *,
        floor_plan_images (
          id,
          image_url,
          floor_number,
          display_order
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfElement = React.createElement(PlanBrochurePDF, { plan })
    const pdfBuffer = await renderToBuffer(pdfElement as any)

    // Create filename
    const filename = `${plan.name.replace(/[^a-zA-Z0-9]/g, '-')}-floor-plan.pdf`

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
    console.error('Error generating plan brochure:', error)
    return NextResponse.json(
      { error: 'Failed to generate brochure' },
      { status: 500 }
    )
  }
} 