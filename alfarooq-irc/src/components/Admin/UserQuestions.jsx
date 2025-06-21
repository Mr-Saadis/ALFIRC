'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog'

export default function UserQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const router = useRouter()

  // Fetch questions from the database
  useEffect(() => {
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from('UserQuestions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching questions:', error)
        toast.error('Failed to fetch questions')
      } else {
        setQuestions(data)
      }

      setLoading(false)
    }

    fetchQuestions()
  }, [])

  // Delete question after admin clicks "Done"
  const handleDone = async (id) => {
    const { error } = await supabase
      .from('UserQuestions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting question:', error)
      toast.error('Failed to delete question')
    } else {
      setQuestions(questions.filter((q) => q.id !== id))
      toast.success('Question marked as done')
    }
  }

  // Handle showing the dialog with question details
  const handleRowClick = (question) => {
    setSelectedQuestion(question)
  }

  // Handle copying question content
  const handleCopy = () => {
    if (selectedQuestion) {
      navigator.clipboard.writeText(selectedQuestion.body)
      toast.success('Question copied to clipboard!')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">User Questions</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id} onClick={() => handleRowClick(question)}>
                <TableCell>{question.body}</TableCell>
                <TableCell>{question.user_id}</TableCell>
                <TableCell>{question.urgency}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    color="red"
                    onClick={() => handleDone(question.id)}
                  >
                    Mark as Done
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog for showing the question details */}
      {selectedQuestion && (
        <Dialog open={true} onOpenChange={() => setSelectedQuestion(null)}>
          <DialogTrigger>
            <div></div>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full p-6">
            <DialogHeader>
              <DialogTitle>Question Details</DialogTitle>
            </DialogHeader>
            <p><strong>Question:</strong> {selectedQuestion.body}</p>
            <p><strong>Urgency:</strong> {selectedQuestion.urgency}</p>
            <p><strong>Anonymous:</strong> {selectedQuestion.anonymous ? 'Yes' : 'No'}</p>

            <DialogFooter className="flex gap-4 justify-end">
              <Button onClick={handleCopy} variant="outline" color="green">
                Copy Question
              </Button>
              <Button onClick={() => setSelectedQuestion(null)} color="gray">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
