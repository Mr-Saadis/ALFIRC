// app/signin/page.js   ← **no** 'use client' here
export const metadata = {
  title: 'Sign In – Al-Farooq IRC',
  // …any other static metadata…
}

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// only this bit hydrated on the client
const SignInClient = dynamic(
  () => import('@/components/auth/SignInClient'),
  { suspense: true }
)

export default function Page() {
  return (
    <Suspense fallback={<div> </div>}>
      <SignInClient />
    </Suspense>
  )
}
