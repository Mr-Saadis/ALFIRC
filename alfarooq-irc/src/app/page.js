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
} from 'lucide-react';

import Category from '@/components/lists/Category';
import NewAnswers from '@/components/lists/NewAnswers';
import SelectedList from '@/components/lists/SelectedList';

/* -------------------------------------------------------------------------- */
/*  Utility: Icon button with animated tooltip                                */
/* -------------------------------------------------------------------------- */
// function QuickAction({ href = '#', label, icon: Icon }) {
//   const [showTooltip, setShowTooltip] = useState(false);

//   return (
//     <div
//       className="relative group"
//       onMouseEnter={() => setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       <Link
//         href={href}
//         aria-label={label}
//         className="flex h-10 w-10 items-center justify-center rounded-lg border border-muted bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
//       >
//         <Icon className="h-5 w-5" />
//       </Link>

//       {/* Animated tooltip */}
//       <div
//         className={`absolute top-1/2 right-full mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-3 py-1 text-xs text-gray-700 shadow-md z-50 transition-opacity duration-200 ease-in-out
//           ${showTooltip ? 'opacity-100' : 'opacity-0'}
//         `}
//       >
//         {label}
//       </div>
//     </div>
//   );
// }

/* -------------------------------------------------------------------------- */
/*  Search bar – centered & responsive                                        */
/* -------------------------------------------------------------------------- */
function SearchBar() {
  return (
    <form
      action="/search"
      className="relative mx-auto flex w-full max-w-xl items-center"
    >
      <input
        dir="rtl"
        name="q"
        placeholder="تلاش کریں …"
        className="w-full rounded-full border border-muted bg-background px-4 py-2 pr-10 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
      />
      <button
        type="submit"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 4.65a7.5 7.5 0 0011.998 11.998z"
          />
        </svg>
      </button>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating “Ask Question” button                                            */
/* -------------------------------------------------------------------------- */
function AskQuestionBtn() {
  return (
    <Link
      href="/ask"
      className="inline-flex items-center gap-1 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
    >
      سوال پوچھیں
    </Link>
  );
}

/* ========================================================================== */
/*  Home page                                                                 */
/* ========================================================================== */
export default function HomePage() {
  return (
    <div dir="rtl" className="font-arabic">
      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar: Categories */}
        <aside className="hidden lg:block">
          <Category />
        </aside>

        {/* Center: Latest answers */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
            <LayoutList className="h-5 w-5" /> تازہ ترین جوابات
          </h2>
          <NewAnswers />
          <SelectedList />
        </section>

        {/* Vertical quick bar with tooltips */}
        {/* <aside className="fixed right-4 z-40 hidden lg:flex flex-col items-top gap-3">
          <QuickAction icon={HomeIcon} label="سرآغاز" href="/" />
          <QuickAction icon={LayoutList} label="زمرہ جات" href="/categories" />
          <QuickAction icon={Layers3} label="تازہ جوابات" href="/latest" />
          <QuickAction icon={BookOpen} label="کتب" href="/books" />
          <QuickAction icon={Folder} label="فتوی" href="/fatwa" />
          <QuickAction icon={HelpCircle} label="سوال پوچھیں" href="/ask" />
          <QuickAction icon={ThumbsUp} label="پسندیدہ" href="/favorites" />
        </aside> */}
      </main>
    </div>
  );
}
