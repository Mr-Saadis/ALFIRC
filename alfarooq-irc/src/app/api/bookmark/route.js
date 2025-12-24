// src/app/api/bookmarks/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  // تبدیلی 1: await کا اضافہ
  const cookieStore = await cookies(); 
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
    // نوٹ: cookies.set() بھی اب کچھ ورژنز میں async مانگتا ہے، لیکن فی الحال رسپانس کوکیز ایسے ہی سیٹ ہوتی ہیں
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
  // تبدیلی 2: await کا اضافہ
  const cookieStore = await cookies();
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

  // ایک اضافی سیفٹی چیک: اگر سوال ڈیلیٹ ہو گیا ہو تو ایرر نہ آئے
  const bookmarks = (data || [])
    .filter(row => row.QnA !== null) // اگر QnA null ہے تو اسے لسٹ سے نکال دیں
    .map(row => ({
      q_id: row.QnA.Q_ID,
      q_heading: row.QnA.Q_Heading,
      q_summary: row.QnA.Ans_summary,
      q_detailed: row.QnA.Ans_Detailed,
      published_at: row.QnA.Published_At
    }));

  return NextResponse.json(bookmarks);
}

export async function DELETE(req) {
  // تبدیلی 3: await کا اضافہ
  const cookieStore = await cookies();
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