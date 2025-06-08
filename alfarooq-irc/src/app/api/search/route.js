import { NextResponse } from 'next/server';
import { supabase }    from '@/lib/supabase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  console.log('[search]', searchParams.toString());

  const term = (searchParams.get('q') ?? '')
  const page      = Math.max(1, Number(searchParams.get('page')  || 1));
  const limit     = Math.min(50, Number(searchParams.get('limit') || 10));
  const offset    = (page - 1) * limit;

  

  // Short-circuit if empty
  if (!term) {
    return Response.json([], { status: 200 })
  }

  // Call the Supabase RPC function for searching
  const { data, error } = await supabase
    .rpc('search_qna', { search_term: term })  
   
  if (error) {
    console.error('[search]', error);
    return NextResponse.json(
      { error: 'تلاش ناکام ہوئی۔ بعد میں کوشش کریں۔' },
      { status: 500 }
    );
  }

  // If your RPC returns total count, use it; otherwise, fallback to data.length
  const total = Array.isArray(data) && data.length > 0 && data[0].total_count !== undefined
    ? data[0].total_count
    : (data?.length || 0);

  // Shape the payload for frontend
  const rows = (data || []).map((r) => ({
    id:        r.Q_ID,
    title:     r.Q_Heading,
    summary:   r.Ans_summary,
    published: r.Published_At,
    Assign_T:  r.Assign_T,
  }));

  return NextResponse.json({
    data: rows,
    total,
  });
}