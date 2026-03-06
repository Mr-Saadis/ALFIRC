'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea' 
import { toast } from 'sonner'
import { Trash2, Copy, Eye, EyeOff, User, Clock, AlertCircle, CheckCircle2, MessageSquare, Send } from 'lucide-react'

export default function UserQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  
  // نئے اسٹیٹس جواب لکھنے کے لیے
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  
  // Fetch questions with User Data (صرف وہ سوال جن کا جواب نہیں دیا گیا)
  useEffect(() => {
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from('UserQuestions')
        .select(`
            *,
            AuthenticatedUsers!user_id ( 
                full_name,
                email,
                avatar_url
            )
        `)
        .is('answer', null) // صرف بغیر جواب والے سوالات لائیں
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching questions:', error)
        toast.error('سوالات لوڈ کرنے میں ناکامی')
      } else {
        setQuestions(data)
      }
      setLoading(false)
    }

    fetchQuestions()
  }, [])

  // Delete Handler (اگر سوال فضول ہو اور ایڈمن ڈیلیٹ کرنا چاہے)
  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    const originalQuestions = [...questions];
    setQuestions(questions.filter((q) => q.id !== id));

    const { error } = await supabase
      .from('UserQuestions')
      .delete()
      .eq('id', id)

    if (error) {
      setQuestions(originalQuestions); 
      console.error('Error deleting:', error)
      toast.error('مسئلہ آ گیا، دوبارہ کوشش کریں')
    } else {
      toast.success('سوال ڈیلیٹ کر دیا گیا')
      if (selectedQuestion?.id === id) setSelectedQuestion(null);
    }
  }

  // Reply / Done Handler (جواب کو ڈیٹا بیس میں محفوظ کرنے کے لیے)
  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
        toast.error('براہ کرم جواب تحریر کریں!')
        return;
    }

    setSubmittingReply(true)
    const { error } = await supabase
        .from('UserQuestions')
        .update({ answer: replyText })
        .eq('id', selectedQuestion.id)

    setSubmittingReply(false)

    if (error) {
        toast.error('مسئلہ: ' + error.message)
    } else {
        toast.success('جواب کامیابی سے ارسال کر دیا گیا!')
        // لسٹ میں سے سوال ہٹا دیں کیونکہ اب یہ پینڈنگ نہیں رہا
        setQuestions(questions.filter((q) => q.id !== selectedQuestion.id))
        setSelectedQuestion(null)
        setReplyText('')
    }
  }

  // Copy Handler
  const handleCopy = () => {
    if (selectedQuestion) {
      navigator.clipboard.writeText(selectedQuestion.body)
      toast.success('سوال کاپی ہو گیا!')
    }
  }

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const openDialog = (q) => {
      setSelectedQuestion(q)
      setReplyText(q.answer || '')
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10 font-arabic" dir="rtl">
      
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <MessageSquare className="text-primary w-8 h-8" />
                    عوامی سوالات (User Questions)
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                    یہاں وہ سوالات ہیں جن کا جواب دینا ابھی باقی ہے۔
                </p>
            </div>
            <Badge variant="outline" className="bg-white px-4 py-1 text-primary border-[#3333cc]/30">
                کل التواء: {questions.length}
            </Badge>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            
            {loading ? (
                // Skeleton Loader
                <div className="p-10 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : questions.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center p-20 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">الحمدللہ! کوئی نیا سوال نہیں</h3>
                    <p className="text-gray-500 mt-2">تمام سوالات کے جوابات دیے جا چکے ہیں۔</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/80">
                            <TableRow>
                                <TableHead className="text-right w-[40%] font-bold text-gray-700">سوال (Question)</TableHead>
                                <TableHead className="text-right font-bold text-gray-700">صارف (User)</TableHead>
                                <TableHead className="text-center font-bold text-gray-700">نوعیت (Status)</TableHead>
                                <TableHead className="text-center font-bold text-gray-700">وقت (Time)</TableHead>
                                <TableHead className="text-left font-bold text-gray-700">عمل (Action)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.map((q) => (
                                <TableRow 
                                    key={q.id} 
                                    className="cursor-pointer hover:bg-blue-50/40 transition-colors group"
                                    onClick={() => openDialog(q)}
                                >
                                    {/* Question Body */}
                                    <TableCell className="py-4 align-top">
                                        <p className="line-clamp-2 text-gray-800 font-medium leading-relaxed">
                                            {q.body}
                                        </p>
                                    </TableCell>

                                    {/* User Info */}
                                    <TableCell className="py-4 align-top">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-9 h-9 border border-gray-200">
                                                <AvatarImage src={q.anonymous ? null : q.AuthenticatedUsers?.avatar_url} />
                                                <AvatarFallback className={q.anonymous ? "bg-gray-100" : "bg-blue-100 text-primary"}>
                                                    {q.anonymous ? <EyeOff size={16} /> : <User size={16} />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {q.anonymous ? "خفیہ (Anonymous)" : q.AuthenticatedUsers?.full_name || "Unknown User"}
                                                </span>
                                                {!q.anonymous && (
                                                    <span className="text-xs text-gray-500 font-sans">{q.AuthenticatedUsers?.email}</span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Urgency Badge */}
                                    <TableCell className="text-center py-4 align-top">
                                        <Badge 
                                            className={`
                                                ${q.urgency === 'urgent' 
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' 
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'}
                                                border font-normal px-3
                                            `}
                                        >
                                            {q.urgency === 'urgent' ? 'فوری (Urgent)' : 'عام (Normal)'}
                                        </Badge>
                                    </TableCell>

                                    {/* Time */}
                                    <TableCell className="text-center py-4 align-top">
                                        <div className="flex items-center justify-center gap-1 text-gray-500 text-xs font-sans bg-gray-100 px-2 py-1 rounded-md w-fit mx-auto">
                                            <Clock size={12} />
                                            {formatDate(q.created_at)}
                                        </div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-left py-4 align-top" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all gap-2"
                                            onClick={(e) => handleDelete(q.id, e)}
                                            title="سوال ڈیلیٹ کریں"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>

        {/* ─── Detail & Reply Dialog ─────────────────────────────── */}
        {selectedQuestion && (
            <Dialog open={!!selectedQuestion} onOpenChange={(open) => {
                if (!open) {
                    setSelectedQuestion(null);
                    setReplyText('');
                }
            }}>
                {/* 🌟 یہاں کلاسز کو اپڈیٹ کیا گیا ہے تاکہ سکرول آ سکے 🌟 */}
                <DialogContent className="max-w-xl font-arabic flex flex-col max-h-[90vh] p-0 overflow-hidden" dir="rtl">
                    
                    {/* ہیڈر: سکرول سے باہر فکس رہے گا */}
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
                        <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <AlertCircle className="text-primary" />
                            سوال کی تفصیل اور جواب
                        </DialogTitle>
                        <DialogDescription>
                            پوچھے گئے سوال کا مطالعہ کریں اور نیچے اپنا جواب تحریر کریں۔
                        </DialogDescription>
                    </DialogHeader>

                    {/* درمیان کا حصہ: یہ حصہ ضرورت پڑنے پر سکرول ہوگا */}
                    <div className="p-6 space-y-5 overflow-y-auto flex-1">
                        
                        {/* User Details Block */}
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                    <AvatarImage src={!selectedQuestion.anonymous && selectedQuestion.AuthenticatedUsers?.avatar_url} />
                                    <AvatarFallback className="bg-[#3333cc] text-white">
                                        {selectedQuestion.anonymous ? <EyeOff /> : <User />}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">
                                        {selectedQuestion.anonymous ? "خفیہ صارف" : selectedQuestion.AuthenticatedUsers?.full_name}
                                    </h4>
                                    <p className="text-sm text-gray-500 font-sans">
                                        {selectedQuestion.anonymous ? "شناخت ظاہر نہیں کی گئی" : selectedQuestion.AuthenticatedUsers?.email}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Meta Data */}
                            <div className="flex flex-col gap-2 items-end">
                                <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border ${selectedQuestion.urgency === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                    <AlertCircle size={14} />
                                    {selectedQuestion.urgency === 'urgent' ? 'فوری نوعیت' : 'عام نوعیت'}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-sans">
                                    <Clock size={14} />
                                    {formatDate(selectedQuestion.created_at)}
                                </div>
                            </div>
                        </div>

                        {/* Question Body */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500">سوال:</label>
                            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-gray-800 leading-8 text-lg whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                                {selectedQuestion.body}
                            </div>
                        </div>

                        {/* Reply Textarea */}
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                            <label className="text-sm font-bold text-primary flex items-center gap-2">
                                <MessageSquare size={16} /> جواب تحریر کریں:
                            </label>
                            <Textarea
                                rows={6}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="بسم اللہ الرحمٰن الرحیم..."
                                className="resize-none text-base p-4 border-gray-200 focus:border-[#3333cc] focus:ring-[#3333cc]/20 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* فوٹر: بٹن ہمیشہ نیچے فکس رہیں گے */}
                    <DialogFooter className="px-6 py-4 border-t border-gray-100 flex sm:justify-between items-center w-full bg-gray-50/50 shrink-0">
                        <Button onClick={handleCopy} variant="ghost" className="text-gray-500 hover:text-primary gap-2">
                            <Copy size={16} /> سوال کاپی کریں
                        </Button>
                        
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => { setSelectedQuestion(null); setReplyText(''); }}
                            >
                                منسوخ کریں
                            </Button>
                            <Button 
                                onClick={handleReplySubmit} 
                                disabled={submittingReply}
                                className="bg-[#3333cc] hover:bg-[#15185e] text-white gap-2"
                            >
                                {submittingReply ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> بھیجا جا رہا ہے...
                                    </>
                                ) : (
                                    <>
                                        جواب ارسال کریں <Send size={16} className="rotate-180" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                    
                </DialogContent>
            </Dialog>
        )}

      </div>
    </div>
  )
}