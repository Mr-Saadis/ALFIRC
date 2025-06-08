'use client'
import { useCallback }           from 'react'
import Link                      from 'next/link'
import { FiGrid }                from 'react-icons/fi'
import { Spinner }               from 'flowbite-react'
import AnswerCard                from '@/components/lists/AnswerCard'   //<- your card
                                                                      //  (export separately)
export default function Results ({
  rows, loading, error, page, setPage, total
}) {
  const limit = 20
  const hasNext = page * limit < total

  if (loading) return (
    <div className="text-center py-10"><Spinner size="lg" /></div>
  )
  if (error) return (
    <div className="text-center text-red-600 py-10">{error}</div>
  )

  return (
    <section className="bg-white p-4 rounded-xl shadow mb-8">
      {/* header */}
      <div className="flex flex-row-reverse justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">نتائج: {total}</h2>
        <Link href="/ur/latest">
          <button className="inline-flex gap-1 items-center text-sm border px-2 py-1 rounded-full">
            <FiGrid /> تمام
          </button>
        </Link>
      </div>

      {rows.length ? (
        <>
          <ul className="flex flex-col gap-3">
            {rows.map(r => (
              <AnswerCard key={r.id} answer={r}/>
            ))}
          </ul>

          {/* pagination */}
          {(page > 1 || hasNext) && (
            <div className="flex justify-center mt-5">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 disabled:text-gray-400"
              >
                ‹
              </button>
              <span className="px-4 py-1">{page}</span>
              <button
                disabled={!hasNext}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 disabled:text-gray-400"
              >
                ›
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center py-6">کوئی ریکارڈ نہیں ملا۔</p>
      )}
    </section>
  )
}
