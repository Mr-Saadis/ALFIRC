'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import { FcGoogle } from 'react-icons/fc';

export default function SignInPage() {
  const router  = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session) router.replace('/');
  }, [session, router]);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) alert('Sign-in failed: ' + error.message);
  };

  return (
    <div className="min-h-[80vh] font-arabic flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md flex flex-col justify-center w-full space-y-8 text-center">
         <div className='flex justify-center-safe'>
         <img  src="/images/logo.png"
            alt="Alfarooq Logo"
            className="h-20  w-auto " />
            </div>
        <h1 className="text-3xl font-bold text-gray-800">الفاروق اسلامک ریسرچ سنٹر</h1>
        <button
          onClick={handleGoogleSignIn}
          className="
            w-full flex items-center
            justify-center gap-3
            px-4 py-2
            border border-gray-300 rounded-lg
            bg-white hover:bg-gray-100
            focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
            transition
          "
        >
          <FcGoogle className="text-2xl" />
          <span className="text-gray-800 font-medium">
            Sign in with Google
          </span>
        </button>
        <p className="text-sm text-gray-500">
          اپنا اکاؤنٹ استعمال کرتے ہوئے سائن ان کریں
        </p>
      </div>
    </div>
  );
}
