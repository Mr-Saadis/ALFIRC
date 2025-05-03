import { NextResponse } from 'next/server';
import { supabase }    from '@/lib/supabase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const subcatId = searchParams.get('subcatId');
  const page     = Number(searchParams.get('page') || 1);
  const limit    = Number(searchParams.get('limit') || 10);
  const offset   = (page - 1) * limit;

  let query = supabase
    .from('QnA')
    .select('*')
    .order('Published_At', { ascending: false })
    .range(offset, offset + limit - 1);

  if (subcatId) query = query.eq('Subcat_ID', subcatId);

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const questions = data.map(q => ({
    id:        q.Q_ID,
    title:     q.Q_Heading,
    subcatId:  q.Subcat_ID,
    published: q.Published_At
  }));
  return NextResponse.json(questions);
}
