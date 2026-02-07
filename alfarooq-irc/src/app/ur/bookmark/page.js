'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiHome } from 'react-icons/fi';
import Bookmarks from "@/components/lists/Bookmark";
import SelectedList from "@/components/lists/SelectedList";

export default function BookmarkPage() {
  return (
    <div className="w-full px-4 py-6 lg:max-w-7xl mx-auto font-arabic">
      {/* Breadcrumb nav */}
      <nav className="flex flex-row-reverse items-center gap-4 text-gray-600 text-sm mb-6">
        <Link href="/" className="text-primary hover:text-littleprimary">
          <FiHome />
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700">محفوظ جوابات</span>
      </nav>

      {/* Responsive grid layout */}
      <div dir="rtl" className="grid  grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bookmarks take 3/4 on lg, full on mobile */}
        <div className="w-full lg:col-span-3">
          <Bookmarks />
        </div>

        {/* SelectedList takes 1/4 on lg, full on mobile (stacked) */}
        <div className="w-full lg:col-span-2">
          <SelectedList />
        </div>
      </div>
    </div>
  );
}
