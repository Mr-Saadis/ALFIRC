// src/components/SelectedNewAnswers.js
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FiGrid } from 'react-icons/fi';
import { FaBook } from 'react-icons/fa';
import { Spinner } from 'flowbite-react';
import { BookText } from 'lucide-react';

/* --------------------------------------------------------------------------
 * Card (one selected answer)
 * ------------------------------------------------------------------------ */
const SelectedAnswerCard = ({ answer, onClick, isLoading }) => (
  <li
    dir="rtl"
    className="relative bg-white p-4 pt-2 pb-2 rounded-xl border-2 mb-1 border-gray-100 dark:bg-gray-800 transition hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    {/* per-card loading overlay */}
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
        <div className="flex flex-row-reverse justify-between items-center mb-2">
          <div className='flex flex-row-reverse gap-2 items-center'>
            <span className="text-[12px] font-poppins text-[#6b7280] dark:text-[#6b7280] font-[500] leading-[18px]">
              {new Date(answer.published).toLocaleDateString('ur-PK')}
            </span>
            <span>
              {answer.Assign_T !== null && (
                <span
                  className={[
                    'hover:shadow-md transition duration-300',
                    answer.Assign_T
                      ? 'flex items-center gap-4 px-3 py-1.5 rounded-full text-[11px] font-[400] border border-[#FCE96A] bg-[#FDFDEA] text-gray-700'
                      : 'flex items-center gap-4 px-3 py-1.5 rounded-full text-[11px] font-[400] border border-[#9FDCB4] bg-[#E7F6EC] text-[#063]',
                  ].join(' ')}
                >
                  {answer.Assign_T ? 'تحقیق و تخریج' : 'احکام و مسائل'}
                </span>
              )}
            </span>
          </div>
          <span className="text-primary text-[12px] dark:text-primary font-[600] leading-[10px]">
            سلسلہ نمبر : <span className="font-poppins">{answer.id}</span>
          </span>
        </div>


        {/* title */}
        <div className="text-[16px] text-[#111928] dark:text-[#111928] font-[600] leading-[30px] text-right">
          {answer.title}
        </div>

        {/* optional summary */}
        {answer.summary && (
          <p className="text-gray-600 text-[14px] dark:text-gray-300 font-[500] mb-3 line-clamp-2 leading-[35px] text-right">
            {answer.summary}
          </p>
        )}
      </div>
    </Link>
  </li>
);

/* --------------------------------------------------------------------------
 * Pagination
 * ------------------------------------------------------------------------ */
const Pagination = ({ page, setPage, hasNext }) => {
  if (page === 1 && !hasNext) return null;

  return (
    <div className="flex justify-center mt-6" dir="rtl">
      <ul className="flex bg-white rounded-full px-4 py-1 shadow-md border border-gray-100 items-center gap-2 flex-row-reverse">
        {/* prev */}
        <li>
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2 font-poppins text-gray-400 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </li>

        {/* numbers */}
        {[page - 1, page, page + 1]
          .filter(p => p >= 1 && (p <= page || hasNext))
          .map(pg => (
            <li key={pg}>
              <button
                onClick={() => setPage(pg)}
                className={`px-3 py-1 rounded-md text-sm font-semibold ${pg === page
                  ? 'border-2 border-primary text-primary'
                  : 'text-gray-700'
                  }`}
              >
                {pg}
              </button>
            </li>
          ))}

        {/* next */}
        <li>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasNext}
            className="px-2 font-poppins text-gray-700 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            ‹
          </button>
        </li>
      </ul>
    </div>
  );
};

/* --------------------------------------------------------------------------
 * Main component
 * ------------------------------------------------------------------------ */
const SelectedNewAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingId, setLoadingId] = useState(null);        // card-level spinner
  const limit = 100;

  /* click handler for each card */
  const handleCardClick = useCallback(id => {
    setLoadingId(id);
    // you could fire analytics here
  }, []);

  /* fetch whenever page changes */
  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      setAnswers([]);
      setLoadingId(null);

      try {
        const res = await fetch(
          `/api/questions/CombSelect?page=${page}&limit=${limit}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('جوابات حاصل نہیں ہو سکے');

        const { data, total } = await res.json();
        if (!active) return;

        setAnswers(data);
        setHasNext(page * limit < total);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'جوابات لوڈ کرنے میں ناکامی۔ دوبارہ کوشش کریں۔');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    /* cleanup on unmount / page change */
    return () => {
      active = false;
      controller.abort();
    };
  }, [page]);

  return (
    <div
      dir="rtl"
      className="relative rounded-[24px] min-h-[800px] bg-white border border-gray-100 dark:bg-[#11192880] dark:border-[#11192880] shadow-md p-4 pt-4 pb-4 min-w-full"
    >
      {/* header */}
      <div className="flex flex-row-reverse justify-end items-center mb-4 pt-4 pb-4">
        <h2 className="text-[19px] flex flex-row-reverse justify-between w-[120px] items-center font-[700] text-primary dark:text-white">
          اہم سوالات <BookText className="text-[25px]" />
        </h2>
      </div>

      {/* overlay states */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-2xl">
          <Spinner aria-label="Loading selected answers" size="md" className="text-blue-300" />
        </div>
      )}
      {!loading && error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500 text-lg">{error}</span>
        </div>
      )}

      {/* content */}
      {!loading && !error && (
        <>
          {answers.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {answers.map(ans => (
                <SelectedAnswerCard
                  key={ans.id}
                  answer={ans}
                  onClick={() => handleCardClick(ans.id)}
                  isLoading={loadingId === ans.id}
                />
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
              کوئی جواب دستیاب نہیں۔
            </p>
          )}

          <Pagination page={page} setPage={setPage} hasNext={hasNext} />
        </>
      )}
    </div>
  );
};

export default SelectedNewAnswers;
