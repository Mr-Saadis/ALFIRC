// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const subcatId = searchParams.get('subcatId');
//   const page     = Number(searchParams.get('page') || 1);
//   const limit    = Number(searchParams.get('limit') || 5);
//   const offset   = (page - 1) * limit;
    

//   let query = supabase
//     .from('QnA')
//     .select('Q_ID, Q_Heading, Ans_summary, Published_At, Subcat_ID')
//     .order('Published_At', { ascending: false })
//     .range(offset, offset + limit - 1);

//   if (subcatId) {
//     query = query.eq('Subcat_ID', subcatId);
//   }

//   const { data, error } = await query;

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   const questions = data.map((q) => ({
//     id: q.Q_ID,
//     title: q.Q_Heading,
//     summary: q.Ans_summary,
//     subcatId: q.Subcat_ID,
//     published: q.Published_At,
//   }));

//   return NextResponse.json(questions);
// }



// src/app/api/questions/route.js
import { NextResponse }   from 'next/server';
import { supabase } from '@/lib/supabase';  // service_role client

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page  = Number(searchParams.get('page')  || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const offset = (page - 1) * limit;

    let query = supabase
      .from('QnA')
      .select(
        `
        Q_ID,
        Q_Heading,
        Ans_summary,
        Published_At,
        Subcat_ID,
        Assign_T
      `,
        { count: 'exact' }
      )
      .order('Published_At', { ascending: false })
      .range(offset, offset + limit - 1);

    // optional filters
    const assign = searchParams.get('assignT');
    if (assign === 'true')  query = query.eq('Assign_T', true);
    if (assign === 'false') query = query.eq('Assign_T', false);

    const catId = searchParams.get('catID');
    if (catId) query = query.eq('Cat_ID', Number(catId));

    const subcat = searchParams.get('subcatID');
    if (subcat) query = query.eq('Subcat_ID', Number(subcat));

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // shape results
    const questions = data.map((q) => ({
      id:        q.Q_ID,
      title:     q.Q_Heading,
      summary:   q.Ans_summary,
      published: q.Published_At,
      subcatId:  q.Subcat_ID,
      assignT:   q.Assign_T,
    }));

    return NextResponse.json(
      { data: questions, total: count },
      { status: 200 }
    );
  } catch (err) {
    console.error('[questions][GET] error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    // expected shape: { heading, summary, detailed, subcatId, assignT, user }
    const {
      heading,
      summary,
      detailed,
      subcatId,
      assignT,
      user
    } = body;

    // insert new row
    const { data, error } = await supabase
      .from('QnA')
      .insert({
        Q_Heading:   heading,
        Ans_summary: summary,
        Ans_Detailed: detailed,
        Subcat_ID:   subcatId,
        Assign_T:    assignT,
        Q_User:      user,
        Published_At: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: 'Created', question: data },
      { status: 201 }
    );
  } catch (err) {
    console.error('[questions][POST] error:', err);
    return NextResponse.json(
      { error: err.message || 'Creation failed' },
      { status: 500 }
    );
  }
}
