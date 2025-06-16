// app/categories/page.js  ← **Server Component**
export const metadata = { /* …optional meta… */ }

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// dynamically load the client-only code
const CategoriesClient = dynamic(
  () => import('@/components/layout/CategoriesClient'),
  { suspense: true }
)

export default function Page() {
  return (
    <Suspense fallback={<div> </div>}>
      <CategoriesClient />
    </Suspense>
  )
}
