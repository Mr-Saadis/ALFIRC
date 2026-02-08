'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FaBook } from 'react-icons/fa'

const AnswerCard = ({ answer }) => (
  <li dir="rtl" className="bg-white p-4 rounded-xl border-2 mt-1 mb-1 border-gray-100 dark:bg-gray-800 transition hover:bg-gray-100 dark:hover:bg-gray-700">
    <Link
      href={`/questions/${answer.id}`}
      className="text-gray-900 dark:text-white font-semibold"
    >
      <div>
        <div className="flex flex-row-reverse justify-between items-center mb-1">
          <span className="text-[10px] font-poppins text-[#6b7280] dark:text-[#6b7280] font-[500] leading-[18px]">
            {new Date(answer.published).toLocaleDateString('ur-PK')}
          </span>
          <span className='text-primary text-[10px] dark:text-primary font-[600] leading-[10px]'>
            سلسلہ نمبر : <span className='font-poppins'>{answer.id}</span>
          </span>
        </div>
        <div className='text-[14px] text-[#111928] dark:text-[#111928] font-[600] leading-[25px] text-right'>
          {answer.title}
        </div>
      </div>
    </Link>
  </li>
);

export default function SimilarQuestions() {
  const { id } = useParams()
  const [list, setList] = useState([])

  useEffect(() => {
    if(!id) return;
    
    // We fetch from the same API endpoint
    fetch(`/api/questions/${id}/similarQuestions`)
      .then((res) => res.json())
      .then((json) => {
        if(json.similar) {
            setList(json.similar)
        }
      })
      .catch(err => console.error(err))
  }, [id])

  if (list.length === 0) return null;

  return (
    <div dir="rtl" className="max-w-6xl font-urdutype mx-auto text-right bg-white shadow-sm mt-6 p-4 pt-2 rounded-[25px]">
      <div className="flex justify-between items-center mb-2 pt-2 pb-2">
        <h2 className="text-[18px] flex flex-row-reverse justify-between w-[140px] items-center font-[700] text-primary dark:text-white">
          متعلقہ سوالات <FaBook className="text-[28px]" />
        </h2>
      </div>
      
      <ul className="flex flex-col gap-1">
        {list.map((answer) => (
          <AnswerCard key={answer.id} answer={answer} />
        ))}
      </ul>
    </div>
  );
};