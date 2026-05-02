import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type OrderUpdate = Database['public']['Tables']['orders']['Update']

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, note } = body

    const validStatuses = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 })
    }

    const db = getSupabaseAdmin()
    const updateData: OrderUpdate = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (note !== undefined) updateData.note = note

    const { data, error } = await db
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data })
  } catch (error) {
    console.error('[Orders PATCH] Error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getSupabaseAdmin()
    const { error } = await db.from('orders').delete().eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Orders DELETE] Error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
