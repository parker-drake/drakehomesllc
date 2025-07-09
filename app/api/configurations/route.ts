import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const supabase = supabaseAdmin
    
    const { data: configurations, error } = await supabase
      .from('customer_configurations')
      .select(`
        *,
        plans (
          id,
          title,
          style,
          main_image
        ),
        configuration_selections (
          id,
          customization_options (
            id,
            name,
            description,
            customization_categories (
              id,
              name
            )
          )
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching configurations:', error)
      return NextResponse.json({ error: 'Failed to fetch configurations' }, { status: 500 })
    }
    
    return NextResponse.json(configurations)
  } catch (error) {
    console.error('Error in configurations API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    
    const {
      plan_id,
      customer_email,
      customer_name,
      customer_phone,
      customer_message,
      selected_options
    } = body
    
    // Validate required fields
    if (!plan_id || !customer_email || !customer_name || !selected_options) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Create the configuration
    const { data: configuration, error: configError } = await supabase
      .from('customer_configurations')
      .insert({
        plan_id,
        customer_email,
        customer_name,
        customer_phone,
        customer_message,
        status: 'submitted'
      })
      .select()
      .single()
    
    if (configError) {
      console.error('Error creating configuration:', configError)
      return NextResponse.json({ error: 'Failed to create configuration' }, { status: 500 })
    }
    
    // Create the selections
    if (selected_options && selected_options.length > 0) {
      const selections = selected_options.map((option_id: string) => ({
        configuration_id: configuration.id,
        option_id: option_id
      }))
      
      const { error: selectionsError } = await supabase
        .from('configuration_selections')
        .insert(selections)
      
      if (selectionsError) {
        console.error('Error creating selections:', selectionsError)
        return NextResponse.json({ error: 'Failed to create selections' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ message: 'Configuration created successfully', configuration })
  } catch (error) {
    console.error('Error in configurations POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 