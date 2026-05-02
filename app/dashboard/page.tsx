'use client'
import { useState, useEffect, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'
import { playOrderSound } from '@/lib/sounds'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface Stats {
  todayRevenue: number
  todayOrders: number
  onlineVisitors: number
  chartData: { date: string; orders: number; revenue: number }[]
}

interface Order {
  id: string
  order_number: number
  name: string
  phone: string
  address: string
  city?: string
  status: string
  amount: number
  created_at: string
  source?: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: 'جديد', color: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'مؤكد', color: 'bg-yellow-100 text-yellow-700' },
  shipped:   { label: 'في الطريق', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [notification, setNotification] = useState<Order | null>(null)

  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/admin?type=stats')
    const data = await res.json()
    setStats(data)
  }, [])

  const fetchOrders = useCallback(async () => {
    const res = await fetch('/api/orders?limit=10')
    const data = await res.json()
    setOrders(data.orders || [])
  }, [])

  useEffect(() => {
    fetchStats()
    fetchOrders()

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Realtime subscription
    const client = getSupabase()
    const channel = client
      .channel('new-orders-dashboard')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new as Order
          playOrderSound()
          setNotification(newOrder)
          setOrders(prev => [newOrder, ...prev.slice(0, 9)])
          fetchStats()

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🌿 طلب جديد!', {
              body: `${newOrder.name} — ${newOrder.phone}`,
              icon: '/favicon.ico',
            })
          }
        }
      )
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [fetchStats, fetchOrders])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.toLocaleDateString('ar-MA')} ${d.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}`
  }

  const formatChartDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getDate()}/${d.getMonth() + 1}`
  }

  return (
    <div className="p-4 lg:p-8 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111] font-cairo">الرئيسية 📊</h1>
          <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button
          onClick={() => { fetchStats(); fetchOrders() }}
          className="bg-[#0B8437] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#096d2e] transition-colors"
        >
          🔄 تحديث
        </button>
      </div>

      {/* New order notification */}
      {notification && (
        <div className="bg-[#0B8437] text-white rounded-2xl p-4 flex items-center justify-between animate-fade-in">
          <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white">✕</button>
          <div className="text-right">
            <p className="font-black">🎉 طلب جديد #{notification.order_number}!</p>
            <p className="text-green-200 text-sm">{notification.name} — {notification.phone}</p>
          </div>
          <span className="text-3xl">🛒</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '💰', label: 'رقم الأعمال اليوم', value: stats ? `${stats.todayRevenue} DH` : '...', color: 'bg-green-50 text-[#0B8437]' },
          { icon: '📦', label: 'الطلبات اليوم', value: stats ? stats.todayOrders.toString() : '...', color: 'bg-blue-50 text-blue-700' },
          { icon: '👁', label: 'زوار الآن', value: stats ? stats.onlineVisitors.toString() : '...', color: 'bg-purple-50 text-purple-700' },
          { icon: '📈', label: 'معدل التحويل', value: stats && stats.onlineVisitors > 0 ? `${Math.round((stats.todayOrders / Math.max(stats.onlineVisitors, 1)) * 100)}%` : '—', color: 'bg-orange-50 text-orange-700' },
        ].map((card, i) => (
          <div key={i} className={`${card.color} rounded-2xl p-5 text-right`}>
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-2xl font-black font-cairo">{card.value}</div>
            <div className="text-xs font-semibold mt-1 opacity-70">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {stats?.chartData && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-black text-[#111] font-cairo mb-4 text-right">الطلبات — آخر 7 أيام</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B8437" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0B8437" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={formatChartDate} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v, name) => [v, name === 'orders' ? 'طلبات' : 'دخل DH']}
                  labelFormatter={formatChartDate}
                />
                <Area type="monotone" dataKey="orders" stroke="#0B8437" fill="url(#greenGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <a href="/dashboard/orders" className="text-[#0B8437] text-sm font-bold hover:underline">
            عرض الكل ←
          </a>
          <h2 className="font-black text-[#111] font-cairo">آخر الطلبات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">الحالة</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">المبلغ</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">الهاتف</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">الاسم</th>
                <th className="py-3 px-4 text-right text-gray-500 font-semibold">#</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">لا توجد طلبات بعد</td>
                </tr>
              ) : orders.map(order => {
                const st = STATUS_LABELS[order.status] || STATUS_LABELS.new
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`${st.color} px-2 py-0.5 rounded-lg text-xs font-bold`}>{st.label}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0B8437]">{order.amount} DH</td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs" dir="ltr">{order.phone}</td>
                    <td className="py-3 px-4 font-semibold text-[#111]">{order.name}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">#{order.order_number}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
