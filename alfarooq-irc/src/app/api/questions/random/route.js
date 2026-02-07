import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const subcatId = searchParams.get('subcatId');
  const page     = Number(searchParams.get('page') || 1);
  const limit    = Number(searchParams.get('limit') || 5);
  // Use a provided seed, or default to a static string
  const seed     = searchParams.get('seed') || 'default_seed'; 
  
  const offset   = (page - 1) * limit;

  // We use RPC to call our custom postgres function
  const { data, error, count } = await supabase
    .rpc('get_random_qna', { 
      seed: seed, 
      subcat_id_filter: subcatId ? parseInt(subcatId) : null 
    }, { count: 'exact' })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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
    total: count,
    page,
    limit,
    seed, // Return the seed so the frontend can keep using it for pagination
  });
}