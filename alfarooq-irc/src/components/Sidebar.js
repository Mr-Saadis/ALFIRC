// src/components/Sidebar.js
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Moon, Sun, User2, ListChecks, ClipboardList,
  BookOpen, Feather, MessageCircleQuestion, Send, Menu,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

/* ───────── Single link row ───────── */
function Item({ href, icon: Icon, label, onClick }) {
  return (
    <Link
      href={href}
      dir="rtl"
      onClick={onClick}
      className="flex items-center justify-between py-3 px-3 rounded-lg
                 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <span className="text-sm font-medium">{label}</span>
      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </Link>
  );
}

/* ───────── Dark / light toggle ───────── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center justify-center w-10 h-10 rounded-lg
                 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200
                 dark:hover:bg-gray-700 transition"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark'
        ? <Sun  className="w-5 h-5 text-yellow-400" />
        : <Moon className="w-5 h-5 text-gray-600"   />}
    </button>
  );
}

/* ───────── Main component ───────── */
export default function Sidebar() {
  const menu = [
    { href: '/authors',    icon: User2,        label: 'سیرۃ مؤلف' },
    { href: '/categories', icon: ListChecks,   label: 'زمرہ جات' },
    { href: '/answers',    icon: ClipboardList,label: 'حاصل شدہ جوابات' },
    { href: '/topics',     icon: BookOpen,     label: 'مضامین' },
    { href: '/books',      icon: Feather,      label: 'کتب' },
    { href: '/fatwa',      icon: Send,         label: 'فتویٰ' },
    { href: '/ask',        icon: MessageCircleQuestion, label: 'سوال کریں' },
  ];

  /* Re-usable for rail & drawer */
  const list = (close) => (
    <>
      <div className="flex items-center justify-center py-6">
        <ThemeToggle />
      </div>

      <nav className="space-y-1 px-2">
        {menu.map((m) => (
          <Item key={m.href} {...m} onClick={close} />
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* ───────── Desktop fixed rail ───────── */}
      {/* <aside
        dir="rtl"
        className="hidden md:flex flex-col fixed top-20 font-arabic right-0
                   h-screen w-56 border-l border-gray-200 dark:border-gray-800
                   bg-white dark:bg-[#101827] z-40"
      >
        {list()}
      </aside> */}

      {/* ───────── Drawer (now triggered on ALL sizes) ───────── */}
      <Sheet>
        <SheetTrigger asChild>
          {/* ⬇️  removed `md:hidden` so the button shows everywhere */}
          <Button
            size="icon"
            variant="outline"
            className="fixed top-4 right-4 z-50"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-56 p-0 border-l border-gray-200 dark:border-gray-800"
        >
          {/* Required for a11y — prevents Radix warning */}
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="font-semibold">مینو</SheetTitle>
          </SheetHeader>

          {list(() => document.activeElement?.blur())}
        </SheetContent>
      </Sheet>
    </>
  );
}
