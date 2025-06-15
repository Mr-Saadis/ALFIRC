// src/app/auth/callback/page.jsx
'use client'

import { useEffect }     from 'react'
import { useRouter }     from 'next/navigation'
import { supabase }      from '@/lib/supabase'

export default function OAuthCallback() {
  const router = useRouter()

  useEffect(() => {
    async function handleAuthCallback() {
      // 1) Get the current Supabase authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Error fetching user:', userError)
      }
      const userId = user?.id
      if (userId) {
        // 2) Upsert into your new AuthenticatedUsers table.
        //    Make sure your table has columns: user_id (primary/unique key)
        const { error: upsertError } = await supabase
          .from('AuthenticatedUsers')
          .upsert(
            { user_id: userId },
            { onConflict: ['user_id'] }
          )

        if (upsertError) {
          console.error('Error upserting AuthenticatedUsers:', upsertError)
        } else {
          console.log('Authenticated user record upserted for:', userId)
        }
      }

      // 3) Finally redirect back (or to home if none saved)
      const postLogin = sessionStorage.getItem('postLoginRedirect') || '/'
      router.replace(postLogin)
    }

    handleAuthCallback()
  }, [router])

  return <div className="p-8 text-center">Signing you in…</div>
}
