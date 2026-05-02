import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ip, country, city, page, referrer } = body

    const db = getSupabaseAdmin()
    await db.from('visitors').insert({ ip, country, city, page, referrer })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Notify] Error:', error)
    return NextResponse.json({ success: false })
  }
}

export async function GET() {
  try {
    const db = getSupabaseAdmin()
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    const { count } = await db
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', fiveMinAgo)

    return NextResponse.json({ online: count || 0 })
  } catch (error) {
    console.error('[Notify GET] Error:', error)
    return NextResponse.json({ online: 0 })
  }
}
