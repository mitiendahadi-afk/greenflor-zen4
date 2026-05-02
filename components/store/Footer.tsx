export default function Footer() {
  return (
    <footer className="bg-[#111] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-right">
            <h3 className="text-2xl font-black text-[#8FA955] mb-3 font-cairo">🌿 GreenFlor Zen</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              نباتات داخلية مختارة بعناية لتضيف الحياة لكل زاوية في منزلك.
              <br />Plantes d&apos;intérieur sélectionnées pour illuminer votre espace.
            </p>
            <div className="flex gap-3 mt-4 justify-end">
              <a
                href="https://instagram.com/gree.nflor"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0B8437] text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-[#8FA955] transition-colors"
              >
                Instagram @gree.nflor
              </a>
            </div>
          </div>

          {/* Info */}
          <div className="text-right">
            <h4 className="font-bold text-[#8FA955] mb-3">معلومات</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>توصيل مجاني لجميع مدن المغرب</li>
              <li>الدفع عند الاستلام</li>
              <li>ضمان 30 يوم</li>
              <li>التوصيل خلال 24–48 ساعة</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-right">
            <h4 className="font-bold text-[#8FA955] mb-3">تواصل معنا</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="https://wa.me/212775137626" target="_blank" rel="noopener noreferrer" className="hover:text-[#8FA955] transition-colors">
                  📱 WhatsApp: +212 775 137 626
                </a>
              </li>
              <li>
                <a href="mailto:greenflor7@gmail.com" className="hover:text-[#8FA955] transition-colors">
                  ✉️ greenflor7@gmail.com
                </a>
              </li>
              <li className="text-gray-500">
                📍 Dar Laman Bloc S 438, Casablanca
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">
          <p>© 2025 GreenFlor Zen — جميع الحقوق محفوظة</p>
          <p className="mt-1">Tous droits réservés — Maroc</p>
        </div>
      </div>
    </footer>
  )
}
