import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const subcatId = searchParams.get('subcatId');
  const page     = Number(searchParams.get('page') || 1);
  const limit    = Number(searchParams.get('limit') || 5);
  const offset   = (page - 1) * limit;
  

  // Base query with optional filtering
  let query = supabase
    .from('QnA')
    .select('Q_ID, Q_Heading, Ans_summary, Published_At, Subcat_ID, Assign_T', { count: 'exact' })
    .order('Published_At', { ascending: false });

  if (subcatId) {
    
    query = query.eq('Subcat_ID', subcatId);
  }

  // Clone the query for counting before range limiting
  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Format result
  const questions = data.map((q) => ({
    id: q.Q_ID,
    title: q.Q_Heading,
    summary: q.Ans_summary,
    subcatId: q.Subcat_ID,
    published: q.Published_At,
    Assign_T: q.Assign_T,
  }));

  return NextResponse.json({
    data: questions,
    total: count, // total records in full result set
    page,
    limit,
  });
}
