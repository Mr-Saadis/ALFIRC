// src/app/api/anonymousUser/route.js
import { NextResponse } from 'next/server'
import { cookies }      from 'next/headers'
import { supabase }     from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { createHash }   from 'crypto'

export async function POST(req) {
  // 1) Get or create a session_id via cookie
  const cookieStore  = await cookies()
  const existing     = await cookieStore.get('anon_user_id')
  const session_id   = existing?.value || uuidv4()

  // 2) Parse JSON body
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  // Optional free-form metadata
  const { details } = body

  // 3) Gather headers & compute ip_hash
  const url       = req.nextUrl?.pathname || null
  const referrer  = req.headers.get('referer')    || null
  const user_agent= req.headers.get('user-agent') || null
  const ip        = req.headers.get('x-forwarded-for') || ''
  const ip_hash   = createHash('sha256').update(ip + user_agent).digest('hex')

  // 4) Insert into AnonymousUser
  // const { error } = await supabase
  //   .from('AnonymousUser')
  //   .insert({
  //     session_id,
  //     url,
  //     referrer,
  //     user_agent,
  //     ip_hash,
  //     details: details ?? null
  //   })

  const { error } = await supabase
  .from('AnonymousUser')
  .upsert(
    {
      session_id,
      url,
      referrer,
      user_agent,
      ip_hash,
      details: details ?? null
    },
    { onConflict: 'session_id' }
  );
  
  if (error) {
    console.error('[AnonymousUser][POST] Insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 5) Return success and set cookie if it’s new
  const res = NextResponse.json({ success: true }, { status: 201 })
  if (!existing) {
    res.cookies.set({
      name:     'anon_user_id',
      value:    session_id,
      path:     '/',
      maxAge:   60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      sameSite: 'lax'
    })
  }
  return res
}
