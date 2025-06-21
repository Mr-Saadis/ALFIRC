'use client'

import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/Admin/DashboardLayout';
import UpdateQuestions from '@/components/Admin/UpdateQuestions';

export default function AdminUpdateQuestionsPage() {
  // Access the dynamic route param (id)
  const { id } = useParams();

  if (!id) {
    return <div>Error: Question ID is missing.</div>;
  }

  return (
    <DashboardLayout>
      <UpdateQuestions questionId={id} />
    </DashboardLayout>
  );
}
