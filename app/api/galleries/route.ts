import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Fetch all galleries with statistics
export async function GET() {
  try {
    const { data: galleries, error } = await supabaseAdmin
      .from('galleries')
      .select(`
        *,
        gallery_images (
          count
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching galleries:', error)
      return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 })
    }

    // Transform the data to include image count
    const galleriesWithStats = galleries.map(gallery => ({
      ...gallery,
      image_count: gallery.gallery_images?.[0]?.count || 0
    }))

    return NextResponse.json(galleriesWithStats)
  } catch (error) {
    console.error('Error in galleries GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new gallery
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, description } = data

    if (!name) {
      return NextResponse.json({ error: 'Gallery name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const { data: existing } = await supabaseAdmin
      .from('galleries')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'A gallery with this name already exists' }, { status: 400 })
    }

    // Get max sort_order
    const { data: maxOrder } = await supabaseAdmin
      .from('galleries')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const newSortOrder = (maxOrder?.sort_order || 0) + 1

    // Create gallery
    const { data: gallery, error } = await supabaseAdmin
      .from('galleries')
      .insert({
        name,
        slug,
        description,
        sort_order: newSortOrder
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating gallery:', error)
      return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 })
    }

    return NextResponse.json(gallery, { status: 201 })
  } catch (error) {
    console.error('Error in galleries POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update galleries order
export async function PUT(request: NextRequest) {
  try {
    const { galleries } = await request.json()

    if (!galleries || !Array.isArray(galleries)) {
      return NextResponse.json({ error: 'Invalid galleries data' }, { status: 400 })
    }

    // Update sort order for each gallery
    const updatePromises = galleries.map((gallery, index) => 
      supabaseAdmin
        .from('galleries')
        .update({ sort_order: index })
        .eq('id', gallery.id)
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ message: 'Gallery order updated successfully' })
  } catch (error) {
    console.error('Error in galleries PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 