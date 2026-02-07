'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  FiGrid,
  FiRefreshCw, 
} from 'react-icons/fi';
import { Spinner } from 'flowbite-react';
import { BookTextIcon } from 'lucide-react';

const AnswerCard = ({ answer, isLoading, onClick }) => (
  <li
    dir="rtl"
    className="relative bg-white p-4 pt-2 pb-2 rounded-xl border-2 mb-1 border-gray-100 dark:bg-gray-800 transition hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    {isLoading && (
      <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl z-10">
        <Spinner size="sm" />
      </div>
    )}
    <Link
      href={`/questions/${answer.id}`}
      onClick={onClick}
      className="text-gray-900 dark:text-white font-semibold"
    >
      <div>
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
        <div className="text-[16px] text-[#111928] dark:text-[#111928] font-[600] leading-[30px] text-right">
          {answer.title}
        </div>
        {answer.summary && (
          <p className="text-gray-600 text-[14px] dark:text-gray-300 font-[500] mb-1 line-clamp-2 leading-[35px] text-right">
            {answer.summary}
          </p>
        )}
      </div>
    </Link>
  </li>
);

const Pagination = ({ page, setPage, hasNext }) => {
  if (page === 1 && !hasNext) return null;

  return (
    <div className="flex justify-center mt-6" dir="rtl">
      <ul className="flex bg-white rounded-full px-4 py-1 shadow-md border border-gray-100 items-center gap-2 flex-row-reverse">
        <li>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2 font-poppins text-gray-400 hover:text-littleprimary disabled:cursor-not-allowed disabled:text-gray-400"
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
                className={`px-3 py-1 rounded-md text-sm font-semibold ${pg === page ? 'border-2 border-primary text-primary' : 'text-gray-700'
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
            className="px-2 font-poppins text-gray-700 hover:text-littleprimary disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            ‹
          </button>
        </li>
      </ul>
    </div>
  );
};

const RandomAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 
  
  // Create a persistent seed that doesn't change on re-renders, only on explicit refresh
  const seedRef = useRef(Math.random().toString(36).substring(7));
  
  const limit = 6;

  const onCardClick = useCallback((id) => {
    setLoadingId(id);
  }, []);

  // Function to generate a new seed and reset to page 1
  const handleShuffle = () => {
    seedRef.current = Math.random().toString(36).substring(7);
    setPage(1);
    setRefreshKey(prev => prev + 1); 
  };

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    async function fetchAnswers() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `/api/questions/random?page=${page}&limit=${limit}&seed=${seedRef.current}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('جوابات حاصل نہیں ہو سکے');
        }

        const json = await response.json();
        if (!isActive) return;

        const { data, total: totalCount } = json;
        setAnswers(data);
        setHasNext(page * limit < totalCount);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'جوابات لوڈ کرنے میں ناکامی۔ دوبارہ کوشش کریں۔');
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchAnswers();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [page, refreshKey]); 

  return (
    <div
      dir="rtl"
      className="rounded-[24px] bg-white border min-h-[800px] border-gray-100 dark:bg-[#11192880] dark:border-[#11192880] shadow-md p-4 pt-4 pb-4 min-w-full relative"
    >
      {/* Header */}
      <div className="flex flex-row-reverse justify-between items-center mb-4 pt-4 pb-4">
        <div className="flex gap-2">
            <Link href="/ur/latest">
                <button className="inline-flex items-center px-3 w-[90px] justify-center gap-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition">
                    <FiGrid className="text-lg text-primary" />
                    مزید
                </button>
            </Link>
            
            {/* Shuffle Button */}
            <button 
                onClick={handleShuffle}
                title="نئی ترتیب (Shuffle)"
                className="inline-flex items-center justify-center w-[40px] h-[35px] border border-gray-300 rounded-full hover:bg-gray-100 transition text-gray-600"
            >
                <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>

        <h2 className="text-[19px] flex flex-row-reverse justify-end gap-2 items-center font-[700] text-primary dark:text-white">
          منتخب سوالات <BookTextIcon className="text-[25px]" />
        </h2>
      </div>

      {/* Loading Overlay */}
      {loading && (
         <div className="absolute inset-0 top-[80px] z-10 flex items-center justify-center bg-white/60 rounded-2xl dark:bg-gray-900/60">
            <Spinner aria-label="Loading answers" size="lg" className="text-primary fill-primary" />
         </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button onClick={handleShuffle} className="text-primary underline text-sm">
                دوبارہ کوشش کریں
            </button>
          </div>
        </div>
      )}

      {/* Answers List & Pagination */}
      {!error && (
        <>
          {answers.length > 0 ? (
            <ul className={`flex flex-col gap-4 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  isLoading={loadingId === answer.id}
                  onClick={() => onCardClick(answer.id)}
                />
              ))}
            </ul>
          ) : (
            !loading && (
                <p className="text-center text-gray-600 dark:text-gray-300 font-medium mt-10">
                کوئی جواب دستیاب نہیں۔
                </p>
            )
          )}

          <Pagination page={page} setPage={setPage} hasNext={hasNext} />
        </>
      )}
    </div>
  );
};

export default RandomAnswers;