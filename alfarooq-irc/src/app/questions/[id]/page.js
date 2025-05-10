// src/app/questions/[id]/page.js
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaCalendar } from 'react-icons/fa';
import { FiHome, FiCalendar } from 'react-icons/fi';


export default function QuestionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestion() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/questions/${id}`);
        if (!res.ok) throw new Error('Question not found');
        const data = await res.json();
        setQuestion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchQuestion();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading</div>;
  }
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error} •{' '}
        <button onClick={() => router.back()} className="underline hover:text-red-700">
          Go Back
        </button>
      </div>
    );
  }

  const {
    Q_ID,
    Q_Heading,
    Ans_Detailed,
    Ans_Summary,
    Assign_T,
    Published_At,
    Q_User,
    subcatId,
    subcatName,
    Cat_ID,
    Cat_Name
  } = question;

  return (
    <article dir="rtl" className="max-w-6xl bg-gray-50 font-urdutype mx-auto py-12 px-4 text-right">
      <nav className="text-sm mb-4 font-urdutype flex items-center gap-4 text-gray-600 ">
        <Link href={`/`} className="text-[#3333cc] hover:text-[#3333cc]">
          <FiHome className="inline-block" />
        </Link>{' '}
        &gt;{' '}
        <Link
          href={`/categories/${Cat_ID}/subcategories/${subcatId}`}
          className="hover:text-[#3333cc]"
        >
          {Assign_T !== null && (
            <div>
              {Assign_T ? 'تحقیق و تخریج' : 'احکام و مسائل'}
            </div>
          )}
        </Link>{' '}
        &gt;{' '}
        <Link
          href={`/categories/${Cat_ID}`}
          className="hover:text-[#3333cc]"
        >
          {Cat_Name}
        </Link>{' '}
        &gt;{' '}
        <Link
          href={`/categories/${Cat_ID}/subcategories/${subcatId}`}
          className="hover:text-[#3333cc]"
        >
          {subcatName}
        </Link>{' '}
        &gt;{' '}
        <Link href={`/questions/${id}`} className="text-primary hover:text-primary">
          {Q_Heading}
        </Link>
      </nav>

      <article className='bg-white shadow-sm  p-16 pt-2 rounded-[25px]'>
        <div className='flex items-center justify-between p-4 pb-2'>
          <div>
            <div className=' flex items-center gap-2 text-[14px] text-[#6b7280] mb-2'>
              <FiCalendar />
              {new Date(Published_At).toLocaleDateString('ur-PK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          <div className='flex items-center gap-2 text-[14px] mb-2'>
            <Link href={`/categories/${Cat_ID}/subcategories/${subcatId}`}>
              {Assign_T !== null && (
                <div className="flex items-center gap-4 border border-[#FCE96A] bg-[#FDFDEA] px-3 py-1.5 rounded-full text-[13px] font-[500]">
                  {Assign_T ? 'تحقیق و تخریج' : 'احکام و مسائل'}
                </div>
              )}
            </Link>
            <Link href={`/categories/${Cat_ID}`}>
              <div className='flex items-center gap-4 border text-[#063] border-[#9FDCB4] bg-[#E7F6EC] px-3 py-1.5 rounded-full text-[13px] font-[500]'>
                {Cat_Name}
              </div>
            </Link>
            <Link href={`/categories/${Cat_ID}/subcategories/${subcatId}`}>
              <div className='flex items-center border gap-4 bg-blue-100 text-primary px-3 py-1.5 rounded-full text-[13px] font-[500]'>
                {subcatName}
              </div>
            </Link>
          </div>
        </div>

        <div>
          <span className='text-primary text-[16px] dark:text-primary font-[700] p-4 pt-2 mb-6'>
            سلسلہ نمبر : <span className='font-poppins'>{Q_ID}</span>
          </span>
        </div>
        <div className='flex justify-center items-center m-4'>
          <h1 className=" text-2xl font-bold text-gray-900 mb-4 ">{Q_Heading}</h1>
        </div>

        {Q_User && (
          <section className='flex flex-col justify-center border min-h-4 border-[#FCE96A] bg-[#FDFDEA] rounded-lg right-0  m-4 p-[16px]'>
            {/* <h2 className=" text-[15px] flex right-0  font-[700] text-[#633112]">سوال نمبر :  <span className='font-poppins'>{subcatId}</span></h2> */}
            <h2 className=" text-[16px] leading-[28px] flex right-0  font-[400] text-[#111928]">{Q_User}</h2>
          </section>
        )}


        {Ans_Summary && (
          <section className="flex flex-col justify-center border min-h-4 border-[#9FDCB4] bg-[#E7F6EC] rounded-lg m-4 p-[16px]" dir="rtl">
            <h2 className="text-[16px] font-[700] text-[#063] mb-2">جواب کا خلاصہ</h2>
            <p className="text-[16px] font-[400] text-[#111928] leading-[28px]">
              {Ans_Summary}
            </p>
          </section>
        )}

        <div className="flex items-center gap-3 pr-4 pl-4 pt-6">
          <span className='text-[16px] font-[600]'>جواب کا متن</span>
          <div className="flex-1 h-[2px] bg-gray-200" />
        </div>

        <div
          className="prose prose-lg text-[16px] font-[500] leading-[35px] pr-4 pl-4 pt-6"
          dangerouslySetInnerHTML={{ __html: Ans_Detailed }}
        />

      </article>
    </article>
  );
}
