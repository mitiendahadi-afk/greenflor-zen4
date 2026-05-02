'use client'
import { useState } from 'react'

const FAQ_ITEMS = [
  {
    q: 'واش التوصيل مجاني؟ — La livraison est-elle gratuite?',
    a: 'نعم! التوصيل مجاني لجميع مدن المغرب بدون استثناء. — Oui! La livraison est offerte dans tout le Maroc.',
  },
  {
    q: 'كيفاش غادي ندفع؟ — Comment payer?',
    a: 'الدفع عند الاستلام فقط — ما محتاجش بطاقة بنكية. تدفع للمبعوث حين يوصلك الطلب. — Paiement à la livraison uniquement, cash en main au livreur.',
  },
  {
    q: 'شحال من وقت يوصل الطلب؟ — Quel est le délai de livraison?',
    a: 'بين 24 و48 ساعة لجميع المدن المغربية. — Entre 24 et 48 heures partout au Maroc.',
  },
  {
    q: 'شنو هي هدية رشيد؟ — C\'est quoi le cadeau de Rachid?',
    a: 'هي مفاجأة! ما قادرينش نقولوها دابا باش تبقى خاصة. لكن كل الناس ترضات عليها 😊 — C\'est une surprise! On garde le mystère, mais tout le monde l\'aime.',
  },
  {
    q: 'واش يمكن ترجع النباتات؟ — Puis-je retourner les plantes?',
    a: 'عندك ضمان 30 يوم — إذا ما رضيتيش بأي سبب، كنرجعوا ليك الفلوس. — Garantie 30 jours: remboursement complet si vous n\'êtes pas satisfait.',
  },
  {
    q: 'كيفاش نتواصل معكم؟ — Comment vous contacter?',
    a: 'عن طريق واتساب على الرقم +212775137626 أو عبر الإيميل greenflor7@gmail.com — Via WhatsApp +212775137626 ou email greenflor7@gmail.com.',
  },
  {
    q: 'واش النباتات محتاجة خدمة بزاف؟ — Beaucoup d\'entretien?',
    a: 'لا! اخترنا نباتات سهلة العناية تناسب المبتدئين. مع كل طلب كتجي دليل مكتوب للعناية. — Non! On a choisi des plantes faciles, parfaites pour les débutants. Un guide est fourni.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full p-4 text-right flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
          >
            <span className={`text-2xl transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>+</span>
            <span className="font-bold text-sm text-[#111] font-cairo flex-1">{item.q}</span>
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-right">
              <p className="text-gray-600 text-sm leading-relaxed font-cairo">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
