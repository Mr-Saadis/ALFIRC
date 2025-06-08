'use client';

import { useState } from 'react';
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
} from 'lucide-react';

function QuickAction({ href = '#', label, icon: Icon }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative group"
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
export default function QuickActionBar() {
  return (
    <div dir="rtl" className="font-arabic">
      <aside className="fixed right-4 z-40 hidden lg:flex flex-col items-top gap-6">
       
          <QuickAction icon={HomeIcon} label="سرآغاز" href="/" />
          <QuickAction icon={Search} label="تلاش" href="/ur/search" />
          <QuickAction icon={LayoutList} label="زمرہ جات" href="/categories" />
          <QuickAction icon={Layers3} label="تازہ جوابات" href="/latest" />
          <QuickAction icon={BookOpen} label="کتب" href="/books" />
          <QuickAction icon={Folder} label="فتوی" href="/fatwa" />
          <QuickAction icon={HelpCircle} label="سوال پوچھیں" href="/ask" />
          <QuickAction icon={ThumbsUp} label="پسندیدہ" href="/favorites" />
         
        </aside>
        
    </div>
  );
}
