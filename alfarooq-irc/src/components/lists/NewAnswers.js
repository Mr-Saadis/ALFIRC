'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaDownload, FaShare, FaBookmark, FaBook } from 'react-icons/fa';

import { FiExternalLink, FiBook, } from 'react-icons/fi';

const AnswerCard = ({ answer }) => (
  <li className="bg-white p-4 rounded-xl border-2 mt-1 mb-1 border-gray-100 dark:bg-gray-800 transition hover:bg-gray-100 dark:hover:bg-gray-700">
    <Link
      href={`/api/questions/${answer.id}`}
      className="text-gray-900 dark:text-white font-semibold"
    >
      <div>
        <div className="flex justify-between items-center mb-3">

          <span className='text-[14px] text-[#111928] dark:text-[#111928] font-[600] leading-[21px]'>
            {answer.title}</span>

          <span className="text-[12px] text-[#6b7280] dark:text-[#6b7280] font-[700] leading-[18px]">
            {new Date(answer.published).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-600 text-[12px] dark:text-gray-300 text-sm mb-3 line-clamp-3">
          {answer.summary || 'No summary available.'}
        </p>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <button className="flex items-center gap-2 hover:text-blue-600">
            <FaBookmark /> Save
          </button>
          <button className="flex items-center gap-2 hover:text-green-600">
            <FaDownload /> Download
          </button>
          <button className="flex items-center gap-2 hover:text-purple-600">
            <FaShare /> Share
          </button>
        </div>
      </div>
    </Link>
  </li>
);

const Pagination = ({ page, setPage, hasNext }) => {
  if (page === 1 && !hasNext) return null;

  return (
    <div className="flex justify-center mt-6">
      <ul className="flex bg-white rounded-full px-4 py-1 shadow-md border border-gray-100 items-center gap-2">
        <li>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2 text-gray-400 disabled:cursor-not-allowed"
          >
            ‹
          </button>
        </li>
        {[page - 1, page, page + 1].filter((p) => p >= 1 && (p <= page || hasNext)).map((pg) => (
          <li key={pg}>
            <button
              onClick={() => setPage(pg)}
              className={`px-3 py-1 rounded-md text-sm font-semibold ${pg === page
                  ? 'border-2 border-green-600 text-green-600'
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
            disabled={hasNext===false}
            className="px-2 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            ›
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
  const limit = 1;

  useEffect(() => {
    const fetchAnswers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/questions/recent?page=${page}&limit=${limit}`);
        if (!res.ok) {
          throw new Error('Failed to fetch answers');
        }
        const { data, total } = await res.json();
        setAnswers(data);
        setTotal(total);
        setHasNext(page * limit < total);
      } catch (err) {
        setError(err.message || 'Failed to load answers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [page]);

  return (
    <div className="rounded-[24px] bg-white border border-gray-100 dark:bg-[#11192880] dark:border-[#11192880] shadow-md border border-grey-100 p-4 pt-8 pb-8 w-1/2 fixed">
      <div className="flex justify-between items-center mb-4 pt-4 pb-4">
        <h2 className="text-[21px] flex justify-between w-[180px] items-center font-[500] font-bold text-[#1c9753] dark:text-white">
          <FaBook className="text-[28px]" /> New Answers
        </h2>

        <Link href="/en/latest">
          <div className="bg-white flex items-center justify-between  w-[90px] h-[40px]  text-[15px] border-[#1c9753] text-[#1c9753] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#1c9753]/10 transition cursor-pointer">
            <FiExternalLink /> More
          </div>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-blue-500 font-medium">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-medium">{error}</p>
      ) : answers.length === 0 ? (
        <p className="text-center text-gray-500 font-medium">No answers available.</p>
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