// src/app/ask/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useSession } from '@supabase/auth-helpers-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
// Icons
import { Send, HelpCircle, AlertCircle, Clock, UserX, UserCheck } from 'lucide-react'

export default function AskQuestionPage() {
  const router = useRouter()
  const session = useSession()

  const [body, setBody] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect Logic
  useEffect(() => {
    if (!session && session !== null) { 
       // session null means loading, false means not logged in. 
       // We wait for checking to finish (handled by wrapper usually)
       // But for simple check:
       // router.push('/signin') 
    }
  }, [session, router]);


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!body.trim()) {
        toast.error("براہ کرم سوال لکھیں")
        return;
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('UserQuestions')
      .insert([
        {
          user_id: session?.user?.id,
          body,
          urgency,
          anonymous,
        }
      ])

    setLoading(false)

    if (error) {
      toast.error('مسئلہ: ' + error.message)
      console.error(error)
    } else {
      toast.success('سوال کامیابی سے بھیج دیا گیا!')
      router.push('/') 
    }
  }

  // Loading State UI
  if (!session) {
     return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-pulse text-[#3333cc] font-arabic text-xl">لاگ ان چیک کیا جا رہا ہے...</div>
        </div>
     )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-arabic" dir="rtl">
      
      {/* Main Card Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Top Decorative Line */}
        <div className="h-2 w-full bg-[#3333cc]"></div>

        <div className="p-8">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-[#3333cc] mb-4">
               <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">نیا سوال پوچھیں</h2>
            <p className="text-gray-500 mt-2 text-sm">
              اپنا شرعی مسئلہ تفصیل سے بیان کریں۔ علمائے کرام جلد از جلد جواب دیں گے۔
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Question Body */}
            <div className="space-y-2">
              <Label htmlFor="body" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                 <span className="text-[#3333cc]"><HelpCircle className="w-4 h-4" /></span>
                 سوال کی تفصیل
              </Label>
              <div className="relative">
                <Textarea
                    id="body"
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    placeholder="اپنا سوال یہاں لکھیں..."
                    className="resize-none text-base p-4 border-gray-200 focus:border-[#3333cc] focus:ring-[#3333cc]/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mr-1">
                کوشش کریں کہ سوال واضح اور مختصر ہو۔
              </p>
            </div>

            {/* Settings Grid (Urgency & Anonymous) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Urgency Selection */}
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#3333cc]" />
                        نوعیت (Urgency)
                    </Label>
                    <Select value={urgency} onValueChange={setUrgency}>
                        <SelectTrigger className="h-12 border-gray-200 rounded-xl bg-gray-50/50 focus:ring-[#3333cc]/20">
                           <SelectValue placeholder="اہمیت منتخب کریں" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="normal">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                عام (Normal)
                            </div>
                        </SelectItem>
                        <SelectItem value="urgent">
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                فوری (Urgent)
                            </div>
                        </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Anonymous Toggle Card */}
                <div 
                    onClick={() => setAnonymous(!anonymous)}
                    className={`cursor-pointer group relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                        anonymous 
                        ? 'border-[#3333cc] bg-blue-50/30' 
                        : 'border-gray-100 bg-gray-50/50 hover:border-blue-200'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${anonymous ? 'bg-[#3333cc] text-white' : 'bg-gray-200 text-gray-500'}`}>
                             {anonymous ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                        </div>
                        <div className="text-right">
                            <span className={`block text-sm font-bold ${anonymous ? 'text-[#3333cc]' : 'text-gray-700'}`}>
                                خفیہ رکھیں
                            </span>
                            <span className="text-[10px] text-gray-500">
                                {anonymous ? 'آپ کا نام ظاہر نہیں ہوگا' : 'نام ظاہر کیا جائے گا'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Visual Checkbox */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${anonymous ? 'border-[#3333cc]' : 'border-gray-300'}`}>
                        {anonymous && <div className="w-2.5 h-2.5 rounded-full bg-[#3333cc]" />}
                    </div>
                </div>

            </div>

            {/* Disclaimer Box */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#3333cc] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 leading-relaxed">
                   آپ کا سوال علماء کرام کو بھیج دیا جائے گا۔ شرعی مسائل میں احتیاط لازمی ہے۔
                </p>
                 {/* جواب آنے پر آپ کو مطلع کر دیا جائے گا۔ */}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 text-lg bg-[#3333cc] hover:bg-blue-800 text-white rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        بھیجا جا رہا ہے...
                    </span>
                ) : (
                    <>
                       سوال ارسال کریں <Send className="w-5 h-5 rotate-180" />
                    </>
                )}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}