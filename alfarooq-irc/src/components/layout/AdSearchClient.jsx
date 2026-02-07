'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

import SearchBar from "@/components/search/SearchBar";
import FilterPanel from '@/components/search/FilterPanel';
import SearchResults from "@/components/lists/AdvanceSearchResults";

export default function SearchPage() {
  const [filters, setFilters] = useState({ q: '', category: [], subcategory: [] });

  return (
    <div className="lg:max-w-6xl font-arabic max-w-4xl mx-auto px-4 py-6 space-y-6">
      <nav className="flex flex-row-reverse items-center gap-4 text-gray-600 text-sm">
        <Link href="/" className="text-primary"><FiHome /></Link>
      </nav>
      <section className='flex flex-col justify-center items-center mb-6'>
          <h1 className='text-2xl font-bold text-center mb-4'>پیشرفته تلاش</h1>
          <p className='text-gray-600 text-center mb-4'>اپنے سوالات کے جوابات تلاش کرنے کے لیے فلٹرز کا استعمال کریں</p>
          <p className='text-gray-600 text-center mb-4'>صرف اردو اور رومن اردو میں سوالات لکھیں</p>
      <SearchBar onSearch={({ q }) => setFilters((f) => ({ ...f, q }))} />
        </section>
      <div className='flex w-full mb-6 lg:flex-row flex-col'>
        <div className='min-w-1/4 p-5'>
      <FilterPanel filters={filters} onChange={(upd) => setFilters((f) => ({ ...f, ...upd }))} />
        
        </div>
        <div className='min-w-3/4 p-5'>
      <SearchResults filters={filters} />
        </div>
      </div>



    </div>
  );
}
