'use client'
import Link from 'next/link'
import { Spinner } from 'flowbite-react'

export default function AnswerCard ({ answer, isLoading, onClick }) {
  return (
    <li
      dir="rtl"
      className="relative bg-white p-4 pt-2 pb-2 rounded-xl border border-gray-100 mb-2 hover:bg-gray-50 transition"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
          <Spinner size="sm" />
        </div>
      )}

      <Link href={`/questions/${answer.id}`} onClick={onClick}>
        {/* top meta row ------------------------------------------------ */}
        <div className="flex flex-row-reverse justify-between items-center mb-2">
          <div className="flex flex-row-reverse gap-2 items-center">
            <span className="text-[12px] text-gray-500">
              {new Date(answer.published).toLocaleDateString('ur-PK')}
            </span>

            {answer.Assign_T !== null && (
              <span
                className={[
                  'px-2 py-0.5 rounded-full text-[11px] font-medium',
                  answer.Assign_T
                    ? 'border border-yellow-300 bg-yellow-50 text-gray-700'
                    : 'border border-green-300  bg-green-50  text-green-800'
                ].join(' ')}
              >
                {answer.Assign_T ? 'تحقیق و تخریج' : 'احکام و مسائل'}
              </span>
            )}
          </div>

          <span className="text-primary text-[12px] font-bold">
            سلسلہ نمبر: <span className="font-poppins">{answer.id}</span>
          </span>
        </div>

        {/* title ------------------------------------------------------- */}
        <div className="text-[16px] font-semibold leading-7 text-right">
          {answer.title}
        </div>

        {/* summary (clamped) ------------------------------------------ */}
        {Boolean(answer.summary) && (
          <p className="text-gray-600 text-[14px] leading-7 text-right line-clamp-2">
            {answer.summary}
          </p>
        )}
      </Link>
    </li>
  )
}
