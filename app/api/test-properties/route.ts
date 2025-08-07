import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET /api/test-properties - Debug endpoint
export async function GET() {
  try {
    const { data: properties, error } = await supabaseAdmin
      .from('properties')
      .select(`
        id,
        title,
        location,
        main_image,
        property_images (
          id,
          image_url,
          is_main,
          display_order
        )
      `)
      .limit(2)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Show raw data and mapped data
    const rawData = properties || []
    const mappedData = rawData.map(property => {
      let imageUrl = property.main_image

      if (!imageUrl && property.property_images && property.property_images.length > 0) {
        const mainImage = property.property_images.find((img: any) => img.is_main)
        imageUrl = mainImage ? mainImage.image_url : property.property_images[0].image_url
      }

      return {
        ...property,
        image: imageUrl,
        debug: {
          has_main_image: !!property.main_image,
          has_property_images: !!(property.property_images && property.property_images.length > 0),
          mapped_image: imageUrl
        }
      }
    })

    return NextResponse.json({
      raw: rawData,
      mapped: mappedData,
      note: "Check if 'image' field is populated correctly"
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
