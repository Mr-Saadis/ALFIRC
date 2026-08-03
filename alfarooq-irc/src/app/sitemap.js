import { createClient } from '@supabase/supabase-js'

export default async function sitemap() {
  const baseUrl = 'https://alfarooq-irc.com';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/categories',
    '/search',
    '/ask',
    '/signin',
    '/ur/bookmark',
    '/ur/latest',
    '/ur/search',
    '/ur/select',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // 2. Dynamic Routes (Questions)
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    let dynamicRoutes = [];

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Fetch latest 500 questions for sitemap
      const { data: questions, error } = await supabase
        .from('UserQuestions')
        .select('Q_ID, Published_At')
        .order('Published_At', { ascending: false })
        .limit(500);

      if (!error && questions) {
        dynamicRoutes = questions.map((q) => ({
          url: `${baseUrl}/questions/${q.Q_ID}`,
          lastModified: new Date(q.Published_At || new Date()),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
      }
    }

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return staticRoutes;
  }
}
