// src/app/api/questions/[id]/similarQuestions/route.js
import { NextResponse } from 'next/server'
import { supabase }     from '@/lib/supabase'

export async function GET(req, context) {
  const { params } = context
  const { id }     = await params

  try {
    // 1) Find the subcategory of the requested question
    const { data: question, error: fetchErr } = await supabase
      .from('QnA')
      .select('Subcat_ID')
      .eq('Q_ID', id)
      .single()

    if (fetchErr) {
      return NextResponse.json({ error: `Could not find question ${id}` }, { status: 404 })
    }

    const subcatId = question.Subcat_ID

    // 2) Fetch RANDOM questions from the SAME subcategory
    // We use the 'get_random_qna' function you created in the DB
    // We generate a random seed here so every refresh gives different results
    const seed = Math.random().toString(36).substring(7);

    const { data: similar, error: simErr } = await supabase
      .rpc('get_random_qna', { 
        seed: seed, 
        subcat_id_filter: subcatId 
      })
      .neq('Q_ID', id) // Exclude the current question we are reading
      .limit(3)        // Only get 3

    if (simErr) {
      console.error(`Error fetching random similar questions:`, simErr)
      return NextResponse.json({ error: 'Error loading similar questions' }, { status: 500 })
    }

    // 3) Shape the response
    const results = similar.map((q) => ({
      id:        q.Q_ID,
      title:     q.Q_Heading,
      summary:   q.Ans_summary,
      published: q.Published_At,
      subcatId:  q.Subcat_ID,
    }))

    return NextResponse.json({ similar: results })
  } catch (err) {
    console.error(`Unexpected error:`, err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}