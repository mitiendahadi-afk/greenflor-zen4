'use client'
import { useState, useEffect } from 'react'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
}

type FieldErrors = {
  name?: string
  phone?: string
  address?: string
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', note: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const validate = () => {
    const newErrors: FieldErrors = {}
    if (!form.name.trim()) newErrors.name = 'الاسم مطلوب'
    if (!form.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب'
    else if (!/^(06|07|0[67]|\+212[67]|00212[67])\d{8}$|^\d{10}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'رقم الهاتف غير صحيح (06/07...)'
    }
    if (!form.address.trim()) newErrors.address = 'العنوان مطلوب'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        setOrderNumber(data.order_number)
        setSuccess(true)

        // Play sound
        try {
          const { playOrderSound } = await import('@/lib/sounds')
          playOrderSound()
        } catch (e) { /* silent */ }

        // Open WhatsApp
        const msg = encodeURIComponent(
          `🌿 طلب جديد — Green Flor Zen\n━━━━━━━━━━━━━━━━\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالعنوان: ${form.address}${form.city ? `\nالمدينة: ${form.city}` : ''}${form.note ? `\nملاحظة: ${form.note}` : ''}\n━━━━━━━━━━━━━━━━\n395 درهم | توصيل مجاني | دفع عند الاستلام`
        )
        setTimeout(() => {
          window.open(`https://wa.me/212775137626?text=${msg}`, '_blank')
        }, 800)
      } else {
        alert(data.error || 'حدث خطأ، حاول مرة أخرى')
      }
    } catch {
      alert('تعذر الاتصال بالخادم، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setTimeout(() => {
        setSuccess(false)
        setOrderNumber(null)
        setForm({ name: '', phone: '', address: '', city: '', note: '' })
        setErrors({})
      }, 300)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl animate-slide-up max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#0B8437] text-white p-5 rounded-t-3xl md:rounded-t-3xl">
          <div className="flex items-center justify-between">
            <button onClick={handleClose} className="text-white/80 hover:text-white text-2xl font-light">
              ×
            </button>
            <div className="text-right">
              <h2 className="text-xl font-black font-cairo">🛒 اطلب الآن</h2>
              <p className="text-green-200 text-sm">باك GreenFlor Zen — 395 DH</p>
            </div>
          </div>
        </div>

        {success ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="text-7xl animate-bounce-slow">🎉</div>
            <h3 className="text-2xl font-black text-[#0B8437] font-cairo">تبارك الله! تم الطلب</h3>
            <p className="text-gray-600">رقم طلبك: <strong className="text-[#0B8437]">#{orderNumber}</strong></p>
            <div className="bg-[#F5F9F2] rounded-2xl p-4 text-right space-y-2">
              <p className="font-bold text-[#0B8437]">✅ تم استلام طلبك بنجاح</p>
              <p className="text-gray-600 text-sm">سيتصل بيك فريقنا في أقرب وقت للتأكيد والتوصيل خلال 24–48 ساعة</p>
            </div>
            <div className="bg-[#FFF9ED] border border-[#C9A84C] rounded-2xl p-4">
              <p className="text-[#C9A84C] font-bold text-sm">🚀 تم فتح واتساب تلقائياً لتأكيد طلبك</p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-[#0B8437] text-white font-bold py-3 rounded-xl mt-2"
            >
              إغلاق
            </button>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4" dir="rtl">
            <div className="bg-[#F5F9F2] rounded-2xl p-4 flex items-center justify-between">
              <span className="font-black text-[#0B8437] text-xl">395 DH</span>
              <div className="text-right">
                <p className="font-bold text-sm text-gray-700">باك 10 نباتات</p>
                <p className="text-xs text-gray-500">توصيل مجاني | دفع عند الاستلام</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">الاسم الكامل *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: محمد الأمين"
                className={`w-full border rounded-xl px-4 py-3 text-right font-cairo focus:outline-none focus:ring-2 focus:ring-[#0B8437] ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">رقم الهاتف *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="06XX XXX XXX"
                className={`w-full border rounded-xl px-4 py-3 text-right font-cairo focus:outline-none focus:ring-2 focus:ring-[#0B8437] ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                dir="ltr"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">العنوان الكامل *</label>
              <textarea
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="الحي، الشارع، رقم المنزل..."
                rows={2}
                className={`w-full border rounded-xl px-4 py-3 text-right font-cairo focus:outline-none focus:ring-2 focus:ring-[#0B8437] resize-none ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">المدينة</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder="الدار البيضاء، الرباط، فاس..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right font-cairo focus:outline-none focus:ring-2 focus:ring-[#0B8437]"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">ملاحظة (اختياري)</label>
              <input
                type="text"
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                placeholder="أي تعليمة إضافية للتوصيل..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right font-cairo focus:outline-none focus:ring-2 focus:ring-[#0B8437]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B8437] hover:bg-[#096d2e] disabled:bg-gray-400 text-white font-black text-lg py-4 rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg"
            >
              {loading ? '⏳ جاري الإرسال...' : '🛒 تأكيد الطلب — 395 DH'}
            </button>

            <p className="text-center text-gray-400 text-xs pb-2">
              بالضغط على التأكيد، توافق على شروط الاستخدام وسياسة الإرجاع خلال 30 يوم
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
