'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setLoading(false)
    } else {
      router.push('/dashboard/orders')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F9F2] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-2xl font-black text-[#0B8437] font-cairo">GreenFlor Zen</h1>
          <p className="text-gray-500 text-sm mt-1">لوحة التحكم الإدارية</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm text-right">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 text-right">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@greenflor.ma"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-[#0B8437] font-cairo"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 text-right">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-[#0B8437]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B8437] hover:bg-[#096d2e] disabled:bg-gray-300 text-white font-black py-4 rounded-2xl transition-colors mt-2"
          >
            {loading ? '⏳ جاري الدخول...' : '🔐 دخول'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">GreenFlor Zen Admin — v1.0</p>
      </div>
    </div>
  )
}
