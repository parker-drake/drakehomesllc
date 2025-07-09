import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  try {
    const supabase = supabaseAdmin
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('plan_id')
    
    console.log('API called with planId:', planId)
    
    // Get categories with their options
    const { data: categories, error } = await supabase
      .from('customization_categories')
      .select(`
        *,
        customization_options (
          id,
          name,
          description,
          image_url,
          is_default,
          sort_order,
          is_active
        )
      `)
      .eq('is_active', true)
      .order('step_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching customization options:', error)
      return NextResponse.json({ error: 'Failed to fetch customization options' }, { status: 500 })
    }
    
    // Filter options based on plan if provided
    let filteredCategories = categories
    if (planId) {
      console.log('Filtering for plan:', planId)
      filteredCategories = categories.map(category => ({
        ...category,
        customization_options: category.customization_options.filter(
          (option: any) => {
            const isValid = option.is_active && (option.plan_id === planId || option.plan_id === null || option.plan_id === undefined)
            if (!isValid) {
              console.log('Filtered out option:', option.name, 'plan_id:', option.plan_id, 'is_active:', option.is_active)
            }
            return isValid
          }
        ).sort((a: any, b: any) => a.sort_order - b.sort_order)
      }))
      console.log('Filtered categories:', filteredCategories.map(cat => ({
        name: cat.name,
        optionCount: cat.customization_options.length
      })))
    } else {
      // If no plan ID, show ALL active options (for admin interface)
      console.log('No planId provided, showing all active options')
      filteredCategories = categories.map(category => ({
        ...category,
        customization_options: category.customization_options.filter(
          (option: any) => option.is_active
        ).sort((a: any, b: any) => a.sort_order - b.sort_order)
      }))
    }
    
    return NextResponse.json(filteredCategories)
  } catch (error) {
    console.error('Error in customization options API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    
    const {
      category_id,
      plan_id,
      name,
      description,
      image_url,
      is_default,
      sort_order
    } = body
    
    // Validate required fields
    if (!category_id || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Create the option
    const { data: option, error: optionError } = await supabase
      .from('customization_options')
      .insert({
        category_id,
        plan_id: plan_id || null,
        name,
        description,
        image_url,
        is_default: is_default || false,
        sort_order: sort_order || 0,
        is_active: true
      })
      .select()
      .single()
    
    if (optionError) {
      console.error('Error creating option:', optionError)
      return NextResponse.json({ error: 'Failed to create option' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Option created successfully', option })
  } catch (error) {
    console.error('Error in customization options POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 