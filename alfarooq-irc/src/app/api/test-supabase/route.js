import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return new Response(JSON.stringify({ connected: false, error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ connected: true, message: "Supabase connected successfully!" }), {
    status: 200,
  });
}
