// src/app/signin/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabase'
import { FcGoogle } from 'react-icons/fc'


export default function SignInPage() {
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get('redirectTo') || '/'   // default home
  const session      = useSession()
  const router       = useRouter()

  // once the user is signed-in, go back to the intended page
  useEffect(() => {
    if (session) router.replace(redirectTo)
  }, [session, redirectTo, router])

  async function handleGoogleSignIn () {
    // keep redirect target across the OAuth round-trip
    sessionStorage.setItem('postLoginRedirect', redirectTo)

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options : { redirectTo: `${window.location.origin}/auth/callback` }})
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      {/* …logo & title… */}
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center gap-3 px-4 py-2 rounded-lg border"
      >
        <FcGoogle className="text-2xl" />
        Sign in with Google
      </button>
    </div>
  )
}
