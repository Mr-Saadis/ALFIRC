// src/app/api/questions/[id]/similarQuestions/route.js
import { NextResponse } from 'next/server'
import { supabase }    from '@/lib/supabase'

export async function GET(req, context) {
  const { params } = context
  const { id }     = params

  try {
    // 1) Find the subcategory of the requested question
    const { data: question, error: fetchErr } = await supabase
      .from('QnA')
      .select('Subcat_ID')
      .eq('Q_ID', id)
      .single()

    if (fetchErr) {
      console.error(`Error fetching Q_ID=${id} subcategory:`, fetchErr)
      return NextResponse.json(
        { error: `Could not find question ${id}` },
        { status: 404 }
      )
    }

    const subcatId = question.Subcat_ID

    // 2) Fetch up to 10 other questions in that same subcategory
    const { data: similar, error: simErr } = await supabase
      .from('QnA')
      .select('Q_ID, Q_Heading, Ans_summary, Published_At, Subcat_ID')
      .eq('Subcat_ID', subcatId)
      .neq('Q_ID', id)                         // exclude the current question
      .order('Published_At', { ascending: false })
      .limit(3)

    if (simErr) {
      console.error(
        `Error fetching similar questions for Subcat_ID=${subcatId}:`,
        simErr
      )
      return NextResponse.json(
        { error: 'Error loading similar questions' },
        { status: 500 }
      )
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
    console.error(`Unexpected error in /questions/${id}/similarQuestions:`, err)
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    )
  }
}
