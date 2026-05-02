'use client'
import { useState, useEffect } from 'react'

const messages = [
  '🔴 عدد محدود، ما تفوّتش الفرصة — Offre limitée',
  '🚚 توصيل مجاني لجميع مدن المغرب — Livraison gratuite',
  '✅ الدفع عند الاستلام — Paiement à la livraison',
]

export default function TopBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % messages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-[#0B8437] text-white text-center py-2 px-4 text-sm font-bold font-cairo sticky top-0 z-50">
      <span className="transition-all duration-500" key={index}>
        {messages[index]}
      </span>
    </div>
  )
}
