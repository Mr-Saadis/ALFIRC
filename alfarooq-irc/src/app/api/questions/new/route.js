// src/app/api/questions/new/route.js
import { NextResponse }     from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies as nextCookies, headers as nextHeaders } from 'next/headers'

export async function POST (req) {
  /* -------------- 1. Build a cookie-aware Supabase client -------------- */
  const cookieStore = nextCookies()          // <-- get the store, not the fn

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get   : name            => cookieStore.get(name)?.value,
        set   : (name, value, opts = {}) =>
                 cookieStore.set({ name, value, ...opts }),
        remove: (name, opts = {}) =>
                 cookieStore.delete(name, opts),
      },
      headers: nextHeaders(),               // <-- call the fn here as well
    },
  )

  /* -------------- 2. Auth guard --------------------------------------- */
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json({ error: 'unauth' }, { status: 401 })

  /* -------------- 3. Parse request body ------------------------------- */
  const { body, urgency = 'normal', anonymous = false } = await req.json()
  if (!body?.trim())
    return NextResponse.json({ error: 'content-required' }, { status: 400 })

  /* -------------- 4. Insert row --------------------------------------- */
  const { error } = await supabase
    .from('UserQuestions')
    .insert({
      user_id : user.id,
      body    : body.trim(),
      urgency,
      anonymous,
    })

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 })

  /* -------------- 5. Success response --------------------------------- */
  return NextResponse.json({ success: true })
}
