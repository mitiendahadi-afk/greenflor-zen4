import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendOrderEmail } from '@/lib/resend'
import { sendOrderSMS } from '@/lib/twilio'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, address, city, note } = body

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: 'الاسم ورقم الهاتف والعنوان مطلوبون' },
        { status: 400 }
      )
    }

    const phoneClean = String(phone).replace(/\s/g, '')
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const referer = request.headers.get('referer') || ''
    let source = 'direct'
    if (referer.includes('facebook') || referer.includes('fb.com') || referer.includes('instagram')) {
      source = 'facebook'
    } else if (referer.includes('tiktok')) {
      source = 'tiktok'
    } else if (referer.includes('google')) {
      source = 'google'
    } else if (referer.includes('whatsapp')) {
      source = 'whatsapp'
    }

    const db = getSupabaseAdmin()
    const { data: order, error } = await db
      .from('orders')
      .insert({
        name: String(name).trim(),
        phone: phoneClean,
        address: String(address).trim(),
        city: city ? String(city).trim() : '',
        note: note ? String(note).trim() : '',
        amount: 395,
        ip_address: ip,
        source,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('[Orders] Supabase error:', error)
      return NextResponse.json({ error: 'خطأ في حفظ الطلب' }, { status: 500 })
    }

    Promise.all([
      sendOrderEmail(order),
      sendOrderSMS(order),
    ]).catch(err => console.error('[Orders] Notification error:', err))

    return NextResponse.json({
      success: true,
      order_number: order.order_number,
      id: order.id,
    })
  } catch (error) {
    console.error('[Orders] API error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const db = getSupabaseAdmin()
    let query = db
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders: data, total: count, page, limit })
  } catch (error) {
    console.error('[Orders GET] Error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
