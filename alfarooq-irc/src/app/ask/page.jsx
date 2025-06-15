// src/app/ask/page.jsx
'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Spinner } from 'flowbite-react'
import SignOutButton from '@/components/auth/SignOutButton'

export default function AskPage () {
  const [question, setQuestion]   = useState('')
  const [urgency,  setUrgency]    = useState('normal')
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!question.trim()) {
      toast.error('سوال لکھنا ضروری ہے')
      return
    }

    setSubmitting(true)
    const res = await fetch('/api/questions/new', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ body: question.trim(), urgency, anonymous }),
      // same-origin already sends cookies, but be explicit:
      credentials: 'include'
    })
    setSubmitting(false)

    if (res.ok) {
      toast.success('آپ کا سوال جمع ہو گیا ہے')
      setQuestion('')
      setUrgency('normal')
      setAnonymous(false)
      return
    }

    /* ---------- safe-parse error text ---------- */
    let msg = 'Server error'
    try {
      const { error } = await res.clone().json()
      if (error) msg = error
    } catch (_) {
      msg = res.statusText || msg
    }
    toast.error('خرابی: ' + msg)
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto px-4 py-8 font-arabic">
      <h1 className="text-2xl font-bold mb-4">نیا سوال پوچھیں</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <Label htmlFor="q">اپنا سوال لکھیں</Label>
          <Textarea
            id="q"
            rows={6}
            placeholder="یہاں اپنا سوال درج کریں..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="urg">اہمیت منتخب کریں</Label>
          <select
            id="urg"
            value={urgency}
            onChange={e => setUrgency(e.target.value)}
            className="w-full mt-2 rounded-md border px-3 py-2"
          >
            <option value="normal">نارمل</option>
            <option value="urgent">فوری</option>
            <option value="info">معلوماتی</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="anon"
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />
          <Label htmlFor="anon">میرا نام ظاہر نہ کیا جائے</Label>
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? <Spinner size="sm" /> : 'سوال جمع کروائیں'}
        </Button>
      </form>
       <SignOutButton redirectTo="/signin" />
    </div>
  )
}
