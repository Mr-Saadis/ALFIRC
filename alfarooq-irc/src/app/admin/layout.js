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
      const target = encodeURIComponent('/admin')
      router.replace(`/signin?redirectTo=${target}`)
    } else {
      // Fetch user role from AuthenticatedUsers table
      const checkUserRole = async () => {
        const userId = session.user.id
        const { data, error } = await supabase
        .from('AuthenticatedUsers')
        .select('Role')
        .eq('user_id', userId)
        .single()
        
        if (error || !data || data.Role !== 'Admin') {
          console.log('Access denied:', error || 'User not found or not an admin')
          router.replace('/')
        }
      }
      checkUserRole()
    }
  }, [session, router])
 
 
  if (session === undefined)
    return <div className="p-8 text-center">Loading…</div>

  if (session === null) return null // Wait for redirect
  return children // User logged-in and role checked
}