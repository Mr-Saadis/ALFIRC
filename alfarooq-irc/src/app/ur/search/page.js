// no 'use client' here
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// dynamically pull in the search-UI bundle
const SearchClient = dynamic(
  () => import('@/components/layout/SearchClient'),
  { suspense: true }
)

export default function SearchPage() {
  return (
    <Suspense fallback={<div> </div>}>
      <SearchClient />
    </Suspense>
  )
}
