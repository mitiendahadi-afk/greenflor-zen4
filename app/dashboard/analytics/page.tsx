'use client'
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

interface ChartData {
  date: string
  orders: number
  revenue: number
}

interface SourceData {
  name: string
  value: number
}

const COLORS = ['#0B8437', '#8FA955', '#C9A84C', '#4B9CD3', '#E06C75']

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [sourceData, setSourceData] = useState<SourceData[]>([])
  const [period, setPeriod] = useState<'7d' | '30d'>('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const days = period === '7d' ? 7 : 30
      const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

      const res = await fetch(`/api/orders?limit=500`)
      const data = await res.json()
      const orders = (data.orders || []).filter((o: { created_at: string }) => o.created_at >= from)

      // Chart data
      const chart = Array.from({ length: days }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (days - 1 - i))
        const dateStr = d.toISOString().split('T')[0]
        const dayOrders = orders.filter((o: { created_at: string; status: string; amount: number }) => o.created_at.startsWith(dateStr) && o.status !== 'cancelled')
        return {
          date: dateStr,
          orders: dayOrders.length,
          revenue: dayOrders.reduce((s: number, o: { amount: number }) => s + o.amount, 0),
        }
      })
      setChartData(chart)

      // Source data
      const sourceCounts: Record<string, number> = {}
      orders.forEach((o: { source?: string }) => {
        const s = o.source || 'direct'
        sourceCounts[s] = (sourceCounts[s] || 0) + 1
      })
      const sourceMap: Record<string, string> = {
        direct: 'مباشر', facebook: 'فيسبوك', tiktok: 'تيك توك',
        google: 'جوجل', whatsapp: 'واتساب', instagram: 'إنستغرام'
      }
      setSourceData(Object.entries(sourceCounts).map(([k, v]) => ({
        name: sourceMap[k] || k,
        value: v,
      })))
      setLoading(false)
    }
    fetchData()
  }, [period])

  const formatDate = (d: string) => {
    const date = new Date(d)
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = chartData.reduce((s, d) => s + d.orders, 0)
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  return (
    <div className="p-4 lg:p-8 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#111] font-cairo">الإحصائيات 📈</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('7d')}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${period === '7d' ? 'bg-[#0B8437] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            7 أيام
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${period === '30d' ? 'bg-[#0B8437] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            30 يوم
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: '💰', label: 'إجمالي الدخل', value: `${totalRevenue} DH` },
          { icon: '📦', label: 'إجمالي الطلبات', value: totalOrders.toString() },
          { icon: '📊', label: 'متوسط الطلب', value: `${avgOrder} DH` },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 text-right shadow-sm">
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="text-xl font-black text-[#0B8437]">{c.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">⏳ جاري التحميل...</div>
      ) : (
        <>
          {/* Revenue chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-black text-[#111] mb-4 text-right">رقم الأعمال اليومي</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => [`${v} DH`, 'الدخل']} labelFormatter={formatDate} />
                  <Bar dataKey="revenue" fill="#0B8437" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders line chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-black text-[#111] mb-4 text-right">عدد الطلبات اليومي</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => [v, 'الطلبات']} labelFormatter={formatDate} />
                  <Line type="monotone" dataKey="orders" stroke="#8FA955" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source pie chart */}
          {sourceData.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-[#111] mb-4 text-right">مصادر الطلبات</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {sourceData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
