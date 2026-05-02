'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const PLANTS = [
  { name: 'كلوروفيتوم', nameFr: 'Chlorophytum', emoji: '🌿', desc: 'نبتة هواء نقي' },
  { name: 'فوجير', nameFr: 'Fougère', emoji: '🌱', desc: 'تنقية الهواء والجمال' },
  { name: 'بوليغونوم', nameFr: 'Polygonum Odoratum', emoji: '🪴', desc: 'عطرية ومميزة' },
  { name: 'بورتولاكاريا', nameFr: 'Portulacaria Afra', emoji: '🌵', desc: 'سهلة العناية' },
  { name: 'أسباراجوس', nameFr: 'Asparagus Densiflorus', emoji: '🌾', desc: 'خضراء طوال السنة' },
  { name: 'سينغونيوم', nameFr: 'Syngonium', emoji: '🍃', desc: 'ديكور راقي' },
  { name: 'بوثوس دوريه', nameFr: 'Pothos Doré', emoji: '💚', desc: 'مقاومة ومتسلقة' },
  { name: 'كالانتشو', nameFr: 'Kalanchoe Blossfeldiana', emoji: '🌸', desc: 'ألوان زاهية' },
  { name: 'كوبريسوس', nameFr: 'Cupresus Maraopa', emoji: '🌲', desc: 'شجرة مزخرفة' },
]

interface PlantsSliderProps {
  images?: Record<string, string>
}

export default function PlantsSlider({ images = {} }: PlantsSliderProps) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  const startX = useRef(0)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const slidesToShow = isMobile ? 1 : 3
  const maxIndex = PLANTS.length - slidesToShow

  const next = () => setCurrent(c => Math.min(c + 1, maxIndex))
  const prev = () => setCurrent(c => Math.max(c - 1, 0))

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c >= maxIndex ? 0 : c + 1))
    }, 3500)
    return () => clearInterval(timerRef.current)
  }, [maxIndex])

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c >= maxIndex ? 0 : c + 1))
    }, 3500)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev()
      resetTimer()
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 gap-4"
        style={{ transform: `translateX(${current * (100 / PLANTS.length)}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {PLANTS.map((plant, i) => {
          const imgKey = `plant_${i + 1}`
          const imgSrc = images[imgKey]
          return (
            <div
              key={i}
              className="flex-shrink-0 w-[85%] md:w-[calc(33.333%-12px)] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[9/16] relative bg-gradient-to-b from-[#F5F9F2] to-[#e8f5e9] flex items-center justify-center">
                {imgSrc ? (
                  <Image src={imgSrc} alt={plant.name} fill className="object-cover" />
                ) : (
                  <span className="text-8xl">{plant.emoji}</span>
                )}
              </div>
              <div className="p-4 text-right">
                <h3 className="font-black text-lg text-[#111] font-cairo">{plant.name}</h3>
                <p className="text-[#0B8437] text-sm font-semibold">{plant.nameFr}</p>
                <p className="text-gray-500 text-sm mt-1">{plant.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      <button
        onClick={() => { prev(); resetTimer() }}
        disabled={current === 0}
        className="absolute right-2 top-1/3 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all disabled:opacity-30 text-xl font-bold"
      >
        ›
      </button>
      <button
        onClick={() => { next(); resetTimer() }}
        disabled={current >= maxIndex}
        className="absolute left-2 top-1/3 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all disabled:opacity-30 text-xl font-bold"
      >
        ‹
      </button>

      {/* Counter & Dots */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <span className="text-gray-500 text-sm font-cairo">{current + 1} / {PLANTS.length}</span>
        <div className="flex gap-1.5">
          {PLANTS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); resetTimer() }}
              className={`rounded-full transition-all ${i === current ? 'w-5 h-2 bg-[#0B8437]' : 'w-2 h-2 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
