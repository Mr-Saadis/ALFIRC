// src/app/api/bookmarks/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  const cookieStore = cookies();
  const existing = cookieStore.get('anon_user_id');
  const session_id = existing?.value || uuidv4();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { questionId } = body;
  if (!questionId) {
    return NextResponse.json(
      { error: '`questionId` is required' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('Bookmark')
    .upsert(
      {
        session_id: session_id,
        Q_ID: questionId
      },
      { onConflict: ['session_id', 'Q_ID'] }
    );

  if (error) {
    console.error('[Bookmarks][POST] insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const res = NextResponse.json({ success: true }, { status: 201 });
  if (!existing) {
    res.cookies.set({
      name: 'anon_user_id',
      value: session_id,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax'
    });
  }

  return res;
}

export async function GET() {
  const cookieStore = cookies();
  const existing = cookieStore.get('anon_user_id');
  const session_id = existing?.value;

  if (!session_id) {
    return NextResponse.json([], { status: 200 });
  }

  const { data, error } = await supabase
    .from('Bookmark')
    .select(`
      QnA:Q_ID (
        Q_ID,
        Q_Heading,
        Ans_summary,
        Ans_Detailed,
        Published_At
      )
    `)
    .eq('session_id', session_id);

  if (error) {
    console.error('[Bookmarks][GET] fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const bookmarks = (data || []).map(row => ({
    q_id: row.QnA.Q_ID,
    q_heading: row.QnA.Q_Heading,
    q_summary: row.QnA.Ans_summary,
    q_detailed: row.QnA.Ans_Detailed,
    published_at: row.QnA.Published_At
  }));

  return NextResponse.json(bookmarks);
}

export async function DELETE(req) {
  const cookieStore = cookies();
  const existing = cookieStore.get('anon_user_id');
  const session_id = existing?.value;

  if (!session_id) {
    return NextResponse.json(
      { error: 'Unauthorized or missing session.' },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { questionId } = body;
  if (!questionId) {
    return NextResponse.json(
      { error: '`questionId` is required' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('Bookmark')
    .delete()
    .match({ session_id: session_id, Q_ID: questionId });

  if (error) {
    console.error('[Bookmarks][DELETE] delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
