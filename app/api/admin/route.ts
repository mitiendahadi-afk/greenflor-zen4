import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { Order, StoreSettings } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'stats'
    const db = getSupabaseAdmin()

    if (type === 'stats') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayISO = today.toISOString()
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

      const { data: todayData } = await db.from('orders').select('*').gte('created_at', todayISO)
      const todayRows = (todayData || []) as Order[]

      const { count: visitorCount } = await db
        .from('visitors')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', fiveMinAgo)

      const todayRevenue = todayRows
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.amount || 0), 0)

      const onlineVisitors = visitorCount || 0
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      const { data: weekData } = await db
        .from('orders')
        .select('*')
        .gte('created_at', sevenDaysAgo)
        .order('created_at', { ascending: true })
      const weekOrders = (weekData || []) as Order[]

      const chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        const dateStr = d.toISOString().split('T')[0]
        const dayOrders = weekOrders.filter(o =>
          o.created_at.startsWith(dateStr) && o.status !== 'cancelled'
        )
        return {
          date: dateStr,
          orders: dayOrders.length,
          revenue: dayOrders.reduce((s, o) => s + (o.amount || 0), 0),
        }
      })

      return NextResponse.json({
        todayRevenue,
        todayOrders: todayRows.length,
        onlineVisitors,
        chartData,
      })
    }

    if (type === 'settings') {
      const { data } = await db.from('store_settings').select('*')
      const rows = (data || []) as StoreSettings[]
      const settings: Record<string, string> = {}
      rows.forEach(s => { settings[s.key] = s.value })
      return NextResponse.json({ settings })
    }

    return NextResponse.json({ error: 'نوع غير صالح' }, { status: 400 })
  } catch (error) {
    console.error('[Admin GET] Error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body
    const db = getSupabaseAdmin()

    if (type === 'settings') {
      const { settings } = body as { settings: Record<string, string> }
      const upserts = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
      }))

      const { error } = await db.from('store_settings').upsert(upserts, { onConflict: 'key' })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'نوع غير صالح' }, { status: 400 })
  } catch (error) {
    console.error('[Admin POST] Error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
