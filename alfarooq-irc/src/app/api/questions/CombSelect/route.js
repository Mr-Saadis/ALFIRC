import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const page  = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 5)
  const offset= (page - 1) * limit

  // 1) Get all selected Subcat_IDs
  const { data: selectedSubcats, error: subcatErr } = await supabase
    .from('Subcat_Select')
    .select('Subcat_ID')
  if (subcatErr) return NextResponse.json({ error: subcatErr.message }, { status: 500 })
  const subcatIds = selectedSubcats.map(r => r.Subcat_ID)

  // 2) Fetch QnA by those subcats
  const { data: bySubcat, error: errA } = await supabase
    .from('QnA')
    .select('*')
    .in('Subcat_ID', subcatIds)
  if (errA) return NextResponse.json({ error: errA.message }, { status: 500 })

  // 3) Get all selected Q_IDs
  const { data: selectedQs, error: qErr } = await supabase
    .from('Q_Select')
    .select('Q_ID')
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 })
  const qIds = selectedQs.map(r => r.Q_ID)

  // 4) Fetch QnA by those question IDs
  const { data: byQuestion, error: errB } = await supabase
    .from('QnA')
    .select('*')
    .in('Q_ID', qIds)
  if (errB) return NextResponse.json({ error: errB.message }, { status: 500 })

  // 5) Combine, dedupe, sort
  const map = new Map()
  ;[...byQuestion, ...bySubcat].forEach(q => map.set(q.Q_ID, q))

  const sorted = Array.from(map.values())
  
  // .sort(
  //   (a, b) => new Date(b.Published_At).getTime() - new Date(a.Published_At).getTime()
  // )

  const total = sorted.length
  const pageData = sorted
    .slice(offset, offset + limit)
    .map(q => ({
      id:        q.Q_ID,
      title:     q.Q_Heading,
      summary:   q.Ans_summary,
      published: q.Published_At,
      subcatId:  q.Subcat_ID,
    }))

  return NextResponse.json({
    data:  pageData,
    total,
    page,
    limit,
  })
}
