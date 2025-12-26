// //app
// import { Geist, Geist_Mono ,IBM_Plex_Sans,Poppins, Noto_Nastaliq_Urdu } from "next/font/google";
// import "./globals.css";
// import Header from "@/components/layout/Header";
// import { Toaster } from "sonner";
// import { ThemeProvider } from "next-themes";
// import Navbar from "@/components/navbar";

// import Sidebar from "@/components/Sidebar";
// import QuickActionBar from "@/components/layout/QuickAction";


// const geistSans = Geist({
//   variable: "--font-Poppins",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-Geist-Mono",
//   subsets: ["latin"],
// });
// const notonastaliqurdurdu = Noto_Nastaliq_Urdu({
//   variable: "--font-Noto-Nastaliq-Urdu",
//   subsets: ["arabic"],
//   weight: [ "400", "500", "600", "700"],
// });
// const poppins = Poppins({
//   variable: "--font-Poppins",
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   display: "swap",
// });

// export const metadata = {
//   title: "Al-Farooq IRC",
//   description: "Al-Farooq Islamic Research Center",
//   icons: {
//     icon: "/favicon.ico",
//     shortcut: "/favicon.ico",
//     apple: "/favicon.ico",
//   },
// };

// export default function RootLayout({ children }) {
  
//   return (
//     <html lang="ur">
//       <body
//         className={` ${poppins.variable} ${poppins.variable} antialiased`}
//       >
//         {/* <Header/> */}
//          <Navbar/>
//         <QuickActionBar/>
//          <Sidebar />
//         {/* <ThemeProvider attribute="class" defaultTheme="light">  */}
//         <main className="bg-gray-50 min-h-screen">

//         {children}
//         <Toaster position="bottom-right" />
//         </main>
//          {/* </ThemeProvider> */}
//       </body>
//     </html>
//   );
// }





// src/app/layout.js
'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Poppins } from "next/font/google";
import { supabase }               from '@/lib/supabase'
import './globals.css'
import Navbar        from '@/components/navbar'
import Sidebar       from '@/components/Sidebar'
import QuickAction   from '@/components/layout/QuickAction'
import { Toaster }   from 'sonner'
import { usePathname } from 'next/navigation'



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
      <body className={` ${poppins.variable} bg-gray-50 ${poppins.variable} antialiased`} suppressHydrationWarning={true}>
        
        <SessionContextProvider supabaseClient={supabase}>
          <Navbar />
          {pathname !== '/admin' &&
           pathname !== '/admin/questions' &&
           pathname !== '/admin/analytics' &&
           pathname !== '/admin/selectimp' &&
           pathname !== '/admin/updatequestion' &&
           pathname !== '/admin/userquestions' &&
           <QuickAction />}
          <Sidebar />
          

          <main className="min-h-screen">{children}</main>
          <Toaster position="bottom-right" />
        </SessionContextProvider>
      </body>
    </html>
  )
}