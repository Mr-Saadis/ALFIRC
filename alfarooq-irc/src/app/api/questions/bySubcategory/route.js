import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const catId = searchParams.get('catId');
    const subcatId = searchParams.get('subcatId');
    const assignT = searchParams.get('assign');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('QnA')
      .select(`
        Q_ID,
        Q_Heading,
        Ans_summary,
        Published_At,
        Assign_T
      `, { count: 'exact' }) // pagination کے لیے کل count بھی لیں
      .eq('Assign_T', assignT === 'true') // Assign_T کو boolean میں تبدیل کریں
      .order('Published_At', { ascending: false })
      .range(from, to);

    if (subcatId) {
      query = query.eq('Subcat_ID', subcatId);
    } else if (catId) {
      // اگر سب کیٹگری نہیں ہے تو کیٹگری کی بنیاد پر فلٹر کریں
      // Subcategory سے تمام Subcat_ID لیں جو اس Cat_ID کے تحت ہیں
      const { data: subcats, error: subcatError } = await supabase
        .from('Subcategory')
        .select('Subcat_ID')
        .eq('Cat_ID', catId);

      if (subcatError) {
        return NextResponse.json({ error: subcatError.message }, { status: 500 });
      }

      const subcatIds = subcats.map(s => s.Subcat_ID);

      query = query.in('Subcat_ID', subcatIds);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ڈیٹا کو فرنٹ اینڈ کی ضرورت کے مطابق تبدیل کریں
    const questions = data.map(q => ({
      id: q.Q_ID,
      title: q.Q_Heading,
      summary: q.Ans_summary,
      published: q.Published_At,
      Assign_T: q.Assign_T,
    }));

    return NextResponse.json({ data: questions, total: count });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
