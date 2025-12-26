// import DashboardLayout from '@/components/Admin/DashboardLayout'
// import QuestionsTable from '@/components/Admin/QuestionsTable'
// import OverviewCards from '@/components/Admin/OverviewCard'
// import { supabaseAdmin } from '@/lib/supabase'

// export default async function AdminQuestionsPage() {
  
//   const { data: totalQuestions } = await supabaseAdmin.from('QnA').select('Q_ID', { count: 'exact' })
//   const { data: totalUsers } = await supabaseAdmin.from('AnonymousUser').select('session_id', { count: 'exact' })
//   const stats = {
//     totalQuestions: totalQuestions?.length || 0,
//     totalLatest: 10,      // compute from date filter
//     totalApp: 0,          // etc
//     totalUsers: totalUsers?.length || 0,
//   }



//   return (
//     <DashboardLayout>
//       <OverviewCards stats={stats} />
//       <QuestionsTable />
//     </DashboardLayout>
//   )
// } 
import DashboardLayout from '@/components/Admin/DashboardLayout'
import QuestionsTable from '@/components/Admin/QuestionsTable'
import OverviewCards from '@/components/Admin/OverviewCard'
import { supabaseAdmin } from '@/lib/supabase'
import { formatISO, subDays } from 'date-fns'

export const dynamic = 'force-dynamic';

export default async function AdminQuestionsPage() {
  
  const today = new Date();
  const todayStr = formatISO(today, { representation: 'date' });
  const yesterdayStr = formatISO(subDays(today, 1), { representation: 'date' });
  
  // پچھلے 7 دنوں کی تاریخ نکالیں
  const lastWeekStr = formatISO(subDays(today, 7), { representation: 'date' });

  const [
    { count: totalQuestions },
    { count: totalUsers },
    { data: todayData },
    { count: yesterdayCount },
    { count: weeklyCount } // <-- نیا ویری ایبل
  ] = await Promise.all([
    
    // 1. Total
    supabaseAdmin.from('QnA').select('*', { count: 'exact', head: true }),
    
    // 2. Users
    supabaseAdmin.from('AnonymousUser').select('*', { count: 'exact', head: true }),

    // 3. Today Data
    supabaseAdmin
      .from('QnA')
      .select('Q_ID')
      .eq('Published_At', todayStr)
      .order('Q_ID', { ascending: false }),

    // 4. Yesterday Count
    supabaseAdmin
      .from('QnA')
      .select('*', { count: 'exact', head: true })
      .eq('Published_At', yesterdayStr),

    // 5. Weekly Count (New Query)
    supabaseAdmin
      .from('QnA')
      .select('*', { count: 'exact', head: true })
      .gte('Published_At', lastWeekStr) // gte = greater than or equal (پچھلے 7 دن سے اب تک)
  ]);

  const stats = {
    totalQuestions: totalQuestions || 0,
    totalUsers: totalUsers || 0,
    todayCount: todayData?.length || 0,
    yesterdayCount: yesterdayCount || 0,
    weeklyCount: weeklyCount || 0, // <-- یہ ڈیٹا پاس کر رہے ہیں
    lastQID: todayData?.length > 0 ? todayData[0].Q_ID : null 
  }

  return (
    <DashboardLayout>
      <OverviewCards stats={stats} />
      <QuestionsTable />
    </DashboardLayout>
  )
}