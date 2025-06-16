import DashboardLayout from '@/components/Admin/DashboardLayout'
import QuestionsTable from '@/components/Admin/QuestionsTable'
import OverviewCards from '@/components/Admin/OverviewCard'
import { supabaseAdmin } from '@/lib/supabase'

export default async function AdminQuestionsPage() {
  
  const { data: totalQuestions } = await supabaseAdmin.from('QnA').select('Q_ID', { count: 'exact' })
  const { data: totalUsers } = await supabaseAdmin.from('AnonymousUser').select('session_id', { count: 'exact' })
  const stats = {
    totalQuestions: totalQuestions?.length || 0,
    totalLatest: 10,      // compute from date filter
    totalApp: 0,          // etc
    totalUsers: totalUsers?.length || 0,
  }



  return (
    <DashboardLayout>
      <OverviewCards stats={stats} />
      <QuestionsTable />
    </DashboardLayout>
  )
} 