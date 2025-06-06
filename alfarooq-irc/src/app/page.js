// src/app/page.js
'use client';

import { Suspense }   from 'react';
import NewAnswers     from '@/components/lists/NewAnswers';
import SelectedList   from '@/components/lists/SelectedList';
import Category       from '@/components/lists/Category';

export default function Home() {
  return (
    <main
      dir="rtl"
      /* right-padding keeps content clear of the fixed sidebar on md+ */
      className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 font-arabic md:pr-56"
    >
      {/* ───────── Ask-question button ───────── */}
      <div className="flex justify-center mt-6 mb-8">
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-2 rounded-full shadow hover:bg-primary/90 transition"
        >
          نیا سوال پوچھیں
        </button>
      </div>

      {/* ───────── Responsive grid layout ───────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Categories rail (right in RTL; full-width on ≤sm) */}
        <aside
          className="order-1 md:order-1 md:col-span-4 lg:col-span-3
                     max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <Suspense fallback={null}>
            <Category />
          </Suspense>
        </aside>

        {/* Main column */}
        <section
          className="order-2 md:order-2 md:col-span-8 lg:col-span-6
                     space-y-10"
        >
          <Suspense fallback={null}>
            <SelectedList />
            <NewAnswers />
          </Suspense>
        </section>

        {/* Extra rail (widgets / ads) */}
        <aside className="hidden lg:block lg:col-span-3 order-3">
          {/* widgets / ads */}
        </aside>
      </div>
    </main>
  );
}
