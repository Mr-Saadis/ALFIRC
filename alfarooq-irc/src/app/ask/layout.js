// src/app/ask/layout.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'

export default function AskLayout({ children }) {
  const router   = useRouter()
  const session  = useSession()

  // show loader while auth status is loading
  
  // once we know there is **no** session → push to /signin only once
  useEffect(() => {

    if (session === undefined) {
      // still loading, do nothing
      return;
    }

    if (session === null) {
      const target = encodeURIComponent('/ask')
      router.replace(`/signin?redirectTo=${target}`)
    }
  }, [session, router])


  if (session === undefined)
    return <div className="p-8 text-center">Loading…</div>
  
  if (session === null) return null            // wait for redirect
  return children                              // user logged-in
}
