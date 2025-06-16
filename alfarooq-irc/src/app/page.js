// app/page.js   ← this stays a Server Component
export const metadata = {
  title:       'Al-Farooq IRC – سوالات اور جوابات',
  description: 'Al-Farooq Islamic Research Center provides a platform for asking questions and finding answers in Urdu.',
  openGraph: {
    title:       'Al-Farooq IRC – سوالات اور جوابات',
    description: '…same as above…',
    url:         'https://alfarooq-irc.com',
    images:      ['https://example.com/og-image.png'],
    siteName:    'Al-Farooq IRC',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Al-Farooq IRC – سوالات اور جوابات',
    description: '…',
    images:      ['https://example.com/twitter-image.png'],
    site:        '@alfarooq_irc',
    creator:     '@alfarooq_irc',
  },
}

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
