'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiGrid, FiSearch } from 'react-icons/fi';
import { Spinner } from 'flowbite-react';
import { supabase } from '@/lib/supabase';

const AnswerCard = ({ a, loadingId, onClick }) => (
  <li
    dir="rtl"
    className="relative bg-white p-4 rounded-xl border-2 mt-1 mb-1 border-gray-100 dark:bg-gray-800 transition hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    {loadingId === a.q_id && (
      <div className="absolute inset-0 bg-white/50 flex justify-center items-center rounded-xl">
        <Spinner size="sm" />
      </div>
    )}
    <Link
      href={`/questions/${a.q_id}`}
      onClick={() => onClick(a.q_id)}
      className="text-gray-900 dark:text-white font-semibold"
    >
      <div>
        <div className="flex flex-row-reverse justify-between items-center mb-3">
          <span className="text-[12px] text-[#6b7280] font-[500] leading-[18px]">
            {new Date(a.published_at).toLocaleDateString('ur-PK')}
          </span>
          <span className="text-primary text-[12px] font-[600] leading-[10px]">
            سلسلہ نمبر : <span className="font-poppins">{a.q_id}</span>
          </span>
        </div>

        <div className="text-[16px] text-[#111928] font-[600] leading-[30px] text-right">
          {a.q_heading}
        </div>

        {a.ans_summary && (
          <p className="text-gray-600 text-[14px] font-[500] mb-3 line-clamp-3 leading-[35px] text-right">
            {a.ans_summary}
          </p>
        )}
      </div>
    </Link>
  </li>
);

export default function SearchResults({ filters }) {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onClickItem = useCallback((id) => setLoadingId(id), []);

  useEffect(() => {
    if (!filters.q?.trim()) return;

    let active = true;
    setLoading(true);
    setError('');

    async function runSearch() {
      const { data, error } = await supabase.rpc('search_qna_advanced', {
        search_term: filters.q,
        category_arr: filters.category,
        subcategory_arr: filters.subcategory
      });

      if (!active) return;
      if (error) setError(error.message);
      else setResults(data || []);
      setLoading(false);
    }

    runSearch();
    return () => { active = false; };
  }, [filters]);

  if (!filters.q?.trim()) {
    return (
      <div className="text-center text-gray-500 mt-10" dir="rtl">
        تلاش کیلئے اوپر خانہ استعمال کریں۔
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="relative rounded-[24px] bg-white border border-gray-100 dark:bg-[#11192880] dark:border-[#11192880] shadow-md p-4 pt-8 pb-8"
    >
      <div className="flex flex-row-reverse justify-end items-center mb-4">
        <h2 className="text-[21px] flex flex-row-reverse items-center gap-2 font-[700] text-primary">
          “{filters.q}” کے نتائج <FiSearch className="text-xl" />
        </h2>

        {/* <button
          onClick={() => router.push('/ur/latest')}
          className="inline-flex items-center px-3 gap-2 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition"
        >
          مزید <FiGrid className="text-lg text-primary" />
        </button> */}
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-2xl">
          <Spinner size="md" className="text-blue-300" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-600 font-medium">{error}</span>
        </div>
      )}

      {!loading && !error && (results.length ? (
        <ul className="flex flex-col gap-4">
          {results.map((a) => (
            <AnswerCard key={a.q_id} a={a} loadingId={loadingId} onClick={onClickItem} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          کوئی نتیجہ نہیں ملا۔
        </p>
      ))}
    </div>
  );
}
