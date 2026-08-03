// app/page.js   ← this stays a Server Component
export const metadata = {
  metadataBase: new URL('https://alfarooq-irc.com'),
  title: {
    default: 'Al-Farooq IRC | Islamic Research Center - سوالات اور جوابات',
    template: '%s | Al-Farooq IRC'
  },
  description: 'Al-Farooq Islamic Research Center provides a platform for asking questions and finding answers in Urdu and Roman Urdu. الفاروق اسلامک ریسرچ سینٹر - مستند اسلامی سوالات اور جوابات۔',
  keywords: ['Islamic Q&A', 'Urdu Islamic Fatwa', 'Roman Urdu Fatwa', 'Al-Farooq IRC', 'اسلامی سوالات', 'جوابات', 'فتاویٰ', 'Quran and Sunnah'],
  authors: [{ name: 'Al-Farooq Islamic Research Center' }],
  openGraph: {
    type: 'website',
    locale: 'ur_PK',
    alternateLocale: 'en_US',
    url: 'https://alfarooq-irc.com',
    title: 'Al-Farooq IRC | Islamic Research Center - سوالات اور جوابات',
    description: 'Al-Farooq Islamic Research Center provides a platform for asking questions and finding answers in Urdu and Roman Urdu.',
    siteName: 'Al-Farooq IRC',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Al-Farooq IRC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Farooq IRC | Islamic Research Center',
    description: 'A platform for asking questions and finding answers in Urdu and Roman Urdu.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { FiLoader } from 'react-icons/fi'

// Dynamically pull in the heavy client code
const HomePageClient = dynamic(
  () => import('@/components/layout/HomePageClient'),
  {           // only render on client
    suspense: true        // allow us to wrap it in <Suspense>
  }
)

export default function Page() {
  return (
    <Suspense fallback={<div> <FiLoader/> </div>}>
      <HomePageClient />
    </Suspense>
  )
}
