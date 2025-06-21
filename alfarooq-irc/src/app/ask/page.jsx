'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase' // Import Supabase client
import { useSession } from '@supabase/auth-helpers-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AskQuestionPage() {
  const router = useRouter()
  const session = useSession() // Using useSession to check if user is logged in

  const [body, setBody] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect to Sign-In if user is not authenticated
  if (!session) {
    router.push('/signin')
    return <div className="p-8 text-center">Redirecting to sign in...</div>
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Insert the new question into the database
    const { data, error } = await supabase
      .from('UserQuestions')
      .insert([
        {
          user_id: session.user.id,   // Linking user_id to the authenticated user
          body,
          urgency,
          anonymous,
        }
      ])

    setLoading(false)

    if (error) {
      toast.error('Failed to submit question: ' + error.message)
      console.error(error)
    } else {
      toast.success('Question submitted successfully!')
      router.push('/')  // Redirect to the homepage or questions list
    }
  }

  return (
    <div dir="rtl" className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">نیا سوال درج کریں</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Body */}
        <div>
          <Label htmlFor="body">سوال</Label>
          <Textarea
            id="body"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            placeholder="سوال درج کریں..."
          />
        </div>

        {/* Urgency */}
        <div>
          <Label htmlFor="urgency">اہمیت</Label>
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger>
              <SelectValue placeholder="Select urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Anonymous */}
        <div className="flex items-center">
          <Label htmlFor="anonymous" className="mr-2">آیا آپ کا نام ظاہر ہو گا؟</Label>
          <input
            id="anonymous"
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous((prev) => !prev)}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Submit Question'}
          </Button>
        </div>
      </form>
    </div>
  )
}
