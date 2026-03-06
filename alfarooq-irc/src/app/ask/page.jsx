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
import { Send, HelpCircle, Clock, UserX, UserCheck, AlertCircle, MessageCircle, CheckCircle2, Clock3 } from 'lucide-react'

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

// --- 3. Link Parser Helper (لنکس کو کلک ایبل بنانے کے لیے) ---
const renderWithLinks = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            return (
                <a 
                    key={i} 
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-sans text-green-300 lg:text-green-700 hover:text-white lg:hover:text-green-900 underline underline-offset-4 transition-colors break-all"
                    dir="ltr" 
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

export default function AskQuestionPage() {
  const router = useRouter()
  const session = useSession()

  const [body, setBody] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  // --- نئے اسٹیٹس: ہسٹری کے لیے ---
  const [pastQuestions, setPastQuestions] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  // --- ہسٹری فیچ کرنے کا فنکشن ---
  const fetchUserQuestions = async () => {
    if (!session?.user?.id) return;
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('UserQuestions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPastQuestions(data);
    }
    setLoadingHistory(false);
  }

  useEffect(() => {
    fetchUserQuestions();
  }, [session]);

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
      setBody('') 
      fetchUserQuestions() 
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

        {/* 🌟 MOBILE BACKGROUND EFFECTS 🌟 */}
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
            bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
            lg:bg-white lg:shadow-[0_20px_50px_rgba(0,0,0,0.1)] lg:border lg:border-gray-100
        `}>
          
          <div className="h-2 w-full"></div>

          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-white lg:text-gray-900 mb-2 font-arabic">نیا سوال درج کریں</h2>
               <p className="text-sm text-blue-100 lg:text-gray-500 font-arabic">
                  اپنا شرعی مسئلہ تفصیل سے بیان کریں۔ علمائے کرام جلد از جلد جواب دیں گے۔
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="resize-none text-base p-4 rounded-xl transition-all bg-white/90 focus:bg-white text-gray-900 placeholder:text-gray-500 lg:bg-gray-50 lg:focus:bg-white lg:border-gray-200 lg:focus:border-[#3333cc] lg:focus:ring-[#3333cc]/20"
                  />
                </div>
                <p className="text-xs text-blue-200 lg:text-gray-400 mr-1">
                   کوشش کریں کہ سوال واضح اور مختصر ہو۔
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <Label className="text-sm font-semibold text-white lg:text-gray-700 flex items-center gap-2 font-arabic">
                          <Clock className="w-4 h-4 text-blue-300 lg:text-primary" /> نوعیت (Urgency)
                      </Label>
                      <Select value={urgency} onValueChange={setUrgency}>
                          <SelectTrigger className="h-12 rounded-xl border-0 lg:border lg:border-gray-200 bg-white/90 lg:bg-gray-50 text-gray-900 focus:ring-[#3333cc]/20">
                             <SelectValue placeholder="اہمیت منتخب کریں" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="normal"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>عام (Normal)</div></SelectItem>
                              <SelectItem value="urgent"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>فوری (Urgent)</div></SelectItem>
                          </SelectContent>
                      </Select>
                  </div>

                  <div className="space-y-2">
                      <div onClick={() => setAnonymous(!anonymous)} className={`cursor-pointer group relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 mt-7 ${anonymous ? 'border-[#3333cc] bg-[#3333cc] lg:bg-blue-50/30' : 'border-white/20 lg:border-gray-100 bg-white/10 lg:bg-gray-50/50 hover:border-blue-200'}`}>
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-colors ${anonymous ? 'bg-white text-primary lg:bg-[#3333cc] lg:text-white' : 'bg-white/20 text-white lg:bg-gray-200 lg:text-gray-500'}`}>
                                   {anonymous ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                              </div>
                              <div className="text-right">
                                  <span className={`block text-sm font-bold ${anonymous ? 'text-white lg:text-primary' : 'text-white lg:text-gray-700'}`}>خفیہ رکھیں</span>
                                  <span className={`text-[10px] ${anonymous ? 'text-blue-100 lg:text-gray-500' : 'text-blue-200 lg:text-gray-500'}`}>{anonymous ? 'نام ظاہر نہیں ہوگا' : 'نام ظاہر ہوگا'}</span>
                              </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${anonymous ? 'border-white lg:border-[#3333cc]' : 'border-white/50 lg:border-gray-300'}`}>
                              {anonymous && <div className="w-2.5 h-2.5 rounded-full bg-white lg:bg-[#3333cc]" />}
                          </div>
                      </div>
                  </div>
              </div>

              <div className="bg-blue-900/40 lg:bg-blue-50 p-4 rounded-xl border border-blue-500/30 lg:border-blue-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-200 lg:text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-100 lg:text-littleprimary leading-relaxed font-arabic">
                     آپ کا سوال علماء کرام کو بھیج دیا جائے گا۔ جواب آنے پر آپ کو مطلع کر دیا جائے گا۔ شرعی مسائل میں احتیاط لازمی ہے۔
                  </p>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full h-12 text-lg rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-arabic font-bold bg-white text-[#15185e] hover:bg-gray-100 lg:bg-[#15185e] lg:text-white lg:hover:bg-[#0d1063]/95">
                    {loading ? <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>بھیجا جا رہا ہے...</span> : <>سوال ارسال کریں <Send className="w-5 h-5 rotate-180" /></>}
                </Button>
              </div>

            </form>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PAST QUESTIONS HISTORY */}
        {/* ======================================================== */}
        <div className="w-full max-w-2xl mt-12 mb-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-3 mb-6 px-2">
                <MessageCircle className="w-6 h-6 text-white lg:text-[#3333cc]" />
                <h3 className="text-xl font-bold text-white lg:text-gray-900 font-arabic">آپ کے سابقہ سوالات</h3>
            </div>

            {loadingHistory ? (
                <div className="text-center py-10 bg-white/5 backdrop-blur-md lg:bg-white rounded-2xl border border-white/10 lg:border-gray-100">
                    <span className="animate-pulse text-blue-200 lg:text-[#3333cc] font-arabic flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>لوڈ ہو رہا ہے...
                    </span>
                </div>
            ) : pastQuestions.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-md lg:bg-white rounded-2xl border border-white/10 lg:border-gray-100 p-8 text-center shadow-sm">
                     <p className="text-blue-200 lg:text-gray-500 font-arabic text-lg">آپ نے ابھی تک کوئی سوال نہیں پوچھا۔</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pastQuestions.map((q) => (
                        <div key={q.id} className="bg-white/10 backdrop-blur-xl border border-white/20 lg:bg-white lg:border-gray-100 rounded-2xl p-5 lg:shadow-sm transition-all hover:shadow-md">
                            
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] md:text-xs px-3 py-1 rounded-full font-bold font-arabic ${q.urgency === 'urgent' ? 'bg-red-500/20 text-red-200 lg:bg-red-50 lg:text-red-600 border border-red-500/30 lg:border-red-100' : 'bg-blue-500/20 text-blue-200 lg:bg-blue-50 lg:text-blue-600 border border-blue-500/30 lg:border-blue-100'}`}>
                                    {q.urgency === 'urgent' ? 'فوری مسئلہ' : 'عام مسئلہ'}
                                </span>
                                <span className="text-xs text-blue-200/70 lg:text-gray-400 font-sans tracking-wide" dir="ltr">
                                    {new Date(q.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            
                            <p className="text-white lg:text-gray-800 font-arabic text-base md:text-lg leading-relaxed mb-5 whitespace-pre-wrap">
                                {q.body}
                            </p>

                            {q.answer ? (
                                <div className="mt-4 bg-[#102a1b]/80 border border-green-500/30 lg:bg-green-50 lg:border-green-200 rounded-xl p-4 md:p-5 relative shadow-inner">
                                    <div className="absolute top-0 right-5 -translate-y-1/2 bg-green-500 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1 font-arabic shadow-md border border-green-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> جواب موصول
                                    </div>
                                    <p className="text-sm md:text-base text-green-50 lg:text-green-900 font-arabic leading-relaxed mt-2 whitespace-pre-wrap">
                                        {/* یہاں ہم نے renderWithLinks کا فنکشن استعمال کیا ہے */}
                                        {renderWithLinks(q.answer)}
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-200 lg:text-gray-500 font-arabic bg-black/20 lg:bg-gray-50 py-3 px-4 rounded-xl border border-white/5 lg:border-gray-100">
                                    <Clock3 className="w-4 h-4 animate-pulse" />
                                    <span>علمائے کرام کی جانب سے جواب کا انتظار ہے...</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="relative z-10 mt-4 mb-8 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-center gap-2">
                <span className="text-blue-200 lg:text-gray-500 text-sm font-arabic">اکاؤنٹ تبدیل کرنا ہے؟</span>
                <SignOutButton 
                    redirectTo="/signin" 
                    className="text-white lg:text-[#3333cc] underline hover:text-blue-300 lg:hover:text-[#15185e] text-sm font-bold transition-colors font-arabic"
                />
            </div>
        </div>
         
      </div>
    </div>
  )
}