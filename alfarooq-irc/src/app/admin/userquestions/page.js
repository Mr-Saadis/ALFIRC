import DashboardLayout from '@/components/Admin/DashboardLayout'
import UserQuestions from '@/components/Admin/UserQuestions'

export default async function AdminUSerQuestionsPage() {
  // You can fetch stats server-side
  


  return (
    <DashboardLayout>
      <UserQuestions/>
    </DashboardLayout>
  )
}
