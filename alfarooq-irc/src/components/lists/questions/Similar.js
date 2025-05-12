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

        

        {/* <div className='flex justify-between items-center'>
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
          </div> */}

          {/* <Link href={``}>
            {answer.Assign_T !== null && (
              <div className="flex items-center gap-4 border border-[#FCE96A] bg-[#FDFDEA] px-3 py-1.5 rounded-full text-[13px] font-[500]">
                {answer.Assign_T ? 'تحقیق و تخریج' : 'احکام و مسائل'}
              </div>
            )}
          </Link>
 */}


          {/* <button>
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
          </button> */}




        {/* </div> */}
      </div>
    </Link>
  </li>
);



export default function SimilarQuestions() {
  const { id } = useParams()
  const [list, setList] = useState([])

  useEffect(() => {
    fetch(`/api/questions/${id}/similarQuestions`)
      .then((res) => res.json())
      .then((json) => setList(json.similar))
  }, [id])

//   return (
//     <section className="mt-12">
//       <h2 className="text-xl font-semibold mb-4">متعلقہ سوالات</h2>
//       <ul className="space-y-3">
//         {list.map((q) => (
//           <li key={q.id}>
//             <Link
//               href={`/questions/${q.id}`}
//               className="text-blue-600 hover:underline"
//             >
//               {q.title}
//             </Link>
//             <p className="text-sm text-gray-600">
//               {new Date(q.published).toLocaleDateString('ur-PK')}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </section>
//   )
// }


return (
    <div dir="rtl" className="max-w-6xl font-urdutype mx-auto text-right bg-white shadow-sm mt-6 p-4 pt-2 rounded-[25px]">
      <div className="flex justify-between items-center mb-2 pt-2 pb-2">
        {/* <Link href="/ur/latest">
          <div className="bg-white flex items-center justify-around w-[90px] h-[40px] text-[15px] border-primary text-primary px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-100 transition cursor-pointer">
            <FiExternalLink /> مزید
          </div>
        </Link> */}
        <h2 className="text-[18px] flex flex-row-reverse justify-between w-[140px] items-center font-[700] text-primary dark:text-white">
          متعلقہ سوالات <FaBook className="text-[28px]" />
        </h2>

      </div>

      {(
        <>
          <ul className="flex flex-col gap-1">
            {list.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};