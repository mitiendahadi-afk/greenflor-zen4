export default function TrustBadges() {
  const badges = [
    { icon: '🚚', title: 'توصيل مجاني', sub: 'لجميع مدن المغرب' },
    { icon: '⏱', title: '24–48 ساعة', sub: 'وقت التوصيل' },
    { icon: '💳', title: 'دفع عند الاستلام', sub: 'لا حاجة لبطاقة' },
    { icon: '🛡', title: 'ضمان 30 يوم', sub: 'استرداد مضمون' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {badges.map((b, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">{b.icon}</div>
          <p className="font-black text-sm text-[#111] font-cairo">{b.title}</p>
          <p className="text-gray-500 text-xs mt-0.5">{b.sub}</p>
        </div>
      ))}
    </div>
  )
}
