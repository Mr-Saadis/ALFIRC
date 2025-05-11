// src/app/api/questions/[id]/route.js
import { NextResponse } from 'next/server';
import { supabase }    from '@/lib/supabase';

export async function GET(req, { params }) {
  // await the params promise
  const { id } = await params;

    const { data, error } = await supabase
    .from('QnA')
    .select(`
      Q_ID,
      Q_Heading,
      Ans_Detailed,
      Published_At,
      Q_User,
      Ans_summary,
      Assign_T,
      Subcategory!left (
        Subcat_ID,
        Subcat_Name,
        Category!left (
          Cat_ID,
          Cat_Name
        )
      )
    `)
    .eq('Q_ID', id)
    .single()

  // 2) Handle errors
  if (error) {
    console.error(`[questions][GET] Supabase error for id=${id}:`, error);
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    );
  }
  if (!data) {
    console.warn(`[questions][GET] No data found for id=${id}`);
    return NextResponse.json(
      { error: `Question ${id} not found` },
      { status: 404 }
    );
  }

  // 3) Shape the payload
  const payload = {
  Q_ID:         data.Q_ID,
  Q_Heading:    data.Q_Heading,
  Ans_Detailed: data.Ans_Detailed,
  Published_At: data.Published_At,
  Q_User:       data.Q_User,
  Ans_Summary:  data.Ans_summary,
  Assign_T:     data.Assign_T,

  // Use ?. and a default of null if missing
  subcatId:    data.Subcategory?.Subcat_ID    ?? null,
  subcatName:  data.Subcategory?.Subcat_Name  ?? null,
  Cat_ID:      data.Subcategory?.Category?.Cat_ID   ?? null,
  Cat_Name:    data.Subcategory?.Category?.Cat_Name ?? null,
};

  return NextResponse.json(payload);
}
