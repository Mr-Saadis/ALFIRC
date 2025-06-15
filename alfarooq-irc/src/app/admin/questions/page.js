import DashboardLayout from '@/components/Admin/DashboardLayout'
import NewQuestions from '@/components/Admin/NewQuestions'

export default async function AdminQuestionsPage() {
  // You can fetch stats server-side
  


  return (
    <DashboardLayout>
      <NewQuestions />
    </DashboardLayout>
  )
}
