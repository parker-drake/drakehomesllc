import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    
    const { status } = body
    
    // Validate status
    const validStatuses = ['draft', 'submitted', 'contacted', 'closed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    
    // Update the configuration
    const { data: configuration, error } = await supabase
      .from('customer_configurations')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating configuration:', error)
      return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Configuration updated successfully', configuration })
  } catch (error) {
    console.error('Error in configuration PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin
    
    // Delete the configuration and all related selections
    const { error } = await supabase
      .from('customer_configurations')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting configuration:', error)
      return NextResponse.json({ error: 'Failed to delete configuration' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Configuration deleted successfully' })
  } catch (error) {
    console.error('Error in configuration DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 