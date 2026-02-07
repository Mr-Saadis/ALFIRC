// // src/app/ask/page.jsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { useSession } from '@supabase/auth-helpers-react'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import { toast } from 'sonner'
// // Icons
// import { Send, HelpCircle, AlertCircle, Clock, UserX, UserCheck } from 'lucide-react'

// export default function AskQuestionPage() {
//   const router = useRouter()
//   const session = useSession()

//   const [body, setBody] = useState('')
//   const [urgency, setUrgency] = useState('normal')
//   const [anonymous, setAnonymous] = useState(false)
//   const [loading, setLoading] = useState(false)

//   // Redirect Logic
//   useEffect(() => {
//     if (!session && session !== null) { 
//        // session null means loading, false means not logged in. 
//        // We wait for checking to finish (handled by wrapper usually)
//        // But for simple check:
//        // router.push('/signin') 
//     }
//   }, [session, router]);


//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (!body.trim()) {
//         toast.error("براہ کرم سوال لکھیں")
//         return;
//     }

//     setLoading(true)

//     const { data, error } = await supabase
//       .from('UserQuestions')
//       .insert([
//         {
//           user_id: session?.user?.id,
//           body,
//           urgency,
//           anonymous,
//         }
//       ])

//     setLoading(false)

//     if (error) {
//       toast.error('مسئلہ: ' + error.message)
//       console.error(error)
//     } else {
//       toast.success('سوال کامیابی سے بھیج دیا گیا!')
//       router.push('/') 
//     }
//   }

//   // Loading State UI
//   if (!session) {
//      return (
//         <div className="h-screen flex items-center justify-center bg-gray-50">
//             <div className="animate-pulse text-primary font-arabic text-xl">لاگ ان چیک کیا جا رہا ہے...</div>
//         </div>
//      )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-arabic" dir="rtl">
      
//       {/* Main Card Container */}
//       <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
        
//         {/* Top Decorative Line */}
//         <div className="h-2 w-full bg-[#3333cc]"></div>

//         <div className="p-8">
          
//           {/* Header */}
//           <div className="text-center mb-10">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-4">
//                <HelpCircle className="w-8 h-8" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900">نیا سوال پوچھیں</h2>
//             <p className="text-gray-500 mt-2 text-sm">
//               اپنا شرعی مسئلہ تفصیل سے بیان کریں۔ علمائے کرام جلد از جلد جواب دیں گے۔
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-8">
            
//             {/* Question Body */}
//             <div className="space-y-2">
//               <Label htmlFor="body" className="text-base font-semibold text-gray-700 flex items-center gap-2">
//                  <span className="text-primary"><HelpCircle className="w-4 h-4" /></span>
//                  سوال کی تفصیل
//               </Label>
//               <div className="relative">
//                 <Textarea
//                     id="body"
//                     rows={6}
//                     value={body}
//                     onChange={(e) => setBody(e.target.value)}
//                     required
//                     placeholder="اپنا سوال یہاں لکھیں..."
//                     className="resize-none text-base p-4 border-gray-200 focus:border-[#3333cc] focus:ring-[#3333cc]/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all"
//                 />
//               </div>
//               <p className="text-xs text-gray-400 mr-1">
//                 کوشش کریں کہ سوال واضح اور مختصر ہو۔
//               </p>
//             </div>

//             {/* Settings Grid (Urgency & Anonymous) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
//                 {/* Urgency Selection */}
//                 <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                         <Clock className="w-4 h-4 text-primary" />
//                         نوعیت (Urgency)
//                     </Label>
//                     <Select value={urgency} onValueChange={setUrgency}>
//                         <SelectTrigger className="h-12 border-gray-200 rounded-xl bg-gray-50/50 focus:ring-[#3333cc]/20">
//                            <SelectValue placeholder="اہمیت منتخب کریں" />
//                         </SelectTrigger>
//                         <SelectContent>
//                         <SelectItem value="normal">
//                             <div className="flex items-center gap-2">
//                                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
//                                 عام (Normal)
//                             </div>
//                         </SelectItem>
//                         <SelectItem value="urgent">
//                              <div className="flex items-center gap-2">
//                                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
//                                 فوری (Urgent)
//                             </div>
//                         </SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Anonymous Toggle Card */}
//                 <div 
//                     onClick={() => setAnonymous(!anonymous)}
//                     className={`cursor-pointer group relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
//                         anonymous 
//                         ? 'border-[#3333cc] bg-blue-50/30' 
//                         : 'border-gray-100 bg-gray-50/50 hover:border-blue-200'
//                     }`}
//                 >
//                     <div className="flex items-center gap-3">
//                         <div className={`p-2 rounded-lg transition-colors ${anonymous ? 'bg-[#3333cc] text-white' : 'bg-gray-200 text-gray-500'}`}>
//                              {anonymous ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
//                         </div>
//                         <div className="text-right">
//                             <span className={`block text-sm font-bold ${anonymous ? 'text-primary' : 'text-gray-700'}`}>
//                                 خفیہ رکھیں
//                             </span>
//                             <span className="text-[10px] text-gray-500">
//                                 {anonymous ? 'آپ کا نام ظاہر نہیں ہوگا' : 'نام ظاہر کیا جائے گا'}
//                             </span>
//                         </div>
//                     </div>
                    
//                     {/* Visual Checkbox */}
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${anonymous ? 'border-[#3333cc]' : 'border-gray-300'}`}>
//                         {anonymous && <div className="w-2.5 h-2.5 rounded-full bg-[#3333cc]" />}
//                     </div>
//                 </div>

//             </div>

//             {/* Disclaimer Box */}
//             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
//                 <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
//                 <p className="text-sm text-littleprimary leading-relaxed">
//                    آپ کا سوال علماء کرام کو بھیج دیا جائے گا۔ شرعی مسائل میں احتیاط لازمی ہے۔
//                 </p>
//                  {/* جواب آنے پر آپ کو مطلع کر دیا جائے گا۔ */}
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <Button 
//                 type="submit" 
//                 disabled={loading}
//                 className="w-full h-12 text-lg bg-[#3333cc] hover:bg-littleprimary text-white rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                     <span className="flex items-center gap-2">
//                         <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
//                         بھیجا جا رہا ہے...
//                     </span>
//                 ) : (
//                     <>
//                        سوال ارسال کریں <Send className="w-5 h-5 rotate-180" />
//                     </>
//                 )}
//               </Button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }



// // src/app/ask/page.jsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { useSession } from '@supabase/auth-helpers-react'
// import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import { toast } from 'sonner'
// import { Send, HelpCircle, Clock, UserX, UserCheck, AlertCircle } from 'lucide-react'

// // --- 1. آیات کا ڈیٹا ---
// const quranVerses = [
//     {
//         id: 1,
//         arabic: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
//         urdu: "تو اہل ذکر سے پوچھ لیا کرو اگر تم نہیں جانتے۔ (النحل: 43)"
//     },
//     {
//         id: 2,
//         arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا",
//         urdu: "اے ایمان والو! اللہ سے ڈرو اور سیدھی بات کیا کرو۔ (الاحزاب: 70)"
//     },
//     {
//         id: 3,
//         arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
//         urdu: "اور کہو: اے میرے رب! میرے علم میں اضافہ فرما۔ (طٰہٰ: 114)"
//     }
// ];

// // --- 2. Verse Rotator Component ---
// const VerseRotator = ({ textColorClass = "text-blue-100" }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isVisible, setIsVisible] = useState(true);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setIsVisible(false);
//             setTimeout(() => {
//                 setCurrentIndex((prev) => (prev + 1) % quranVerses.length);
//                 setIsVisible(true);
//             }, 500);
//         }, 6000);
//         return () => clearInterval(interval);
//     }, []);

//     const currentVerse = quranVerses[currentIndex];

//     return (
//         <div className={`min-h-[140px] flex flex-col items-center justify-center text-center px-4 ${textColorClass}`}>
//             <div 
//                 className={`transition-all duration-700 ease-in-out transform ${
//                     isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
//                 }`}
//             >
//                 <h3 className="text-xl md:text-2xl font-bold font-arabic mb-4 leading-relaxed">
//                     {currentVerse.arabic}
//                 </h3>
//                 <p className="text-sm md:text-lg opacity-90 font-arabic leading-relaxed">
//                     {currentVerse.urdu}
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default function AskQuestionPage() {
//   const router = useRouter()
//   const session = useSession()

//   const [body, setBody] = useState('')
//   const [urgency, setUrgency] = useState('normal')
//   const [anonymous, setAnonymous] = useState(false)
//   const [loading, setLoading] = useState(false)

//   // Form Submission Logic
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!body.trim()) {
//         toast.error("براہ کرم سوال لکھیں")
//         return;
//     }
//     setLoading(true)
//     const { data, error } = await supabase
//       .from('UserQuestions')
//       .insert([{
//           user_id: session?.user?.id,
//           body,
//           urgency,
//           anonymous,
//         }])
//     setLoading(false)
//     if (error) {
//       toast.error('مسئلہ: ' + error.message)
//     } else {
//       toast.success('سوال کامیابی سے بھیج دیا گیا!')
//       router.push('/') 
//     }
//   }

//   // Loading Screen
//   if (!session) {
//      return (
//         <div className="h-screen w-full flex items-center justify-center bg-[#0a0a2a]">
//             <div className="flex flex-col items-center gap-4">
//                 <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
//                 <div className="text-white font-arabic text-xl animate-pulse">لاگ ان چیک کیا جا رہا ہے...</div>
//             </div>
//         </div>
//      )
//   }

//   return (
//     <div className="min-h-screen w-full flex bg-[#0a0a2a] lg:bg-white font-sans transition-colors duration-300" dir="rtl">

//       {/* ========================================== */}
//       {/* LEFT SIDE: DESKTOP ONLY (Visuals) */}
//       {/* ========================================== */}
//       <div className="hidden lg:flex w-1/2 bg-[#0a0a2a] relative overflow-hidden items-center justify-center">
//         {/* Gradients */}
//         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#3333cc]/40 to-slate-950 z-0"></div>
//         <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full border-[80px] border-[#3333cc]/10 blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#3333cc]/20 blur-3xl animate-pulse delay-700"></div>

//         <div className="relative z-10 px-12 text-center max-w-xl">
//              <div className="mb-8 inline-block p-4 border border-blue-400/30 rounded-full bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(51,51,204,0.3)]">
//                 <HelpCircle className="h-12 w-12 text-blue-200" strokeWidth={1.5} />
//              </div>
//             <h1 className="text-5xl font-bold text-white mb-8 tracking-tight font-arabic drop-shadow-lg">
//                 شرعی رہنمائی حاصل کریں
//             </h1>
//             <VerseRotator textColorClass="text-blue-50" />
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* RIGHT SIDE: FORM AREA */}
//       {/* ========================================== */}
//       <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 relative bg-[#0a0a2a] lg:bg-gray-50 overflow-y-auto">

//         {/* MOBILE BRANDING HEADER */}
//         <div className="lg:hidden w-full flex flex-col items-center text-center mb-6 relative z-10 mt-safe">
//              <div className="inline-block p-3 border border-blue-400/30 rounded-full bg-white/10 shadow-[0_0_20px_rgba(51,51,204,0.2)] mb-4">
//                 <HelpCircle className="h-8 w-8 text-blue-300" strokeWidth={1.5} />
//              </div>
//              <h2 className="text-2xl font-bold text-white font-arabic mb-2">سوال پوچھیں</h2>
//              <div className="w-full max-w-sm">
//                 <VerseRotator textColorClass="text-blue-100" />
//              </div>
//         </div>

//         {/* Mobile Background Gradients */}
//         <div className="lg:hidden absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3333cc]/20 to-transparent pointer-events-none"></div>

//         {/* ======================================================== */}
//         {/* THE CARD */}
//         {/* Desktop: White Card with Blue Strip */}
//         {/* Mobile: Glassmorphism Effect */}
//         {/* ======================================================== */}
//         <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
        
//         {/* Top Decorative Line */}
//         <div className="h-2 w-full bg-[#3333cc]"></div>

//         <div className="p-8">
          
//           {/* Header */}
//           <div className="text-center mb-10">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-4">
//                <HelpCircle className="w-8 h-8" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900">نیا سوال پوچھیں</h2>
//             <p className="text-gray-500 mt-2 text-sm">
//               اپنا شرعی مسئلہ تفصیل سے بیان کریں۔ علمائے کرام جلد از جلد جواب دیں گے۔
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-8">
            
//             {/* Question Body */}
//             <div className="space-y-2">
//               <Label htmlFor="body" className="text-base font-semibold text-gray-700 flex items-center gap-2">
//                  <span className="text-primary"><HelpCircle className="w-4 h-4" /></span>
//                  سوال کی تفصیل
//               </Label>
//               <div className="relative">
//                 <Textarea
//                     id="body"
//                     rows={6}
//                     value={body}
//                     onChange={(e) => setBody(e.target.value)}
//                     required
//                     placeholder="اپنا سوال یہاں لکھیں..."
//                     className="resize-none text-base p-4 border-gray-200 focus:border-[#3333cc] focus:ring-[#3333cc]/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all"
//                 />
//               </div>
//               <p className="text-xs text-gray-400 mr-1">
//                 کوشش کریں کہ سوال واضح اور مختصر ہو۔
//               </p>
//             </div>

//             {/* Settings Grid (Urgency & Anonymous) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
//                 {/* Urgency Selection */}
//                 <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                         <Clock className="w-4 h-4 text-primary" />
//                         نوعیت (Urgency)
//                     </Label>
//                     <Select value={urgency} onValueChange={setUrgency}>
//                         <SelectTrigger className="h-12 border-gray-200 rounded-xl bg-gray-50/50 focus:ring-[#3333cc]/20">
//                            <SelectValue placeholder="اہمیت منتخب کریں" />
//                         </SelectTrigger>
//                         <SelectContent>
//                         <SelectItem value="normal">
//                             <div className="flex items-center gap-2">
//                                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
//                                 عام (Normal)
//                             </div>
//                         </SelectItem>
//                         <SelectItem value="urgent">
//                              <div className="flex items-center gap-2">
//                                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
//                                 فوری (Urgent)
//                             </div>
//                         </SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Anonymous Toggle Card */}
//                 <div 
//                     onClick={() => setAnonymous(!anonymous)}
//                     className={`cursor-pointer group relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
//                         anonymous 
//                         ? 'border-[#3333cc] bg-blue-50/30' 
//                         : 'border-gray-100 bg-gray-50/50 hover:border-blue-200'
//                     }`}
//                 >
//                     <div className="flex items-center gap-3">
//                         <div className={`p-2 rounded-lg transition-colors ${anonymous ? 'bg-[#3333cc] text-white' : 'bg-gray-200 text-gray-500'}`}>
//                              {anonymous ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
//                         </div>
//                         <div className="text-right">
//                             <span className={`block text-sm font-bold ${anonymous ? 'text-primary' : 'text-gray-700'}`}>
//                                 خفیہ رکھیں
//                             </span>
//                             <span className="text-[10px] text-gray-500">
//                                 {anonymous ? 'آپ کا نام ظاہر نہیں ہوگا' : 'نام ظاہر کیا جائے گا'}
//                             </span>
//                         </div>
//                     </div>
                    
//                     {/* Visual Checkbox */}
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${anonymous ? 'border-[#3333cc]' : 'border-gray-300'}`}>
//                         {anonymous && <div className="w-2.5 h-2.5 rounded-full bg-[#3333cc]" />}
//                     </div>
//                 </div>

//             </div>

//             {/* Disclaimer Box */}
//             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
//                 <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
//                 <p className="text-sm text-littleprimary leading-relaxed">
//                    آپ کا سوال علماء کرام کو بھیج دیا جائے گا۔ شرعی مسائل میں احتیاط لازمی ہے۔
//                 </p>
//                  {/* جواب آنے پر آپ کو مطلع کر دیا جائے گا۔ */}
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <Button 
//                 type="submit" 
//                 disabled={loading}
//                 className="w-full h-12 text-lg bg-[#3333cc] hover:bg-littleprimary text-white rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                     <span className="flex items-center gap-2">
//                         <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
//                         بھیجا جا رہا ہے...
//                     </span>
//                 ) : (
//                     <>
//                        سوال ارسال کریں <Send className="w-5 h-5 rotate-180" />
//                     </>
//                 )}
//               </Button>
//             </div>

//           </form>
//         </div>
//       </div>
        
//       </div>
//     </div>
//   )
// }





// src/app/ask/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useSession } from '@supabase/auth-helpers-react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import SignOutButton from '@/components/auth/SignOutButton'
import { Send, HelpCircle, Clock, UserX, UserCheck, AlertCircle } from 'lucide-react'

// --- 1. آیات کا ڈیٹا ---
const quranVerses = [
    {
        id: 1,
        arabic: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
        urdu: "تو اہل ذکر سے پوچھ لیا کرو اگر تم نہیں جانتے۔ (النحل: 43)"
    },
    {
        id: 2,
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا",
        urdu: "اے ایمان والو! اللہ سے ڈرو اور سیدھی بات کیا کرو۔ (الاحزاب: 70)"
    },
    {
        id: 3,
        arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
        urdu: "اور کہو: اے میرے رب! میرے علم میں اضافہ فرما۔ (طٰہٰ: 114)"
    }
];

// --- 2. Verse Rotator Component ---
const VerseRotator = ({ textColorClass = "text-blue-100" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % quranVerses.length);
                setIsVisible(true);
            }, 500);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const currentVerse = quranVerses[currentIndex];

    return (
        <div className={`min-h-[140px] flex flex-col items-center justify-center text-center px-4 ${textColorClass}`}>
            <div 
                className={`transition-all duration-700 ease-in-out transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
            >
                <h3 className="text-[20px] md:text-[22px] font-bold font-arabic mb-4 leading-relaxed">
                    {currentVerse.arabic}
                </h3>
                <p className="text-[18px] md:text-[20px] opacity-90 font-arabic leading-relaxed">
                    {currentVerse.urdu}
                </p>
            </div>
        </div>
    );
};

export default function AskQuestionPage() {
  const router = useRouter()
  const session = useSession()

  const [body, setBody] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!body.trim()) {
        toast.error("براہ کرم سوال لکھیں")
        return;
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('UserQuestions')
      .insert([{
          user_id: session?.user?.id,
          body,
          urgency,
          anonymous,
        }])
    setLoading(false)
    if (error) {
      toast.error('مسئلہ: ' + error.message)
    } else {
      toast.success('سوال کامیابی سے بھیج دیا گیا!')
      router.push('/') 
    }
  }

  // Loading Screen
  if (!session) {
     return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0a0a2a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="text-white font-arabic text-xl animate-pulse">لاگ ان چیک کیا جا رہا ہے...</div>
            </div>
        </div>
     )
  }

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a2a] lg:bg-white font-sans transition-colors duration-300" dir="rtl">

      {/* ========================================== */}
      {/* LEFT SIDE: DESKTOP ONLY (Visuals) */}
      {/* ========================================== */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a2a] relative overflow-hidden items-center justify-center">
        {/* Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#3333cc]/40 to-slate-950 z-0"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full border-[80px] border-[#3333cc]/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#3333cc]/20 blur-3xl animate-pulse delay-700"></div>

        <div className="relative z-10 px-12 text-center max-w-xl">
             <div className="mb-8 inline-block p-4 border border-blue-400/30 rounded-full bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(51,51,204,0.3)]">
                <HelpCircle className="h-12 w-12 text-blue-200" strokeWidth={1.5} />
             </div>
            <h1 className="text-4xl font-bold text-white mb-8 tracking-tight font-arabic drop-shadow-lg">
                شرعی رہنمائی حاصل کریں
            </h1>
            <VerseRotator textColorClass="text-blue-50" />
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE: FORM AREA (Mobile + Desktop) */}
      {/* ========================================== */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 relative bg-[#0a0a2a] lg:bg-gray-50 overflow-y-auto overflow-x-hidden">

        {/* 🌟 MOBILE BACKGROUND EFFECTS (The "Effect" you wanted) 🌟 */}
        {/* یہ وہ حصہ ہے جو موبائل پر ڈیسک ٹاپ جیسا ایفیکٹ لائے گا */}
        <div className="lg:hidden absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] right-[-30%] w-[300px] h-[300px] rounded-full bg-[#3333cc]/30 blur-[80px] animate-pulse"></div>
             <div className="absolute bottom-[-10%] left-[-30%] w-[300px] h-[300px] rounded-full bg-primary/20 blur-[80px] animate-pulse delay-1000"></div>
             <div className="absolute top-[40%] left-[20%] w-[150px] h-[150px] rounded-full bg-purple-500/10 blur-[60px]"></div>
        </div>

        {/* MOBILE BRANDING HEADER */}
        <div className="lg:hidden w-full flex flex-col items-center text-center mb-6 relative z-10 mt-safe">
             <div className="inline-block p-3 border border-blue-400/30 rounded-full bg-white/10 shadow-[0_0_20px_rgba(51,51,204,0.2)] mb-4">
                <HelpCircle className="h-8 w-8 text-blue-300" strokeWidth={1.5} />
             </div>
             <h2 className="text-2xl font-bold text-white font-arabic mb-6">سوال پوچھیں</h2>
             <div className="w-full max-w-sm">
                <VerseRotator textColorClass="text-blue-100" />
             </div>
        </div>

        {/* ======================================================== */}
        {/* THE CARD */}
        {/* ======================================================== */}
        <div className={`
            w-full max-w-2xl relative z-10 rounded-2xl overflow-hidden transition-all duration-300
            
            /* Mobile Styles: Glass Effect */
            bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
            
            /* Desktop Styles: White Card with Shadow */
            lg:bg-white lg:shadow-[0_20px_50px_rgba(0,0,0,0.1)] lg:border lg:border-gray-100
        `}>
          
          {/* Top Blue Strip */}
          <div className="h-2 w-full"></div>

          <div className="p-6 md:p-8">
            
            {/* Form Header */}
            <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-white lg:text-gray-900 mb-2 font-arabic">نیا سوال درج کریں</h2>
               <p className="text-sm text-blue-100 lg:text-gray-500 font-arabic">
                  اپنا شرعی مسئلہ تفصیل سے بیان کریں۔ علمائے کرام جلد از جلد جواب دیں گے۔
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Question Body */}
              <div className="space-y-2">
                <Label htmlFor="body" className="text-base font-semibold text-white lg:text-gray-700 flex items-center gap-2 font-arabic">
                   <span className="text-blue-300 lg:text-primary"><HelpCircle className="w-4 h-4" /></span>
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
                      className="resize-none text-base p-4 rounded-xl transition-all
                      bg-white/90 focus:bg-white text-gray-900 placeholder:text-gray-500
                      lg:bg-gray-50 lg:focus:bg-white lg:border-gray-200 lg:focus:border-[#3333cc] lg:focus:ring-[#3333cc]/20"
                  />
                </div>
                <p className="text-xs text-blue-200 lg:text-gray-400 mr-1">
                   کوشش کریں کہ سوال واضح اور مختصر ہو۔
                </p>
              </div>

              {/* Grid for Select & Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Urgency */}
                  <div className="space-y-2">
                      <Label className="text-sm font-semibold text-white lg:text-gray-700 flex items-center gap-2 font-arabic">
                          <Clock className="w-4 h-4 text-blue-300 lg:text-primary" />
                          نوعیت (Urgency)
                      </Label>
                      <Select value={urgency} onValueChange={setUrgency}>
                          <SelectTrigger className="h-12 rounded-xl border-0 lg:border lg:border-gray-200 bg-white/90 lg:bg-gray-50 text-gray-900 focus:ring-[#3333cc]/20">
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

                  {/* Anonymous Toggle */}
                  <div className="space-y-2">
                      <div 
                          onClick={() => setAnonymous(!anonymous)}
                          className={`cursor-pointer group relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 mt-7
                          ${anonymous 
                              ? 'border-[#3333cc] bg-[#3333cc] lg:bg-blue-50/30' 
                              : 'border-white/20 lg:border-gray-100 bg-white/10 lg:bg-gray-50/50 hover:border-blue-200'}
                          `}
                      >
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-colors ${anonymous ? 'bg-white text-primary lg:bg-[#3333cc] lg:text-white' : 'bg-white/20 text-white lg:bg-gray-200 lg:text-gray-500'}`}>
                                   {anonymous ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                              </div>
                              <div className="text-right">
                                  <span className={`block text-sm font-bold ${anonymous ? 'text-white lg:text-primary' : 'text-white lg:text-gray-700'}`}>
                                      خفیہ رکھیں
                                  </span>
                                  <span className={`text-[10px] ${anonymous ? 'text-blue-100 lg:text-gray-500' : 'text-blue-200 lg:text-gray-500'}`}>
                                      {anonymous ? 'نام ظاہر نہیں ہوگا' : 'نام ظاہر ہوگا'}
                                  </span>
                              </div>
                          </div>
                          
                          {/* Visual Checkbox */}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${anonymous ? 'border-white lg:border-[#3333cc]' : 'border-white/50 lg:border-gray-300'}`}>
                              {anonymous && <div className="w-2.5 h-2.5 rounded-full bg-white lg:bg-[#3333cc]" />}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-900/40 lg:bg-blue-50 p-4 rounded-xl border border-blue-500/30 lg:border-blue-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-200 lg:text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-100 lg:text-littleprimary leading-relaxed font-arabic">
                     آپ کا سوال علماء کرام کو بھیج دیا جائے گا۔ جواب آنے پر آپ کو مطلع کر دیا جائے گا۔ شرعی مسائل میں احتیاط لازمی ہے۔
                  </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 text-lg rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-arabic font-bold
                    bg-white text-[#15185e] hover:bg-gray-100
                    lg:bg-[#15185e] lg:text-white lg:hover:bg-[#0d1063]/95"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
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
        <div className="relative z-10 mt-8 mb-4 opacity-80 hover:opacity-100 transition-opacity not-lg:mb-30">
            <div className="flex items-center justify-center gap-2">
                <span className="text-blue-200 lg:text-gray-400 text-sm font-arabic">اکاؤنٹ تبدیل کرنا ہے؟</span>
                <SignOutButton 
                    redirectTo="/signin" 
                    // آپ اپنے SignOutButton کو یہاں styling props پاس کر سکتے ہیں یا اسے ایک simple wrapper میں رکھ سکتے ہیں
                    className="text-white lg:text-primary underline hover:text-blue-300 lg:hover:text-littleprimary text-sm font-medium transition-colors"
                />
            </div>
        </div>
         
      </div>
    </div>
  )
}