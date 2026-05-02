import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GreenFlor Zen 🌿 — باك النباتات الحصري',
  description: 'باك GreenFlor Zen — 10 نباتات داخلية مختارة بعناية. توصيل مجاني لجميع مدن المغرب. دفع عند الاستلام.',
  keywords: 'نباتات, داخلية, المغرب, greenflor, zen, plantes, intérieur',
  openGraph: {
    title: 'GreenFlor Zen 🌿 — باك النباتات الحصري',
    description: '10 نباتات داخلية مختارة بعناية — 395 DH فقط — توصيل مجاني',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cairo" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
