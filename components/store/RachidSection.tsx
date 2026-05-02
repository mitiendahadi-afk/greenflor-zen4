import Image from 'next/image'

interface RachidSectionProps {
  onOrderClick: () => void
  image?: string
}

export default function RachidSection({ onOrderClick, image }: RachidSectionProps) {
  return (
    <div className="border-2 border-[#C9A84C] rounded-3xl bg-[#FFF9ED] overflow-hidden">
      {/* Badge */}
      <div className="bg-[#C9A84C] text-white text-center py-2.5 font-bold text-sm">
        🌸 عرض حصري — كمية محدودة
      </div>

      <div className="p-6 space-y-5">
        <h2 className="text-2xl font-black text-center font-cairo text-[#111]">
          هدية رشيد المفاجئة 🎁
        </h2>

        {/* Rachid image + speech bubble */}
        <div className="flex flex-col md:flex-row gap-5 items-center">
          <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-[#C9A84C] relative bg-gradient-to-b from-[#F5F9F2] to-[#e8f5e9]">
            {image ? (
              <Image src={image} alt="Rachid" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">👨‍🌾</div>
            )}
          </div>

          <div className="flex-1 bg-white rounded-2xl p-4 relative border border-[#C9A84C]/30 text-right">
            <div className="absolute -right-3 top-5 w-4 h-4 bg-white border-r border-t border-[#C9A84C]/30 rotate-45 hidden md:block" />
            <p className="text-[#0B8437] font-bold text-sm mb-1">رشيد — مؤسس GreenFlor Zen 🌿</p>
            <p className="text-gray-700 text-sm leading-relaxed font-cairo">
              &quot;غاضي حبيت نفرح الناس بهدية خاصة — كل واحد كيشري باك النباتات، غادي يلقى معاه هدية مفاجئة منا نحن. هاد العرض ماشي دايم — كمية محدودة!&quot;
            </p>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-red-600 font-bold text-sm">🔴 الكمية محدودة جداً — العرض ينتهي قريباً</p>
        </div>

        {/* Offer explanation */}
        <div className="bg-[#e8f5e9] rounded-2xl p-4 text-right space-y-2">
          <h3 className="font-black text-[#0B8437] font-cairo">🎯 شنو غادي تستلم:</h3>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li className="flex items-center gap-2 justify-end">
              <span>10 نباتات داخلية مختارة بعناية</span>
              <span className="text-[#0B8437]">✅</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>هدية رشيد المفاجئة (سر!)</span>
              <span className="text-[#C9A84C]">🎁</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>دليل العناية بالنباتات</span>
              <span className="text-[#0B8437]">📖</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>توصيل مجاني لباب الدار</span>
              <span className="text-[#0B8437]">🚚</span>
            </li>
          </ul>
        </div>

        {/* Price box */}
        <div className="border-2 border-dashed border-[#C9A84C] rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-sm mb-1">كل هذا مقابل</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-gray-400 line-through text-lg">600 DH</span>
            <span className="text-3xl font-black text-[#0B8437]">395 DH</span>
          </div>
          <p className="text-[#C9A84C] font-bold text-sm mt-1">10 نباتات + هدية رشيد — دفع عند الاستلام</p>
        </div>

        <button
          onClick={onOrderClick}
          className="w-full bg-[#C9A84C] hover:bg-[#b8952e] text-white font-black text-lg py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          🎁 اطلب الآن واحصل على الهدية
        </button>
      </div>
    </div>
  )
}
