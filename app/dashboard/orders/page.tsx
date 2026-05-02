'use client'
import { useState, useEffect, useCallback } from 'react'

interface Order {
  id: string
  order_number: number
  name: string
  phone: string
  address: string
  city?: string
  note?: string
  status: string
  amount: number
  created_at: string
  source?: string
  ip_address?: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: 'جديد', color: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'مؤكد', color: 'bg-yellow-100 text-yellow-700' },
  shipped:   { label: 'في الطريق', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Order | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: page.toString(), limit: '20' })
    if (filterStatus) params.set('status', filterStatus)
    const res = await fetch(`/api/orders?${params}`)
    const data = await res.json()
    setOrders(data.orders || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [page, filterStatus])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
    if (selected?.id === id) {
      setSelected(prev => prev ? { ...prev, status } : null)
    }
  }

  const exportCSV = () => {
    const headers = ['#', 'الاسم', 'الهاتف', 'العنوان', 'المدينة', 'الحالة', 'المبلغ', 'التاريخ', 'المصدر']
    const rows = orders.map(o => [
      o.order_number, o.name, o.phone, o.address, o.city || '',
      STATUS_LABELS[o.status]?.label || o.status, o.amount,
      new Date(o.created_at).toLocaleString('ar-MA'), o.source || ''
    ])
    const csv = [headers, ...rows].map(r => r.map(String).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `orders-${Date.now()}.csv`; a.click()
  }

  const formatDate = (d: string) => new Date(d).toLocaleString('ar-MA', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="p-4 lg:p-8 space-y-5" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#111] font-cairo">الطلبات 📦</h1>
          <p className="text-gray-500 text-sm">إجمالي: {total} طلب</p>
        </div>
        <button onClick={exportCSV} className="bg-[#0B8437] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#096d2e]">
          ⬇️ تصدير CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[['', 'الكل'], ['new', 'جديد'], ['confirmed', 'مؤكد'], ['shipped', 'في الطريق'], ['delivered', 'تم التوصيل'], ['cancelled', 'ملغي']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setFilterStatus(val); setPage(1) }}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-colors ${filterStatus === val ? 'bg-[#0B8437] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">إجراء</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">التاريخ</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">الحالة</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">المبلغ</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">الهاتف</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">الاسم</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">#</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400">⏳ جاري التحميل...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400">لا توجد طلبات</td></tr>
              ) : orders.map(order => {
                const st = STATUS_LABELS[order.status] || STATUS_LABELS.new
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelected(order)}
                        className="text-[#0B8437] hover:underline text-xs font-bold"
                      >
                        عرض
                      </button>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={`${st.color} text-xs font-bold px-2 py-1 rounded-lg border-0 cursor-pointer`}
                      >
                        {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
                          <option key={v} value={v}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0B8437]">{order.amount} DH</td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-mono text-xs"
                        dir="ltr"
                      >
                        {order.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#111]">{order.name}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">#{order.order_number}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="p-4 flex justify-center gap-2 border-t border-gray-100">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-bold disabled:opacity-50"
            >
              ‹ السابق
            </button>
            <span className="px-4 py-2 text-sm text-gray-500">
              {page} / {Math.ceil(total / 20)}
            </span>
            <button
              disabled={page >= Math.ceil(total / 20)}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-bold disabled:opacity-50"
            >
              التالي ›
            </button>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4" dir="rtl">
            <div className="flex items-center justify-between">
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              <h2 className="font-black text-[#111] font-cairo">طلب #{selected.order_number}</h2>
            </div>

            <div className="space-y-3 text-sm">
              {[
                ['الاسم', selected.name],
                ['الهاتف', selected.phone],
                ['العنوان', selected.address],
                ['المدينة', selected.city || '—'],
                ['المبلغ', `${selected.amount} DH`],
                ['المصدر', selected.source || 'direct'],
                ['التاريخ', formatDate(selected.created_at)],
                ['ملاحظة', selected.note || '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">{val}</span>
                  <span className="font-bold text-gray-500">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <a
                href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white text-center py-3 rounded-xl font-bold text-sm hover:opacity-90"
              >
                📱 واتساب
              </a>
              <select
                value={selected.status}
                onChange={e => updateStatus(selected.id, e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm font-bold"
              >
                {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
