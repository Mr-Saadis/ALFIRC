// src/app/ask/layout.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const session = useSession()

  // Show loader while auth status is loading
  
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

  if (session === null) return null // Wait for redirect
  return children // User logged-in and role checked
}