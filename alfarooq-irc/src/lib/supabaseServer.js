import { createServerClient } from '@supabase/auth-helpers-nextjs'



export function supabaseAdmin({ req, res }) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { req, res }
  )
}
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'

export function supabaseServer() {
  return createServerComponentClient(
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    {
      cookies,  // so it can read `supabase-auth-token` from the request
      headers,  // (optional) for SSR if you need headers
    }
  )
}
