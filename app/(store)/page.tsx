'use client'
import { useState } from 'react'
import TopBar from '@/components/store/TopBar'
import Header from '@/components/store/Header'
import HeroSlider from '@/components/store/HeroSlider'
import TrustBadges from '@/components/store/TrustBadges'
import PlantsSlider from '@/components/store/PlantsSlider'
import RachidSection from '@/components/store/RachidSection'
import ReviewsSlider from '@/components/store/ReviewsSlider'
import FAQ from '@/components/store/FAQ'
import FloatingCTA from '@/components/store/FloatingCTA'
import OrderModal from '@/components/store/OrderModal'
import Footer from '@/components/store/Footer'

export default function StorePage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white font-cairo" dir="rtl">
      <TopBar />
      <Header onOrderClick={() => setModalOpen(true)} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        {/* 1. Hero */}
        <section>
          <HeroSlider images={[]} onOrderClick={() => setModalOpen(true)} />
        </section>

        {/* 2. Trust Badges */}
        <section>
          <TrustBadges />
        </section>

        {/* 3. Plants Slider */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-[#111] font-cairo">🌿 النباتات اللي غادي توصلوا</h2>
            <p className="text-gray-500 mt-1">10 نباتات داخلية منتقاة بعناية فائقة</p>
          </div>
          <PlantsSlider />
        </section>

        {/* 4. Green CTA Banner */}
        <section className="bg-[#0B8437] rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-black mb-2 font-cairo">اطلب الآن وتوصل ليك في 24/48 ساعة 🚀</h2>
          <p className="text-green-200 mb-5">توصيل مجاني | دفع عند الاستلام | ضمان 30 يوم</p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-white text-[#0B8437] font-black text-lg px-8 py-4 rounded-2xl hover:bg-green-50 transition-colors"
          >
            🛒 اطلب الآن — 395 DH فقط
          </button>
        </section>

        {/* 5. Rachid Section */}
        <section>
          <RachidSection onOrderClick={() => setModalOpen(true)} />
        </section>

        {/* 6. What you receive */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-[#111] font-cairo">📦 شنو غادي تستلم</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🌿', title: '10 نباتات داخلية', desc: 'منتقاة بعناية من قبل خبراء النباتات' },
              { icon: '🎁', title: 'هدية رشيد المفاجئة', desc: 'هدية خاصة في كل طلب' },
              { icon: '📖', title: 'دليل العناية', desc: 'كتيب إرشادات للعناية بكل نبتة' },
              { icon: '🚚', title: 'توصيل مجاني', desc: 'حتى باب داركم في 24-48 ساعة' },
              { icon: '🛡', title: 'ضمان 30 يوم', desc: 'راضي مضمون وإلا ترجع الفلوس' },
            ].map((item, i) => (
              <div key={i} className="bg-[#F5F9F2] rounded-2xl p-5 text-right flex gap-4 items-start">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-[#111] font-cairo">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Why choose us */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-[#111] font-cairo">🏆 علاش تختار GreenFlor Zen</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🌱', title: 'جودة عالية', desc: 'كل نبتة مفحوصة ومختارة بعناية' },
              { icon: '💰', title: 'أسعار لا تقاوم', desc: '395 DH فقط بدل 600 DH — وفر 34%' },
              { icon: '🚀', title: 'توصيل سريع', desc: '24-48 ساعة في جميع أنحاء المغرب' },
              { icon: '💳', title: 'دفع آمن', desc: 'دفع عند الاستلام — لا مخاطرة' },
              { icon: '🤝', title: 'خدمة شخصية', desc: 'رشيد متاح على واتساب دائماً' },
              { icon: '♻️', title: 'صديق للبيئة', desc: 'تغليف من مواد قابلة للتدوير' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 text-right hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#111] font-cairo">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Delivery info */}
        <section className="bg-[#F5F9F2] rounded-3xl p-6">
          <h2 className="text-2xl font-black text-center text-[#111] font-cairo mb-6">🚚 معلومات التوصيل</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📦', title: 'الأبعاد', value: '60×40×30 سم' },
              { icon: '⚖️', title: 'الوزن', value: 'حوالي 5 كغ' },
              { icon: '⏰', title: 'مدة التوصيل', value: '24–48 ساعة' },
              { icon: '🆓', title: 'تكلفة التوصيل', value: 'مجاني تماماً!' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-bold text-xs text-gray-500 mb-1">{item.title}</p>
                <p className="font-black text-[#0B8437] text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Guarantee */}
        <section className="border-2 border-[#0B8437] rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">🛡</div>
          <h2 className="text-2xl font-black text-[#0B8437] font-cairo mb-2">ضمان 30 يوم كامل</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            إذا ما رضيتيش بأي سبب خلال 30 يوم من الاستلام، كنرجعوا ليك الفلوس بالكامل بدون أسئلة.
            <br />
            <span className="text-sm text-gray-400 mt-2 block">Satisfait ou remboursé — 30 jours sans conditions.</span>
          </p>
        </section>

        {/* 10. Reviews */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-[#111] font-cairo">⭐ آراء عملاءنا</h2>
            <p className="text-gray-500 mt-1">+720 عميل سعيد في جميع أنحاء المغرب</p>
          </div>
          <ReviewsSlider />
        </section>

        {/* 11. FAQ */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-[#111] font-cairo">❓ أسئلة شائعة</h2>
          </div>
          <FAQ />
        </section>

        {/* 12. Final CTA */}
        <section className="bg-[#0B8437] rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-black mb-2 font-cairo">🌿 ما تفوّتش الفرصة!</h2>
          <p className="text-green-200 mb-2">كمية محدودة — العرض ينتهي قريباً</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-green-300 line-through text-xl">600 DH</span>
            <span className="text-4xl font-black">395 DH</span>
            <span className="bg-yellow-400 text-[#111] px-2 py-0.5 rounded font-bold text-sm">-34%</span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-white text-[#0B8437] font-black text-xl px-10 py-5 rounded-2xl hover:bg-green-50 transition-colors shadow-xl"
          >
            🛒 اطلب الآن — توصيل مجاني
          </button>
          <p className="text-green-300 text-sm mt-4">دفع عند الاستلام | ضمان 30 يوم | توصيل 24-48 ساعة</p>
        </section>
      </div>

      <Footer />

      {/* Floating CTA (mobile) */}
      <FloatingCTA onOrderClick={() => setModalOpen(true)} isModalOpen={modalOpen} />

      {/* Order Modal */}
      <OrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}
