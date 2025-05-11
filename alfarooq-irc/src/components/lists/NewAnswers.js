'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaDownload, FaShare, FaBookmark, FaBook } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

const AnswerCard = ({ answer }) => (
  <li dir="rtl" className="bg-white p-4 rounded-xl border-2 mt-1 mb-1 border-gray-100 dark:bg-gray-800 transition hover:bg-gray-100 dark:hover:bg-gray-700">
    <Link
      href={`/questions/${answer.id}`}
      className="text-gray-900 dark:text-white font-semibold"
    >
      <div>
        <div className="flex flex-row-reverse justify-between items-center mb-3">
          <span className="text-[12px] font-poppins text-[#6b7280] dark:text-[#6b7280] font-[500] leading-[18px]">
            {new Date(answer.published).toLocaleDateString('ur-PK')}
          </span>
          <span className='text-primary text-[12px] dark:text-primary font-[600] leading-[10px]'>
            سلسلہ نمبر : <span className='font-poppins'>{answer.id}</span>
          </span>
        </div>
        <div className='text-[16px] text-[#111928] dark:text-[#111928] font-[600] leading-[30px] text-right'>
          {answer.title}
        </div>

        {answer.summary && (
          <p className="text-gray-600 text-[14px] dark:text-gray-300 font-[500] mb-3 line-clamp-3 leading-[35px] text-right">
            {answer.summary}
          </p>
        )}

        <div className='flex justify-between items-center'>
          <div className="flex flex-row-reverse gap-4 font-[500] text-[12px] text-[#111928] dark:text-gray-400 justify-end">
            <button className="flex flex-row-reverse items-center gap-2 hover:text-purple-600">
              شیئر کریں <FaShare />
            </button>
            <button className="flex flex-row-reverse items-center gap-2 hover:text-[#1c9753]">
              ڈاؤن لوڈ <FaDownload />
            </button>
            <button className="flex flex-row-reverse items-center gap-2 hover:text-blue-600">
              محفوظ کریں <FaBookmark />
            </button>
          </div>

          {/* <Link href={``}>
            {answer.Assign_T !== null && (
              <div className="flex items-center gap-4 border border-[#FCE96A] bg-[#FDFDEA] px-3 py-1.5 rounded-full text-[13px] font-[500]">
                {answer.Assign_T ? 'تحقیق و تخریج' : 'احکام و مسائل'}
              </div>
            )}
          </Link>
 */}


          <button>
            {answer.Assign_T !== null && (
              <div
                className={[
                  "hover:shadow-md transition duration-300",
                  answer.Assign_T
                    ? "flex items-center gap-4 px-3 py-1.5  rounded-full text-[13px] font-[500] border border-[#FCE96A] bg-[#FDFDEA] text-gray-700 "
                    : "flex items-center gap-4 px-3 py-1.5  rounded-full text-[13px] font-[500] border border-[#9FDCB4] bg-[#E7F6EC] text-[#063]",
                ]}
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

const Pagination = ({ page, setPage, hasNext }) => {
  if (page === 1 && !hasNext) return null;

  return (
    <div className="flex justify-center mt-6" dir="rtl">
      <ul className="flex bg-white rounded-full px-4 py-1 shadow-md border border-gray-100 items-center gap-2 flex-row-reverse">
        <li>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2 font-poppins text-gray-400 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            ›
          </button>
        </li>
        {[page - 1, page, page + 1].filter((p) => p >= 1 && (p <= page || hasNext)).map((pg) => (
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
        <li>
          <button
            onClick={() => setPage((p) => p + 1)}
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

const NewAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [total, setTotal] = useState(0);
  const limit = 4;

  useEffect(() => {
    const fetchAnswers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/questions/recent?page=${page}&limit=${limit}`);
        if (!res.ok) {
          throw new Error('جوابات حاصل نہیں ہو سکے');
        }
        const { data, total } = await res.json();
        setAnswers(data);
        setTotal(total);
        setHasNext(page * limit < total);
      } catch (err) {
        setError(err.message || 'جوابات لوڈ کرنے میں ناکامی۔ دوبارہ کوشش کریں۔');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [page]);

  return (
    <div dir="rtl" className="rounded-[24px] bg-white border border-gray-100 dark:bg-[#11192880] dark:border-[#11192880] shadow-md p-4 pt-8 pb-8 w-1/2 absolute ">
      <div className="flex flex-row-reverse justify-between items-center mb-4 pt-4 pb-4">
        <Link href="/ur/latest">
          <div className="bg-white flex items-center justify-around w-[90px] h-[40px] text-[15px] border-primary text-primary px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-100 transition cursor-pointer">
            <FiExternalLink /> مزید
          </div>
        </Link>
        <h2 className="text-[21px] flex flex-row-reverse justify-between w-[140px] items-center font-[700] text-primary dark:text-white">
          نئے جوابات <FaBook className="text-[28px]" />
        </h2>

      </div>

      {loading ? (
        <p className="text-center text-primary font-medium">لوڈ ہو رہا ہے...</p>
      ) : error ? (
        <p className="text-center text-red-800 font-medium">{error}</p>
      ) : answers.length === 0 ? (
        <p className="text-center text-gray-800 font-medium">کوئی جواب دستیاب نہیں۔</p>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {answers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
          </ul>
          <Pagination page={page} setPage={setPage} hasNext={hasNext} />
        </>
      )}
    </div>
  );
};

export default NewAnswers;
