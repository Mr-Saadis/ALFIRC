import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  // 1) Grab all Subcat_IDs that the user has selected
  const { data: selectedSubcats, error: subcatError } = await supabase
    .from('Subcat_Select')
    .select('Subcat_ID')

  if (subcatError) {
    return NextResponse.json({ error: subcatError.message }, { status: 500 })
  }

  const subcatIds = selectedSubcats.map((row) => row.Subcat_ID)

  // 2) Fetch all QnA rows whose Subcat_ID is in the selected list
  const { data: bySubcat, error: errorA } = await supabase
    .from('QnA')
    .select('*')
    .in('Subcat_ID', subcatIds)

  if (errorA) {
    return NextResponse.json({ error: errorA.message }, { status: 500 })
  }

  // 3) Grab all Q_IDs that the user has selected
  const { data: selectedQs, error: qError } = await supabase
    .from('Q_Select')
    .select('Q_ID')

  if (qError) {
    return NextResponse.json({ error: qError.message }, { status: 500 })
  }

  const qIds = selectedQs.map((row) => row.Q_ID)

  // 4) Fetch all QnA rows whose Q_ID is in that list
  const { data: byQuestion, error: errorB } = await supabase
    .from('QnA')
    .select('*')
    .in('Q_ID', qIds)

  if (errorB) {
    return NextResponse.json({ error: errorB.message }, { status: 500 })
  }

  // 5) De-duplicate, sort by publish date, and map to your payload shape
  const combinedMap = new Map()
  ;[...(byQuestion || []), ...(bySubcat || [])].forEach((q) => {
    combinedMap.set(q.Q_ID, q)
  })

  const combined = Array.from(combinedMap.values())
    // .sort(
    //   (a, b) =>
    //     new Date(b.Published_At).getTime() - new Date(a.Published_At).getTime()
    // )
    .map((q) => ({
      id:        q.Q_ID,
      title:     q.Q_Heading,
      summary:   q.Ans_summary,
      published: q.Published_At,
      subcatId:  q.Subcat_ID,
    }))

  return NextResponse.json(combined)
}
