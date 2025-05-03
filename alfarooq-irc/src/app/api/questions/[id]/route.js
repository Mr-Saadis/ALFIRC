import { NextResponse } from 'next/server';
import { supabase }    from '@/lib/supabase';

export async function GET(req, { params }) {
  const { id } = params;

  // Join QnA → Subcategory → Category
  const { data, error } = await supabase
    .from('QnA')
    .select(`
      Q_ID,
      Q_Heading,
      Ans_Detailed,
      Published_At,
      Subcategory(
        Subcat_ID,
        Subcat_Name,
        Category(
          Cat_ID,
          Cat_Name
        )
      )
    `)
    .eq('Q_ID', id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });

  return NextResponse.json({
    id:        data.Q_ID,
    title:     data.Q_Heading,
    content:   data.Ans_Detailed,
    published: data.Published_At,
    subcategory: {
      id:   data.Subcategory.Subcat_ID,
      name: data.Subcategory.Subcat_Name
    },
    category: {
      id:   data.Subcategory.Category.Cat_ID,
      name: data.Subcategory.Category.Cat_Name
    }
  });
}
