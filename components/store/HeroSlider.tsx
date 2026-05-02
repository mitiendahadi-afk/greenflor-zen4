'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface HeroSliderProps {
  images: string[]
  onOrderClick: () => void
}

export default function HeroSlider({ images, onOrderClick }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const count = images.length || 6
  const slides = images.length > 0 ? images : Array.from({ length: 6 }, (_, i) => '')

  const next = () => setCurrent(c => (c + 1) % count)
  const prev = () => setCurrent(c => (c - 1 + count) % count)

  useEffect(() => {
    timerRef.current = setInterval(next, 4000)
    return () => clearInterval(timerRef.current)
  }, [count])

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 4000)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev()
      resetTimer()
    }
    setIsDragging(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
      {/* Slider */}
      <div className="relative">
        <div
          className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#8FA955] to-[#0B8437] cursor-grab"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
            >
              {src ? (
                <Image src={src} alt={`GreenFlor Zen ${i + 1}`} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">🌿</span>
                </div>
              )}
            </div>
          ))}

          {/* Arrows */}
          <button
            onClick={() => { prev(); resetTimer() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all"
          >
            ›
          </button>
          <button
            onClick={() => { next(); resetTimer() }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all"
          >
            ‹
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); resetTimer() }}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-[#0B8437]' : 'w-2 h-2 bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Thumbnails */}
        {slides.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {slides.map((src, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); resetTimer() }}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === current ? 'border-[#0B8437]' : 'border-transparent'}`}
              >
                {src ? (
                  <Image src={src} alt="" width={56} height={56} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#8FA955] to-[#0B8437] flex items-center justify-center text-xl">🌿</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="text-right space-y-4">
        <div className="inline-block bg-[#e8f5e9] text-[#0B8437] px-4 py-1.5 rounded-full text-sm font-bold">
          🌿 منتج حصري — المغرب 2025
        </div>

        <h1 className="text-2xl lg:text-4xl font-black text-[#111] leading-tight font-cairo">
          باك GreenFlor Zen 🌿
          <span className="block text-[#0B8437] mt-1">زيد الحياة والطاقة لكل زاوية فدارك</span>
        </h1>

        <p className="text-gray-600 text-base lg:text-lg">
          10 plantes d&apos;intérieur soigneusement sélectionnées
        </p>

        {/* Stars */}
        <div className="flex items-center gap-2 justify-end">
          <span className="text-gray-500 text-sm">720 avis</span>
          <span className="font-bold text-[#0B8437]">4.8/5</span>
          <div className="flex text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-4 justify-end">
          <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold text-sm">-34%</span>
          <span className="text-gray-400 line-through text-xl">600 DH</span>
          <span className="text-3xl font-black text-[#0B8437]">395 DH</span>
        </div>

        {/* Trust badges 2x2 */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: '🌍', text: 'توصيل مجاني' },
            { icon: '🕐', text: 'عرض محدود' },
            { icon: '✅', text: 'ضمان 30 يوم' },
            { icon: '🚗', text: '24–48 ساعة' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#F5F9F2] rounded-xl px-3 py-2 justify-end">
              <span className="text-sm font-semibold text-gray-700">{b.text}</span>
              <span className="text-xl">{b.icon}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onOrderClick}
          className="w-full bg-[#0B8437] hover:bg-[#096d2e] text-white font-black text-lg py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-200 animate-pulse-green"
        >
          🛒 اطلب الآن — Paiement à la livraison
        </button>

        <p className="text-center text-gray-500 text-xs">
          دفع عند الاستلام — لا حاجة لبطاقة بنكية
        </p>
      </div>
    </div>
  )
}
