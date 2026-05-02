'use client'

interface FloatingCTAProps {
  onOrderClick: () => void
  isModalOpen: boolean
}

export default function FloatingCTA({ onOrderClick, isModalOpen }: FloatingCTAProps) {
  if (isModalOpen) return null

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 md:hidden w-[calc(100%-2rem)] max-w-sm">
      <button
        onClick={onOrderClick}
        className="w-full bg-[#0B8437] text-white font-black text-base py-4 rounded-2xl shadow-2xl shadow-green-300 animate-bounce-slow flex items-center justify-center gap-2"
      >
        🛒 <span>اطلب الآن — 395 DH</span>
      </button>
    </div>
  )
}
