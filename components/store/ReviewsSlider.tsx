'use client'
import { useState } from 'react'

const REVIEWS = [
  { name: 'فاطمة الزهراء', city: 'الدار البيضاء', text: 'النباتات وصلات بزربة وكاملة — رشيد واعر والتوصيل سريع جداً! نصح ليكم باش تخدموا مع GreenFlor', stars: 5 },
  { name: 'يوسف بنعلي', city: 'الرباط', text: 'شريت الباك وما ندمتش — الهدية المفاجئة كانت رائعة! النباتات زينة وعندها حياة طويلة', stars: 5 },
  { name: 'خديجة المنصوري', city: 'فاس', text: '10 نباتات ب395 درهم؟ عرض ما كاين حتى واحد زعموا! وزيد التوصيل مجاني، لله يجزيك خير رشيد', stars: 5 },
  { name: 'عبد الرحيم', city: 'مراكش', text: 'قضية عمري! الدار ديالي بانت مختلفة بعد النباتات. الخدمة ممتازة والمتابعة كانت مزيانة', stars: 5 },
  { name: 'سلمى أيت', city: 'أكادير', text: 'كنت خايفة نطلب أول مرة لكن الحمد لله — كل شيء تمام. الباك وصل سليم ومعاه هدية حلوة جداً', stars: 5 },
  { name: 'هاني الدريوش', city: 'طنجة', text: 'غادي نعاود الطلب بحال. النباتات حيات مزيان وما محتاجاش خدمة كثيرة. شكراً GreenFlor!', stars: 5 },
  { name: 'نادية', city: 'مكناس', text: 'هدية رشيد كانت هي الأحسن! ما كنتش منتظرة ولا شيء — جاء شيء حلو جداً مع الباك', stars: 5 },
  { name: 'كريم السايح', city: 'وجدة', text: 'خدمة عملاء ممتازة — رشيد جاوب عليا مباشرة فالواتساب. النباتات واصلات في 24 ساعة فقط!', stars: 5 },
]

export default function ReviewsSlider() {
  const [current, setCurrent] = useState(0)
  const visibleCount = typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {REVIEWS.slice(current, current + (typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1)).map((r, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-right">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#C9A84C] text-sm font-medium">{r.city}</span>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8FA955] to-[#0B8437] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {r.name.charAt(0)}
                </div>
              </div>
            </div>
            <p className="font-bold text-[#111] text-sm mb-1">{r.name}</p>
            <div className="text-yellow-400 text-sm mb-2">{'⭐'.repeat(r.stars)}</div>
            <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: REVIEWS.length }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-5 h-2 bg-[#0B8437]' : 'w-2 h-2 bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  )
}
