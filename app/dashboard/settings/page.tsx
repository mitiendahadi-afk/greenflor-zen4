'use client'
import { useState, useEffect } from 'react'

interface Settings {
  fb_pixel: string
  tiktok_pixel: string
  google_ads_id: string
  product_price: string
  whatsapp_number: string
  notification_email: string
  notification_phone: string
  store_active: string
}

const DEFAULT_SETTINGS: Settings = {
  fb_pixel: '',
  tiktok_pixel: '',
  google_ads_id: '',
  product_price: '395',
  whatsapp_number: '+212775137626',
  notification_email: 'greenflor7@gmail.com',
  notification_phone: '+212631955019',
  store_active: 'true',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin?type=settings')
      const data = await res.json()
      if (data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }))
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'settings', settings }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const Field = ({ label, field, type = 'text', placeholder = '' }: {
    label: string
    field: keyof Settings
    type?: string
    placeholder?: string
  }) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5 text-right">{label}</label>
      <input
        type={type}
        value={settings[field]}
        onChange={e => setSettings(prev => ({ ...prev, [field]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right font-cairo focus:outline-none focus:ring-2 focus:ring-[#0B8437]"
        dir={type === 'email' || field === 'fb_pixel' || field === 'tiktok_pixel' || field === 'google_ads_id' ? 'ltr' : 'rtl'}
      />
    </div>
  )

  if (loading) return <div className="p-8 text-center text-gray-400">⏳ جاري التحميل...</div>

  return (
    <div className="p-4 lg:p-8 space-y-6" dir="rtl">
      <h1 className="text-2xl font-black text-[#111] font-cairo">الإعدادات ⚙️</h1>

      {saved && (
        <div className="bg-[#e8f5e9] border border-[#0B8437] text-[#0B8437] rounded-xl p-3 text-right font-bold">
          ✅ تم حفظ الإعدادات بنجاح!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-[#111] font-cairo text-right border-b pb-3">🏪 إعدادات المتجر</h2>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 text-right">
              حالة المتجر
            </label>
            <div className="flex gap-3 justify-end">
              {['true', 'false'].map(v => (
                <button
                  key={v}
                  onClick={() => setSettings(prev => ({ ...prev, store_active: v }))}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    settings.store_active === v
                      ? v === 'true' ? 'bg-[#0B8437] text-white' : 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {v === 'true' ? '✅ مفتوح' : '🔴 مغلق'}
                </button>
              ))}
            </div>
          </div>

          <Field label="سعر المنتج (DH)" field="product_price" type="number" placeholder="395" />
          <Field label="رقم واتساب" field="whatsapp_number" placeholder="+212775137626" />
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-[#111] font-cairo text-right border-b pb-3">🔔 إعدادات الإشعارات</h2>
          <Field label="إيميل الإشعارات" field="notification_email" type="email" placeholder="greenflor7@gmail.com" />
          <Field label="هاتف الإشعارات (SMS)" field="notification_phone" placeholder="+212631955019" />
        </div>

        {/* Marketing Pixels */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <h2 className="text-lg font-black text-[#111] font-cairo text-right border-b pb-3">📊 بيكسلات التسويق</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Facebook Pixel ID" field="fb_pixel" placeholder="123456789012345" />
            <Field label="TikTok Pixel ID" field="tiktok_pixel" placeholder="CXXXXXXXXXXXX" />
            <Field label="Google Ads ID" field="google_ads_id" placeholder="AW-XXXXXXXXX" />
          </div>
          <div className="bg-[#FFF9ED] rounded-xl p-4 text-right text-sm text-[#C9A84C]">
            <p className="font-bold">ℹ️ ملاحظة:</p>
            <p className="text-gray-600 text-xs mt-1">البيكسلات اختيارية — المتجر يعمل بدونها. تُستخدم فقط لتتبع التحويلات في الحملات الإعلانية.</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#0B8437] hover:bg-[#096d2e] disabled:bg-gray-300 text-white font-black px-8 py-4 rounded-2xl text-lg transition-colors"
      >
        {saving ? '⏳ جاري الحفظ...' : '💾 حفظ الإعدادات'}
      </button>
    </div>
  )
}
