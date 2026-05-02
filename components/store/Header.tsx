'use client'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onOrderClick: () => void
}

export default function Header({ onOrderClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`bg-white sticky top-8 z-40 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Menu */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-6 h-0.5 bg-gray-700 mb-1.5" />
          <div className="w-6 h-0.5 bg-gray-700 mb-1.5" />
          <div className="w-6 h-0.5 bg-gray-700" />
        </button>

        {/* Logo */}
        <div className="text-center">
          <span className="text-xl font-black text-[#0B8437] font-cairo tracking-tight">
            🌿 GreenFlor Zen
          </span>
        </div>

        {/* Cart */}
        <button
          onClick={onOrderClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
        >
          <svg className="w-6 h-6 text-[#0B8437]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute -top-1 -left-1 bg-[#0B8437] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
            1
          </span>
        </button>
      </div>
    </header>
  )
}
