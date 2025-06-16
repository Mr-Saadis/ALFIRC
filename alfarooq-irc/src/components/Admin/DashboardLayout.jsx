'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast }  from 'sonner'
import { FiLogOut } from 'react-icons/fi'

import Link from 'next/link';
import {
  Home as HomeIcon,
  LayoutList,
  Layers3,
  BookOpen,
  Folder,
  HelpCircle,
  ThumbsUp,
  Search,
  Bookmark,
} from 'lucide-react';
import SignOutButton from '../auth/SignOutButton';


export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast.error('Sign-out failed: ' + error.message)
      return
    }

    toast.success('Signed out successfully')
    router.replace(redirectTo)    // go home (or login) after sign-out
  }


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="fixed md:relative z-20"
      />
  <div dir="rtl" className="font-arabic">
        <aside className="fixed left-1/2 bottom-0  z-40 flex -translate-x-1/2 -translate-y-1/2 gap-2 text-sm lg:hidden">
       
          <QuickAction icon={HomeIcon} label="سرآغاز" href="/admin" />
          {/* <QuickAction icon={Search} label="تلاش" href="/ur/search" /> */}
          <QuickAction icon={LayoutList} label="NewQuesrions" href="/admin/questions" />
          {/* <QuickAction icon={FiLogOut} label="SignOut" onClick={handleSignOut} /> */}
          
          {/* <QuickAction icon={BookOpen} label="تازہ جوابات" href="/ur/latest" />
          <QuickAction icon={Bookmark} label="محفوظ جوابات" href="/ur/bookmark" />
          <QuickAction icon={HelpCircle} label="سوال پوچھیں" href="/ask" />
          */}
        </aside>
        
    </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4 pb-[100px]">
          {children}
        </main>
      </div>
    </div>
  )
}




function QuickAction({ href = '#', label, icon: Icon }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="lg:relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link
        href={href}
        aria-label={label}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-muted bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Icon className="h-5 w-5" />
      </Link>

      {/* Animated tooltip */}
      <div
        className={`absolute top-1/2 right-full mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-3 py-1 text-xs text-gray-700 shadow-md z-50 transition-opacity duration-200 ease-in-out
          ${showTooltip ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {label}
      </div>
    </div>
  );
}


