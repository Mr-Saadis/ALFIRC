// src/app/signin/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabase'
import { FcGoogle } from 'react-icons/fc'
import { ArrowRight } from 'lucide-react'

// آیات کا ڈیٹا
const quranVerses = [
    {
        id: 1,
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا",
        urdu: "اے ایمان والو! اگر کوئی فاسق تمہارے پاس خبر لے کر آئے تو تحقیق کر لیا کرو۔ (الحجرات: 6)"
    },
    {
        id: 2,
        arabic: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
        urdu: "تو اہل ذکر سے پوچھ لیا کرو اگر تم نہیں جانتے۔ (النحل: 43)"
    },
    {
        id: 3,
        arabic: "قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي يُحْبِبْكُمُ اللَّهُ",
        urdu: "کہہ دیجئے! اگر تم اللہ سے محبت رکھتے ہو تو میری پیروی کرو، اللہ تم سے محبت کرے گا۔ (آل عمران: 31)"
    }
];

// نیا کمپوننٹ: آیات کو Smooth Fade کرنے کے لیے
const VerseRotator = ({ textColorClass = "text-blue-100" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // 1. پہلے غائب کریں (Fade Out)
            setIsVisible(false);

            // 2. تھوڑی دیر بعد ٹیکسٹ تبدیل کریں اور ظاہر کریں (Fade In)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % quranVerses.length);
                setIsVisible(true);
            }, 500); // 500ms کا وقفہ غائب ہونے کے بعد

        }, 5000); // ہر 5 سیکنڈ بعد تبدیل ہو

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
                <h3 className="text-lg md:text-[20px] font-bold font-arabic mb-3 leading-relaxed">
                    {currentVerse.arabic}
                </h3>
                <p className="text-sm md:text-[18px] opacity-90 font-arabic leading-relaxed">
                    {currentVerse.urdu}
                </p>
            </div>
        </div>
    );
};

export default function SignInPage() {
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get('redirectTo') || '/'
  const session      = useSession()
  const router       = useRouter()

  useEffect(() => {
    if (session) router.replace(redirectTo)
  }, [session, redirectTo, router])

  async function handleGoogleSignIn () {
    sessionStorage.setItem('postLoginRedirect', redirectTo)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options : { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  const primaryColorClass = "text-[#3333cc]";
  const primaryBorderClass = "hover:border-[#3333cc]";

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a2a] lg:bg-white font-sans transition-colors duration-300">

      {/* ========================================== */}
      {/* LEFT SIDE: DESKTOP ONLY */}
      {/* ========================================== */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a2a] relative overflow-hidden items-center justify-center">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#3333cc]/40 to-slate-950 z-0"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full border-[80px] border-[#3333cc]/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#3333cc]/20 blur-3xl animate-pulse delay-700"></div>

        <div className="relative z-10 px-16 text-center max-w-2xl">
            {/* Logo Icon */}
             <div className="mb-8 inline-block p-4 border border-blue-400/30 rounded-full bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(51,51,204,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
             </div>
             
            <h1 className="text-4xl font-bold text-white mb-8 tracking-tight font-arabic drop-shadow-lg">الفاروق اسلامک ریسرچ سنٹر</h1>

            {/* Desktop Rotator */}
            <VerseRotator textColorClass="text-blue-50" />
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE: LOGIN FORM */}
      {/* ========================================== */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 relative bg-[#0a0a2a] lg:bg-gray-50/50 transition-colors duration-300">

        {/* MOBILE BRANDING SECTION */}
        <div className="lg:hidden w-full flex flex-col items-center text-center mb-6 relative z-10 mt-safe">
             <div className="inline-block p-3 border border-blue-400/30 rounded-full bg-white/10 shadow-[0_0_20px_rgba(51,51,204,0.2)] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
             </div>
             <h2 className="text-2xl font-bold text-white font-arabic mb-2">الفاروق اسلامک ریسرچ سنٹر</h2>
             
             {/* Mobile Rotator */}
             <div className="w-full max-w-sm">
                <VerseRotator textColorClass="text-blue-100" />
             </div>
        </div>

        {/* Mobile Background Gradients */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3333cc]/20 to-transparent pointer-events-none"></div>

        {/* Form Container */}
        <div className="w-full max-w-sm relative z-10 not-lg:mb-30 bg-white/10 lg:bg-white p-6  rounded-2xl shadow-2xl lg:shadow-xl border border-white/10 lg:border-gray-100 backdrop-blur-md lg:backdrop-blur-none">

          <div className="mb-6 text-center lg:text-left lg:mb-8">
            <h2 className="text-xl lg:text-3xl font-bold text-white lg:text-gray-900 mb-2 font-arabic">خوش آمدید</h2>
            <p className="text-xs lg:text-base text-blue-200 lg:text-gray-500 font-arabic">
               براہ کرم اپنے گوگل اکاؤنٹ کے ذریعے لاگ ان کریں۔
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className={`group w-full relative flex items-center justify-between p-3 lg:p-4
              bg-white/95 lg:bg-white
              border-2 border-transparent lg:border-slate-100
              rounded-xl lg:rounded-2xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 ease-out ${primaryBorderClass} active:scale-[0.98]`}
            >
              <div className="flex items-center gap-3">
                 <div className="p-1.5 lg:p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                    <FcGoogle className="text-xl lg:text-2xl" />
                 </div>
                 <div className="text-left">
                    <span className={`block text-[10px] lg:text-sm text-gray-500 lg:text-gray-400 font-medium group-hover:text-[#3333cc] transition-colors`}>Continue with</span>
                    <span className="block text-sm lg:text-lg font-bold text-gray-800">Google</span>
                 </div>
              </div>

              <div className="pr-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                <ArrowRight className={`w-4 h-4 lg:w-5 lg:h-5 ${primaryColorClass}`} />
              </div>
            </button>

            <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/20 lg:border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-blue-200 lg:text-slate-300 text-[10px] lg:text-xs uppercase tracking-wider">Secure Login</span>
                <div className="flex-grow border-t border-white/20 lg:border-slate-200"></div>
            </div>

            <p className="text-center text-[10px] lg:text-xs text-blue-200 lg:text-gray-400 mt-4 font-arabic">
              لاگ ان کر کے آپ <span className={`font-medium cursor-pointer hover:text-white lg:hover:underline ${primaryColorClass} lg:text-inherit`}>شرائط و ضوابط</span> سے اتفاق کرتے ہیں۔
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}