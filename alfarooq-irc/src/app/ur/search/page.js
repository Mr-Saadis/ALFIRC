'use client';
import SearchResults from '@/components/lists/SearchResults';
import Link from 'next/link';
import {
    FiHome,
} from 'react-icons/fi';

export default function SearchPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* the central search bar is already in your Header; keep page simple */}
      <nav className="text-sm mb-4 font-urdutype flex flex-row-reverse items-center gap-4 text-gray-600 ">
              <Link href={`/`} className="text-[#3333cc] hover:text-[#3333cc]">
                <FiHome className="inline-block" />
              </Link>{' '}
              {/* &gt;{' '}
              <Link
                href={`/categories/${'search'}`}
                className="hover:text-[#3333cc]"
              >
               Saad
              </Link>{' '} */}
            </nav>
      <SearchResults />
    </div>
  );
}
