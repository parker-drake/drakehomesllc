import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: selectionBook, error } = await supabaseAdmin
      .from('selection_books')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching selection book:', error)
      return NextResponse.json({ error: 'Selection book not found' }, { status: 404 })
    }

    return NextResponse.json(selectionBook)
  } catch (error) {
    console.error('Error in selection book GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Only update fields that are provided
    if (body.customer_name !== undefined) updateData.customer_name = body.customer_name
    if (body.customer_email !== undefined) updateData.customer_email = body.customer_email
    if (body.customer_phone !== undefined) updateData.customer_phone = body.customer_phone
    if (body.job_address !== undefined) updateData.job_address = body.job_address
    if (body.house_plan !== undefined) updateData.house_plan = body.house_plan
    if (body.house_plan_id !== undefined) updateData.house_plan_id = body.house_plan_id
    if (body.selections !== undefined) updateData.selections = body.selections
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.total_upgrades_price !== undefined) updateData.total_upgrades_price = body.total_upgrades_price
    if (body.status !== undefined) updateData.status = body.status

    const { data: selectionBook, error } = await supabaseAdmin
      .from('selection_books')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating selection book:', error)
      return NextResponse.json({ error: 'Failed to update selection book' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Selection book updated', selectionBook })
  } catch (error) {
    console.error('Error in selection book PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('selection_books')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting selection book:', error)
      return NextResponse.json({ error: 'Failed to delete selection book' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Selection book deleted' })
  } catch (error) {
    console.error('Error in selection book DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

