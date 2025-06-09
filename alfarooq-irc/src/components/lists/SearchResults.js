// src/components/lists/SearchResults.js
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiHome,
  FiGrid,
  FiDownload,
  FiShare,
  FiBookmark,
  FiSearch,
} from 'react-icons/fi';
import { FaBook } from 'react-icons/fa';
import { Spinner } from 'flowbite-react';

/* ───────────────────────────────────────── Answer card ──────────────────────────────────── */
function AnswerCard({ answer, isLoading, onClick }) {
  return (
    <li
      dir="rtl"
      className="relative bg-white p-4 rounded-xl border-2 mt-1 mb-1 border-gray-100 dark:bg-gray-800 transition hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
          <Spinner size="sm" />
        </div>
      )}

      <Link
        href={`/questions/${answer.id}`}
        onClick={onClick}
        className="text-gray-900 dark:text-white font-semibold"
      >
        <div>
          {/* meta row */}
          <div className="flex flex-row-reverse justify-between items-center mb-3">
            <span className="text-[12px] text-[#6b7280] font-[500] leading-[18px]">
              {new Date(answer.published).toLocaleDateString('ur-PK')}
            </span>
            <span className="text-primary text-[12px] font-[600] leading-[10px]">
              سلسلہ نمبر : <span className="font-poppins">{answer.id}</span>
            </span>
          </div>

          {/* title */}
          <div className="text-[16px] text-[#111928] font-[600] leading-[30px] text-right">
            {answer.title}
          </div>

          {/* summary */}
          {answer.summary && (
            <p className="text-gray-600 text-[14px] font-[500] mb-3 line-clamp-3 leading-[35px] text-right">
              {answer.summary}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}

/* ───────────────────────────────────────── Pagination ───────────── */
function Pagination({ page, setPage, hasNext }) {
  if (page === 1 && !hasNext) return null;

  return (
    <div className="flex justify-center mt-6" dir="rtl">
      <ul className="flex bg-white rounded-full px-4 py-1 shadow-md border border-gray-100 items-center gap-2 flex-row-reverse">
        <li>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2 text-gray-400 hover:text-blue-800 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </li>

        {[page - 1, page, page + 1]
          .filter((p) => p >= 1 && (p <= page || hasNext))
          .map((pg) => (
            <li key={pg}>
              <button
                onClick={() => setPage(pg)}
                className={`px-3 py-1 rounded-md text-sm font-semibold ${
                  pg === page
                    ? 'border-2 border-primary text-primary'
                    : 'text-gray-700'
                }`}
              >
                {pg}
              </button>
            </li>
          ))}

        <li>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext}
            className="px-2 text-gray-700 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            ‹
          </button>
        </li>
      </ul>
    </div>
  );
}

/* ───────────────────────────────────────── Main list ─────────────── */
export default function SearchResults() {
  const searchParams         = useSearchParams();
  const router               = useRouter();
  const query                = searchParams.get('q') ?? '';
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [page, setPage]       = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const limit = 100;

  // Start new search when query changes
  useEffect(() => { setPage(1); }, [query]);

  // Click handler to show spinner on clicked card
  const onCardClick = useCallback((id) => setLoadingId(id), []);

  useEffect(() => {
    if (!query.trim()) return;

    let active = true;
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('نتائج حاصل نہیں ہو سکے');

        const { data, total } = await res.json();
        if (!active) return;

        setAnswers(data);
        setHasNext(page * limit < total);
        setLoadingId(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => {
      active = false;
      controller.abort();
    };
  }, [query, page]);

  /* empty query UI */
  if (!query.trim()) {
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
        
      {/* Header */}
      <div className="flex flex-row-reverse justify-between items-center mb-4">
        <h2 className="text-[21px] flex flex-row-reverse items-center gap-2 font-[700] text-primary">
          “{query}” کے نتائج <FiSearch className="text-xl" />
        </h2>

        <button
          onClick={() => router.push('/ur/latest')}
          className="inline-flex items-center px-3 gap-2 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition"
        >
          مزید <FiGrid className="text-lg text-blue-600" />
        </button>
      </div>

      {/* Overlays */}
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

      {/* Results */}
      {!loading && !error && (
        <>
          {answers.length ? (
            <ul className="flex flex-col gap-4">
              {answers.map((ans) => (
                <AnswerCard
                  key={ans.id}
                  answer={ans}
                  isLoading={loadingId === ans.id}
                  onClick={() => onCardClick(ans.id)}
                />
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">
              کوئی نتیجہ نہیں ملا۔
            </p>
          )}

          <Pagination page={page} setPage={setPage} hasNext={hasNext} />
        </>
      )}
    </div>
  );
}
