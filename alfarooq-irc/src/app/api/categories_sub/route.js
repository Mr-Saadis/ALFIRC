// src/app/api/categories_sub/route.js
import { NextResponse } from 'next/server';
import { supabase }    from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const assignFlag = searchParams.get('assign') === 'true'

  const { data, error } = await supabase.rpc('get_nested_qna', {
    assign_flag: assignFlag
  })

  if (error) return NextResponse.json({ error }, { status: 500 })

  // Group by category
  const grouped = {}
  data.forEach(row => {
    if (!grouped[row.category_id]) {
      grouped[row.category_id] = {
        id: row.category_id,
        name: row.category_name,
        answers: 0,
        subcategories: []
      }
    }
    grouped[row.category_id].answers += parseInt(row.answers)
    grouped[row.category_id].subcategories.push({
      id: row.subcategory_id,
      name: row.subcategory_name,
      answers: parseInt(row.answers)
    })
  })

  return NextResponse.json(Object.values(grouped))
}