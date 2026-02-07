// 'use client'

// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
// import { toast } from 'sonner'
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog'

// export default function UserQuestions() {
//   const [questions, setQuestions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedQuestion, setSelectedQuestion] = useState(null)
//   const router = useRouter()

//   // Fetch questions from the database
//   useEffect(() => {
//     async function fetchQuestions() {
//       const { data, error } = await supabase
//         .from('UserQuestions')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) {
//         console.error('Error fetching questions:', error)
//         toast.error('Failed to fetch questions')
//       } else {
//         setQuestions(data)
//       }

//       setLoading(false)
//     }

//     fetchQuestions()
//   }, [])

//   // Delete question after admin clicks "Done"
//   const handleDone = async (id) => {
//     const { error } = await supabase
//       .from('UserQuestions')
//       .delete()
//       .eq('id', id)

//     if (error) {
//       console.error('Error deleting question:', error)
//       toast.error('Failed to delete question')
//     } else {
//       setQuestions(questions.filter((q) => q.id !== id))
//       toast.success('Question marked as done')
//     }
//   }

//   // Handle showing the dialog with question details
//   const handleRowClick = (question) => {
//     setSelectedQuestion(question)
//   }

//   // Handle copying question content
//   const handleCopy = () => {
//     if (selectedQuestion) {
//       navigator.clipboard.writeText(selectedQuestion.body)
//       toast.success('Question copied to clipboard!')
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h2 className="text-3xl font-bold mb-6">User Questions</h2>

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Question</TableHead>
//               <TableHead>User</TableHead>
//               <TableHead>Urgency</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {questions.map((question) => (
//               <TableRow key={question.id} onClick={() => handleRowClick(question)}>
//                 <TableCell>{question.body}</TableCell>
//                 <TableCell>{question.user_id}</TableCell>
//                 <TableCell>{question.urgency}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outline"
//                     color="red"
//                     onClick={() => handleDone(question.id)}
//                   >
//                     Mark as Done
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}

//       {/* Dialog for showing the question details */}
//       {selectedQuestion && (
//         <Dialog open={true} onOpenChange={() => setSelectedQuestion(null)}>
//           <DialogTrigger>
//             <div></div>
//           </DialogTrigger>
//           <DialogContent className="max-w-md w-full p-6">
//             <DialogHeader>
//               <DialogTitle>Question Details</DialogTitle>
//             </DialogHeader>
//             <p><strong>Question:</strong> {selectedQuestion.body}</p>
//             <p><strong>Urgency:</strong> {selectedQuestion.urgency}</p>
//             <p><strong>Anonymous:</strong> {selectedQuestion.anonymous ? 'Yes' : 'No'}</p>

//             <DialogFooter className="flex gap-4 justify-end">
//               <Button onClick={handleCopy} variant="outline" color="green">
//                 Copy Question
//               </Button>
//               <Button onClick={() => setSelectedQuestion(null)} color="gray">
//                 Close
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   )
// }




'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Trash2, Copy, Eye, EyeOff, User, Clock, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react'

export default function UserQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  
  // Fetch questions with User Data
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

  // Delete/Done Handler
  const handleDone = async (id, e) => {
    e.stopPropagation(); // Prevent row click opening dialog
    
    // Optimistic UI update (Delete from UI immediately)
    const originalQuestions = [...questions];
    setQuestions(questions.filter((q) => q.id !== id));

    const { error } = await supabase
      .from('UserQuestions')
      .delete()
      .eq('id', id)

    if (error) {
      setQuestions(originalQuestions); // Revert if failed
      console.error('Error deleting:', error)
      toast.error('مسئلہ آ گیا، دوبارہ کوشش کریں')
    } else {
      toast.success('سوال مکمل (Done) مارک کر دیا گیا')
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
                    یہاں وہ سوالات ہیں جو صارفین نے ایپ کے ذریعے پوچھے ہیں۔
                </p>
            </div>
            <Badge variant="outline" className="bg-white px-4 py-1 text-primary border-[#3333cc]/30">
                کل: {questions.length}
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
                    <h3 className="text-xl font-bold text-gray-800">کوئی نیا سوال نہیں!</h3>
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
                                    onClick={() => setSelectedQuestion(q)}
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
                                            className="text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all gap-2"
                                            onClick={(e) => handleDone(q.id, e)}
                                        >
                                            <CheckCircle2 size={18} />
                                            <span className="hidden sm:inline">Done</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>

        {/* ─── Detail Dialog ─────────────────────────────── */}
        {selectedQuestion && (
            <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
                <DialogContent className="max-w-lg font-arabic" dir="rtl">
                    <DialogHeader className="border-b border-gray-100 pb-4 mb-2">
                        <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <AlertCircle className="text-primary" />
                            سوال کی تفصیل
                        </DialogTitle>
                        <DialogDescription>
                            پوچھے گئے سوال کی مکمل معلومات نیچے موجود ہیں۔
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-2">
                        {/* User Details Block */}
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
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

                        {/* Question Body */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500">سوال:</label>
                            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-gray-800 leading-8 text-lg">
                                {selectedQuestion.body}
                            </div>
                        </div>

                        {/* Meta Data */}
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                                <Clock size={16} />
                                <span className="font-sans">{formatDate(selectedQuestion.created_at)}</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border ${selectedQuestion.urgency === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                <AlertCircle size={16} />
                                {selectedQuestion.urgency === 'urgent' ? 'فوری نوعیت' : 'عام نوعیت'}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t border-gray-100 pt-4 gap-2 sm:justify-start">
                        <Button onClick={handleCopy} variant="outline" className="gap-2 hover:border-[#3333cc] hover:text-primary">
                            <Copy size={16} /> کاپی کریں
                        </Button>
                        <Button 
                            onClick={(e) => { handleDone(selectedQuestion.id, e); setSelectedQuestion(null); }} 
                            className="bg-primary hover:bg-littleprimary text-white gap-2"
                        >
                            <CheckCircle2 size={16} /> مکمل (Done)
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}

      </div>
    </div>
  )
}