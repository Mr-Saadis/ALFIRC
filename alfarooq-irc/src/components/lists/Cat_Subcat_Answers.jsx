'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FiGrid } from 'react-icons/fi';
import { FaBook } from 'react-icons/fa';
import { Spinner } from 'flowbite-react';
import { BookText } from 'lucide-react';

const AnswerCard = ({ answer, isLoading, onClick }) => (
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
        <div className="flex flex-row-reverse justify-between items-center mb-3">
          <span className="text-[12px] font-poppins text-[#6b7280] dark:text-[#6b7280] font-[500] leading-[18px]">
            {new Date(answer.published).toLocaleDateString('ur-PK')}
          </span>
          <span className="text-primary text-[12px] dark:text-primary font-[600] leading-[10px]">
            سلسلہ نمبر : <span className="font-poppins">{answer.id}</span>
          </span>
        </div>
        <div className="text-[16px] text-[#111928] dark:text-[#111928] font-[600] leading-[30px] text-right">
          {answer.title}
        </div>
        {answer.summary && (
          <p className="text-gray-600 text-[14px] dark:text-gray-300 font-[500] mb-3 line-clamp-3 leading-[35px] text-right">
            {answer.summary}
          </p>
        )}
        <div className="flex justify-between items-center">
          <button>
            {answer.Assign_T !== null && (
              <div
                className={[
                  'hover:shadow-md transition duration-300',
                  answer.Assign_T
                    ? 'flex items-center gap-4 px-3 py-1.5 rounded-full text-[13px] font-[500] border border-[#FCE96A] bg-[#FDFDEA] text-gray-700'
                    : 'flex items-center gap-4 px-3 py-1.5 rounded-full text-[13px] font-[500] border border-[#9FDCB4] bg-[#E7F6EC] text-[#063]',
                ].join(' ')}
              >
                {answer.Assign_T ? 'تحقیق و تخریج' : 'احکام و مسائل'}
              </div>
            )}
          </button>
        </div>
      </div>
    </Link>
  </li>
);

// const Pagination = ({ page, setPage, hasNext }) => {
//   if (page === 1 && !hasNext) return null;

//   return (
//     <div className="flex justify-center mt-6" dir="rtl">
//       <ul className="flex bg-white rounded-full px-4 py-1 shadow-md border border-gray-100 items-center gap-2 flex-row-reverse">
//         <li>
//           <button
//             onClick={() => setPage((p) => Math.max(p - 1, 1))}
//             disabled={page === 1}
//             className="px-2 font-poppins text-gray-400 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-400"
//           >
//             ›
//           </button>
//         </li>
//         {[page - 1, page, page + 1]
//           .filter((p) => p >= 1 && (p <= page || hasNext))
//           .map((pg) => (
//             <li key={pg}>
//               <button
//                 onClick={() => setPage(pg)}
//                 className={`px-3 py-1 rounded-md text-sm font-semibold ${
//                   pg === page ? 'border-2 border-primary text-primary' : 'text-gray-700'
//                 }`}
//               >
//                 {pg}
//               </button>
//             </li>
//           ))}
//         <li>
//           <button
//             onClick={() => setPage((p) => p + 1)}
//             disabled={!hasNext}
//             className="px-2 font-poppins text-gray-700 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
//           >
//             ‹
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// };

const Cat_Subcat_Answers = ({ catId, subcatId, Assign_T }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const limit = Infinity;

  // Memoize click handler for answer cards
  const onCardClick = useCallback((id) => {
    setLoadingId(id);
  }, []);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    async function fetchAnswers() {
      setLoading(true);
      setError(null);
      setAnswers([]);

      try {
        let url = `/api/questions/bySubcategory?page=${page}&limit=${limit}`;
        if (catId) url += `&catId=${catId}`;
        if (subcatId) url += `&subcatId=${subcatId}`;
        if (Assign_T !== undefined) url += `&assign=${Assign_T}`;

        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error('جوابات حاصل نہیں ہو سکے');
        }

        const json = await response.json();
        if (!isActive) return; // avoid state updates if unmounted

        const { data, total } = json;
        setAnswers(data);
        setHasNext(page * limit < total);
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
  }, [page, catId, subcatId]);

  return (
    <div
      dir="rtl"
      className="rounded-[24px] bg-white border border-gray-100 dark:bg-[#11192880] dark:border-[#11192880] shadow-md p-4 pt-5 pb-6 min-w-full"
    >
      {/* Header */}
      <div className="flex flex-row-reverse justify-end items-center mb-4 pt-4 pb-4">
        
        <h2 className="text-[21px] flex flex-row-reverse justify-between w-[90px] items-center font-[700] text-primary dark:text-white">
        جوابات <BookText className="text-[25px]" />
        </h2>
      </div>

      {/* Loading / Error Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/50 min-w-full">
          <Spinner aria-label="Loading answers" size="md" className="text-blue-300" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500 text-lg">{error}</span>
        </div>
      )}

      {/* Answers List & Pagination (only show if no loading/error) */}
      {!loading && !error && (
        <>
          {answers.length > 0 ? (
            <ul className="flex flex-col gap-4">
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
            <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
              کوئی جواب دستیاب نہیں۔
            </p>
          )}

          {/* <Pagination page={page} setPage={setPage} hasNext={hasNext} /> */}
        </>
      )}
    </div>
  );
};

export default Cat_Subcat_Answers;
