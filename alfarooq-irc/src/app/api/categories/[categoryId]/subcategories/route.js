import { NextResponse } from 'next/server';
import { supabase }    from '@/lib/supabase';

export async function GET(req, { params }) {
  const { categoryId } = params;

  // Fetch Subcategory rows where Cat_ID = categoryId
  const { data, error } = await supabase
    .from('Subcategory')
    .select('Subcat_ID, Subcat_Name')
    .eq('Cat_ID', categoryId)
    .order('Subcat_Name', { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const subcats = data.map(s => ({ id: s.Subcat_ID, name: s.Subcat_Name }));
  return NextResponse.json(subcats);
}
