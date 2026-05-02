'use client'
import { useState, useEffect } from 'react'

interface Customer {
  phone: string
  name: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  city?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchCustomers() {
      const res = await fetch('/api/orders?limit=200')
      const data = await res.json()
      const orders = data.orders || []

      // Group by phone
      const map = new Map<string, Customer>()
      for (const order of orders) {
        const key = order.phone
        if (!map.has(key)) {
          map.set(key, {
            phone: order.phone,
            name: order.name,
            totalOrders: 0,
            totalSpent: 0,
            lastOrder: order.created_at,
            city: order.city,
          })
        }
        const c = map.get(key)!
        c.totalOrders++
        c.totalSpent += order.amount
        if (order.created_at > c.lastOrder) c.lastOrder = order.created_at
      }
      setCustomers(Array.from(map.values()).sort((a, b) => b.totalOrders - a.totalOrders))
      setLoading(false)
    }
    fetchCustomers()
  }, [])

  const filtered = customers.filter(c =>
    c.name.includes(search) || c.phone.includes(search) || (c.city || '').includes(search)
  )

  return (
    <div className="p-4 lg:p-8 space-y-5" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-[#111] font-cairo">العملاء 👥</h1>
        <p className="text-gray-500 text-sm">{customers.length} عميل فريد</p>
      </div>

      <input
        type="text"
        placeholder="🔍 بحث بالاسم، الهاتف، أو المدينة..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right font-cairo focus:outline-none focus:ring-2 focus:ring-[#0B8437]"
      />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">إجراء</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">آخر طلب</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">إجمالي الإنفاق</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">عدد الطلبات</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">المدينة</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">الهاتف</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">الاسم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400">⏳ جاري التحميل...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400">لا توجد نتائج</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:underline text-xs font-bold"
                    >
                      💬 واتساب
                    </a>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {new Date(c.lastOrder).toLocaleDateString('ar-MA')}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#0B8437]">{c.totalSpent} DH</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${c.totalOrders > 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.totalOrders} {c.totalOrders > 1 ? '🔁' : ''}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{c.city || '—'}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-600" dir="ltr">{c.phone}</td>
                  <td className="py-3 px-4 font-semibold text-[#111]">{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
