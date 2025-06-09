import { supabase }    from '@/lib/supabase';

export async function fetchSearchResults({ q, category, subcategory }) {
  const { data, error } = await supabase.rpc('search_qna_advanced', {
    search_term: q || '',
    category_arr: category || [],
    subcategory_arr: subcategory || []
  })

  if (error) {
    console.error('❌ Supabase search RPC error:', error)
    return []
  }

  return data
}
