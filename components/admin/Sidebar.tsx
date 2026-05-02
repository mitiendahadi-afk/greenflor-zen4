'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

const NAV = [
  { href: '/dashboard', icon: '📊', label: 'الرئيسية' },
  { href: '/dashboard/orders', icon: '📦', label: 'الطلبات' },
  { href: '/dashboard/customers', icon: '👥', label: 'العملاء' },
  { href: '/dashboard/products', icon: '🌿', label: 'المنتجات' },
  { href: '/dashboard/analytics', icon: '📈', label: 'الإحصائيات' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'الإعدادات' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await getSupabase().auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111] min-h-screen fixed right-0 top-0 z-30">
        <div className="p-6 border-b border-gray-800">
          <div className="text-center">
            <span className="text-2xl font-black text-[#8FA955]">🌿 GreenFlor</span>
            <p className="text-gray-500 text-xs mt-1">لوحة التحكم</p>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all flex-row-reverse ${
                pathname === item.href
                  ? 'bg-[#0B8437] text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 transition-colors text-sm font-bold flex-row-reverse"
          >
            <span>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-gray-800 z-30 flex justify-around py-2">
        {NAV.slice(0, 5).map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === item.href ? 'text-[#8FA955]' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[9px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
