// src/app/api/search/route.js
import { NextResponse } from 'next/server';
import { supabase }    from '@/lib/supabase';

/**
 * GET /api/search?q=keyword&page=1&limit=10&assign=true|false
 *
 * Response:
 * {
 *   data:  [{ id, title, summary, published, Assign_T }],
 *   total: 128
 * }
 */
export async function GET(req) {
  /* ───── Parse query-string params ─────────────────────────────── */
  const { searchParams } = new URL(req.url);

  const q         = (searchParams.get('q') || '').trim();   // search text
  const page      = Math.max(1, Number(searchParams.get('page')  || 1));
  const limit     = Math.min(50, Number(searchParams.get('limit') || 10)); // hard-cap
  const assignStr = searchParams.get('assign');             // optional true / false
  const offset    = (page - 1) * limit;

  /* return early if no search term */
  if (!q) return NextResponse.json({ data: [], total: 0 });

  /* ───── Build Supabase / Postgres query ───────────────────────── */
  let query = supabase
    .from('QnA')
    .select(
      'Q_ID, Q_Heading, Ans_summary, Published_At, Assign_T',
      { count: 'exact' }               // to get total rows
    )
    /* `search_vector` = tsvector column you created earlier */
    .textSearch('search_vector', q, { type: 'websearch' })
    .order('Published_At', { ascending: false })
    .range(offset, offset + limit - 1);

  /* optional filter on Assign_T (true / false) */
  if (assignStr === 'true')  query = query.eq('Assign_T', true);
  if (assignStr === 'false') query = query.eq('Assign_T', false);

  /* ───── Execute ──────────────────────────────────────────────── */
  const { data, count, error } = await query;

  if (error) {
    console.error('[search]', error);
    return NextResponse.json(
      { error: 'تلاش ناکام ہوئی۔ بعد میں کوشش کریں۔' },
      { status: 500 }
    );
  }

  /* shape the payload for frontend */
  const rows = data.map((r) => ({
    id:        r.Q_ID,
    title:     r.Q_Heading,
    summary:   r.Ans_summary,
    published: r.Published_At,
    Assign_T:  r.Assign_T,
  }));

  return NextResponse.json({
    data: rows,
    total: count ?? rows.length,
  });
}
