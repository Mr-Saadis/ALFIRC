// src/app/api/views/route.js
import { NextResponse } from 'next/server'
import { cookies }      from 'next/headers'
import { supabase }     from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
  // 1) Resolve or create the anon_user_id cookie
  const cookieStore  = cookies()
  const existing     = cookieStore.get('anon_user_id')
  const session_id   = existing?.value || uuidv4()

  // 2) Parse JSON body
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }
  const { questionId } = body
  if (!questionId) {
    return NextResponse.json(
      { error: '`questionId` is required' },
      { status: 400 }
    )
  }

  // 3) Insert into Views (user_id = our anon session, q_id = QnA ID)
  const { error } = await supabase
    .from('Bookmark')
    .upsert({
      session_id: session_id,
      Q_ID:    questionId,
      // viewed_at will default to NOW() if you set that in your schema
    },
    { onConflict: ['session_id','Q_ID'] }

)

  if (error) {
    console.error('[Views][POST] insert error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  // 4) Build response and set cookie if it was newly generated
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
