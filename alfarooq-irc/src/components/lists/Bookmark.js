'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGrid, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';

function BookmarkAccordion({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="bg-white rounded-xl shadow-sm mb-4">
      <div onClick={() => setOpen(v => !v)} className="flex items-center justify-between p-4 cursor-pointer">
        <div className="flex flex-col w-full justify-center items-start gap-2">
          <Link
            href={`/questions/${item.q_id}`}
            className="text-[16px] font-[600] text-[#111928] hover:text-blue-600 transition"
          >
            {item.q_heading}
          </Link>
          <span className="text-[15px] text-gray-500">{item.q_summary?.slice(0, 40)}...</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
          className="p-1 rounded hover:bg-gray-100 transition"
          aria-label={open ? 'Hide details' : 'Show details'}
        >
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {open && (
        <div className="border-t px-4 pb-4 text-gray-700 text-[14px]">
          {item.q_detailed?.slice(0, 200)}...
        </div>
      )}
    </li>
  );
}

export default function BookmarkPanel() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch('/api/bookmark')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load bookmarks');
        return res.json();
      })
      .then(data => {
        setBookmarks(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative max-w-sm font-arabic mx-auto bg-white rounded-2xl shadow-md h-[600px] p-6 pt-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">محفوظ جوابات</h1>
        <button
          onClick={() => router.push('/bookmarks')}
          className="inline-flex items-center gap-1 px-3 py-1.5 border rounded-full hover:bg-gray-100 transition"
        >
          <FiGrid className="text-lg text-blue-600" /> تمام
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
          <Spinner aria-label="Loading bookmarks" size="md" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500">{error}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        <ul>
          {bookmarks.map((item) => (
            <BookmarkAccordion key={item.q_id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
