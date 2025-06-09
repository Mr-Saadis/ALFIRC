'use client'

import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'  // your configured client

export default function ProtectedLayout({ children }) {
  const session = useSession()
  const router  = useRouter()

  // still loading = null session, we can show loader:
  if (session === undefined) {
    return <div className="p-8 text-center">Loading…</div>
  }

  // no session? redirect to sign in
  if (!session) {
    router.replace('/signin')
    return null
  }

  // user is authenticated
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  )
}
