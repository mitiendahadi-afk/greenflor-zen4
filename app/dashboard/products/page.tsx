'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase'

const IMAGE_SLOTS = [
  { key: 'hero_1', label: 'هيرو 1', aspect: '1:1' },
  { key: 'hero_2', label: 'هيرو 2', aspect: '1:1' },
  { key: 'hero_3', label: 'هيرو 3', aspect: '1:1' },
  { key: 'hero_4', label: 'هيرو 4', aspect: '1:1' },
  { key: 'hero_5', label: 'هيرو 5', aspect: '1:1' },
  { key: 'hero_6', label: 'هيرو 6', aspect: '1:1' },
  { key: 'plant_1', label: 'كلوروفيتوم', aspect: '9:16' },
  { key: 'plant_2', label: 'فوجير', aspect: '9:16' },
  { key: 'plant_3', label: 'بوليغونوم', aspect: '9:16' },
  { key: 'plant_4', label: 'بورتولاكاريا', aspect: '9:16' },
  { key: 'plant_5', label: 'أسباراجوس', aspect: '9:16' },
  { key: 'plant_6', label: 'سينغونيوم', aspect: '9:16' },
  { key: 'plant_7', label: 'بوثوس دوريه', aspect: '9:16' },
  { key: 'plant_8', label: 'كالانتشو', aspect: '9:16' },
  { key: 'plant_9', label: 'كوبريسوس', aspect: '9:16' },
  { key: 'rachid', label: 'صورة رشيد', aspect: '1:1' },
]

export default function ProductsPage() {
  const [images, setImages] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadImages() {
      const client = getSupabase()
      const { data } = await client
        .from('store_settings')
        .select('key, value')
        .in('key', IMAGE_SLOTS.map(s => `img_${s.key}`))

      const map: Record<string, string> = {}
      ;(data || []).forEach(s => { map[s.key.replace('img_', '')] = s.value })
      setImages(map)
    }
    loadImages()
  }, [])

  const handleUpload = async (key: string, file: File) => {
    setUploading(key)
    try {
      const client = getSupabase()
      const ext = file.name.split('.').pop()
      const path = `images/${key}-${Date.now()}.${ext}`

      const { error: uploadError } = await client.storage
        .from('greenflor-assets')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = client.storage
        .from('greenflor-assets')
        .getPublicUrl(path)

      const publicUrl = urlData.publicUrl

      await client.from('store_settings').upsert({
        key: `img_${key}`,
        value: publicUrl,
      }, { onConflict: 'key' })

      setImages(prev => ({ ...prev, [key]: publicUrl }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Upload error:', err)
      alert('خطأ في رفع الصورة')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="p-4 lg:p-8 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-[#111] font-cairo">إدارة الصور 🌿</h1>
        <p className="text-gray-500 text-sm">رفع وتحديث صور المتجر</p>
      </div>

      {saved && (
        <div className="bg-[#e8f5e9] border border-[#0B8437] text-[#0B8437] rounded-xl p-3 text-right font-bold text-sm">
          ✅ تم حفظ الصورة بنجاح
        </div>
      )}

      {/* Hero Images */}
      <div>
        <h2 className="text-lg font-black text-[#111] mb-3 font-cairo">🖼 صور الهيرو (1:1)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {IMAGE_SLOTS.filter(s => s.key.startsWith('hero')).map(slot => (
            <ImageSlot
              key={slot.key}
              slot={slot}
              url={images[slot.key]}
              uploading={uploading === slot.key}
              onUpload={handleUpload}
            />
          ))}
        </div>
      </div>

      {/* Plant Images */}
      <div>
        <h2 className="text-lg font-black text-[#111] mb-3 font-cairo">🌱 صور النباتات (9:16)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {IMAGE_SLOTS.filter(s => s.key.startsWith('plant')).map(slot => (
            <ImageSlot
              key={slot.key}
              slot={slot}
              url={images[slot.key]}
              uploading={uploading === slot.key}
              onUpload={handleUpload}
            />
          ))}
        </div>
      </div>

      {/* Rachid Image */}
      <div>
        <h2 className="text-lg font-black text-[#111] mb-3 font-cairo">👨‍🌾 صورة رشيد</h2>
        <div className="w-48">
          <ImageSlot
            slot={IMAGE_SLOTS.find(s => s.key === 'rachid')!}
            url={images['rachid']}
            uploading={uploading === 'rachid'}
            onUpload={handleUpload}
          />
        </div>
      </div>
    </div>
  )
}

function ImageSlot({
  slot,
  url,
  uploading,
  onUpload,
}: {
  slot: { key: string; label: string; aspect: string }
  url?: string
  uploading: boolean
  onUpload: (key: string, file: File) => void
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-600 text-right block">{slot.label}</label>
      <label className="block cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) onUpload(slot.key, file)
          }}
        />
        <div
          className={`relative rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-all hover:border-[#0B8437] ${
            url ? 'border-[#8FA955]' : 'border-gray-300'
          } ${slot.aspect === '9:16' ? 'aspect-[9/16]' : 'aspect-square'}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 border-2 border-[#0B8437] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-gray-500">جاري الرفع...</span>
            </div>
          ) : url ? (
            <>
              <Image src={url} alt={slot.label} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">تغيير</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <span className="text-2xl">📷</span>
              <span className="text-xs">رفع صورة</span>
            </div>
          )}
        </div>
      </label>
    </div>
  )
}
