// src/app/layout.js
'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Poppins } from "next/font/google";
import { supabase } from '@/lib/supabase'
import './globals.css'
import Navbar from '@/components/navbar'
import QuickAction from '@/components/layout/QuickAction'
import { Toaster } from 'sonner'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from "@/context/ThemeContext"; // Ensure path is correct

const poppins = Poppins({
  variable: "--font-Poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function RootLayout({ children }) {
  const pathname = usePathname()
  
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className={` ${poppins.variable} bg-gray-50 antialiased`} suppressHydrationWarning={true}>

        <SessionContextProvider supabaseClient={supabase}>
          
          {/* ✅ FIXED: ThemeProvider starts HERE, wrapping Navbar */}
          <ThemeProvider>
            
            <Navbar />
            
            {pathname !== '/admin' &&
             pathname !== '/admin/questions' &&
             pathname !== '/admin/analytics' &&
             pathname !== '/admin/selectimp' &&
             pathname !== '/admin/updatequestion' &&
             pathname !== '/admin/userquestions' &&
             <QuickAction />
            }

            <main className="min-h-screen">
                {children}
            </main>
            
            <Toaster position="bottom-right" />
            
          </ThemeProvider> {/* ✅ FIXED: ThemeProvider ends here */}
          
        </SessionContextProvider>
      </body>
    </html>
  )
}