import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data: selectionBooks, error } = await supabaseAdmin
      .from('selection_books')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching selection books:', error)
      return NextResponse.json({ error: 'Failed to fetch selection books' }, { status: 500 })
    }

    return NextResponse.json(selectionBooks || [])
  } catch (error) {
    console.error('Error in selection books API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      customer_name,
      customer_email,
      customer_phone,
      job_address,
      house_plan,
      house_plan_id,
      selections,
      notes,
      total_upgrades_price,
      created_by
    } = body

    const { data: selectionBook, error } = await supabaseAdmin
      .from('selection_books')
      .insert({
        customer_name: customer_name || '',
        customer_email: customer_email || '',
        customer_phone: customer_phone || '',
        job_address: job_address || '',
        house_plan: house_plan || '',
        house_plan_id: house_plan_id || null,
        selections: selections || {},
        notes: notes || '',
        total_upgrades_price: total_upgrades_price || 0,
        created_by: created_by || 'admin',
        status: 'draft'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating selection book:', error)
      return NextResponse.json({ error: 'Failed to create selection book' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Selection book created', selectionBook })
  } catch (error) {
    console.error('Error in selection books POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

