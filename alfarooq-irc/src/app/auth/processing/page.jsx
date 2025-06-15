// src/app/auth/processing/page.jsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Processing() {
  const router = useRouter()
  useEffect(() => {
    const back = sessionStorage.getItem('postLoginRedirect') || '/'
    sessionStorage.removeItem('postLoginRedirect')
    router.replace(back)
  }, [router])
  return <p className="p-8 text-center">Signing you in…</p>
}
