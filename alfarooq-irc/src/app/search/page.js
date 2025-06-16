// app/search/page.js
export const metadata = {
  title: 'Search – Al-Farooq IRC',
  description: 'Find questions & answers in Urdu.',
}

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// dynamically load your client-side Search UI
const SearchClient = dynamic(
  () => import('@/components/layout/AdSearchClient'),
  { suspense: true }    // no more `ssr: false`
)

export default function Page() {
  return (
    <Suspense fallback={<div> </div>}>
      <SearchClient />
    </Suspense>
  )
}
