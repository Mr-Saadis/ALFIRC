// ─────────────────────────────────────────────────────────────
// src/app/questions/[id]/page.js
// ─────────────────────────────────────────────────────────────
'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiHome, FiCalendar } from 'react-icons/fi'
import ActionBar from '@/components/layout/ActionBar'
import SimilarQuestions from '@/components/lists/questions/Similar'
import { recordAnonymousEvent, recordView } from '@/lib/analytics'
import { getCopyableText } from '@/lib/getCopyableText'
import { highlightHtml } from '@/lib/highlightHtml'
import { toast } from 'sonner'
import { ScrollTop } from 'primereact/scrolltop'

// ——————————————————————————————————————————— helper
function formatAnsDetails(raw = '') {
  return raw
    .replace(/\*\*(.+?)\*\*/g, (_, t) => `<h1 class="text-xl font-bold my-4">${t}</h1>`)
    .replace(/\*(.+?)\*/g,   (_, t) => `<span class="font-[700] my-3">${t}</span>`)
    .replace(/^###$/gm,      ()    => `<hr class="border-gray-300 my-6"/>`)
    .replace(/\/(.+?)\//g,   (_, u) => `<a href="/questions/${u}" class="text-primary hover:underline">${u}</a>`)
    .replace(/\_([\s\S]+?)\_/g,(_,t)=> `<div class="text-primary text-[20px] font-quran bg-blue-50 p-4 rounded-3xl leading-[35px]">${t}</div>`)
    .replace(/\r?\n\r?\n/g, '</p><p>')
    .replace(/\r?\n/g, '<br/>')
}

export default function QuestionDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  // ───────────────── state
  const [question, setQuestion] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [rawHtml,  setRawHtml]  = useState('')
  const [html,     setHtml]     = useState('')
  const [query,    setQuery]    = useState('')
  const [matches,  setMatches]  = useState(0)
  const [current,  setCurrent]  = useState(-1)

  const contentRef = useRef(null)

  // ───────────────── fetch question
  useEffect(() => {
    setLoading(true)
    fetch(`/api/questions/${id}`)
      .then(r => { if (!r.ok) throw new Error('Question not found'); return r.json() })
      .then(d => {
        const formatted = formatAnsDetails(d.Ans_Detailed || '')
        setQuestion(d)
        setRawHtml (formatted)
        setHtml    (formatted)
        recordAnonymousEvent()
        recordView(d.Q_ID)
      })
      .catch(err => setError(err.message))
      .finally(()=> setLoading(false))
  }, [id])

  // ───────────────── highlight search term
  useEffect(() => {
    const [marked, count] = highlightHtml(rawHtml, query)
    setHtml(marked)
    setMatches(count)
    setCurrent(count ? 0 : -1)
  }, [query, rawHtml])

  // scroll current mark into view
  useEffect(() => {
    if (current >= 0 && contentRef.current) {
      const el = contentRef.current.querySelector(`mark[data-idx="${current}"]`)
      el?.scrollIntoView({ behavior:'smooth', block:'center' })
    }
  }, [current])

  // active-mark colour toggle
  useEffect(() => {
    if (!contentRef.current) return
    contentRef.current
      .querySelectorAll('mark[data-idx]')
      .forEach(m => {
        const idx = +m.dataset.idx
        m.classList.toggle('bg-blue-400', idx === current)
        m.classList.toggle('bg-blue-200', idx !== current)
      })
  }, [current, html])

  // ───────────────── loading / error states
  if (loading) return <div className="p-8 text-center">Loading…</div>
  if (error)   return (
    <div className="p-8 text-center text-red-500">
      {error} •{' '}
      <button onClick={()=>router.back()} className="underline hover:text-red-700">Go back</button>
    </div>
  )

  // ───────────────── vars
  const {
    Q_ID, Q_Heading, Ans_Detailed, Ans_Summary, Assign_T,
    Published_At, Q_User, subcatId, subcatName, Cat_ID, Cat_Name
  } = question

  const goPrev = () => setCurrent(c => (c > 0 ? c-1 : c))
  const goNext = () => setCurrent(c => (c < matches-1 ? c+1 : c))

  // ─────────────────────────────────────────── JSX
  return (
    <article
      dir="rtl"
      className="
        font-urdutype text-right bg-gray-50
        mx-auto w-full
        px-3 sm:px-6 lg:px-4
        py-6 md:py-10 lg:py-12
        max-w-4xl lg:max-w-6xl
      "
    >
      {/* ───────────────────── BreadCrumbs */}
      <nav className="text-sm mb-4 flex flex-wrap items-center gap-2 text-gray-600">
        <Link href="/" className="text-primary"><FiHome className="inline" /></Link>
        &gt;
        <Link href={`/categories?assignT=${Assign_T}`}>
          {Assign_T ? 'تحقیق و تخریج' : 'احکام و مسائل'}
        </Link>
        {subcatId != null && (
          <>
            &gt;
            <Link href={`/categories?catID=${Cat_ID}&assignT=${Assign_T}`}>{Cat_Name}</Link>
            &gt;
            <Link href={`/categories/?catID=${Cat_ID}&subCatID=${subcatId}&assignT=${Assign_T}`}>{subcatName}</Link>
          </>
        )}
        &gt;
        <span className="text-primary">{Q_Heading}</span>
      </nav>

      {/* ───────────────────── White Card */}
      <section className="bg-white shadow-sm rounded-3xl p-4 sm:p-8 lg:p-12">
        <ActionBar
          question     ={question}
          questionId   ={id}
          ansDetailed  ={rawHtml}
          query        ={query}
          setQuery     ={setQuery}
          matches      ={matches}
          current      ={current}
          goPrev       ={goPrev}
          goNext       ={goNext}
          setMatches   ={setMatches}
          setCurrent   ={setCurrent}
          onCopy     =  {() => {
            const a = getCopyableText(Ans_Detailed);
            const b = Ans_Summary != null ? `\n*جواب کا خلاصہ*\n${Ans_Summary}\n\n` : "\n\n";
            const combined = `سلسلہ نمبر : ${Q_ID}\n\n` + `${Q_Heading}` + b + a;
            // 2) wrap it in RLE … PDF
            const RLE = "\u202B"; // Right-to-Left Embedding
            const PDF = "\u202C"; // Pop Directional Formatting
            const rtlText = RLE + combined + PDF;
            navigator.clipboard.writeText(rtlText);
            toast.success('Copied!')
          }}
        />

        {/* Meta line */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[13px] md:text-[14px]">
          <div className="flex items-center gap-2 text-gray-500">
            <FiCalendar/>
            {new Date(Published_At).toLocaleDateString('ur-PK',
              {year:'numeric', month:'long', day:'numeric'})}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-full font-[400] flex items-center gap-1
              ${Assign_T
                ? 'border border-[#FCE96A] bg-[#FDFDEA] text-gray-700'
                : 'border border-[#FCE96A] bg-[#FDFDEA] text-gray-700'
              }`}>
              {Assign_T ? 'تحقیق و تخریج' : 'احکام و مسائل'}
            </span>


            
            {subcatId != null && (
              <>
                <Link href={`/categories/${Cat_ID}`} className="border text-[#063] border-[#9FDCB4] bg-[#E7F6EC] px-3 py-1.5 rounded-full">
                  {Cat_Name}
                </Link>
                <Link href={`/categories/${Cat_ID}/subcategories/${subcatId}`} className="border bg-blue-100 text-primary px-3 py-1.5 rounded-full">
                  {subcatName}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Series & Title */}
        <div className="mt-4 flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-6">
          <span className="text-primary font-[700] text-[15px] md:text-[16px]">
            سلسلہ نمبر : <span className="font-poppins">{Q_ID}</span>
          </span>
          </div>
        <div className='flex justify-center items-center m-4  whitespace-pre-line break-words'>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 text-center lg:text-right">
            {Q_Heading}
          </h1>
          </div>
        

        {/* Ask-er */}
        {Q_User && (
          <section className="border border-[#FCE96A] bg-[#FDFDEA] rounded-lg p-4 my-4 whitespace-pre-line break-words">
            <h2 className="text-[15px] md:text-[16px]">{Q_User}</h2>
          </section>
        )}

        {/* Summary */}
        {Ans_Summary && (
          <section className="border border-[#9FDCB4] bg-[#E7F6EC] rounded-lg p-4 my-4 whitespace-pre-line break-words">
            <h2 className="text-[#063] font-[700] mb-2">جواب کا خلاصہ</h2>
            <p className="leading-[28px] md:leading-[32px]">{Ans_Summary}</p>
          </section>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 mt-6 mb-3">
          <span className="font-[600] text-[15px] md:text-[16px]">جواب کا متن</span>
          <div className="flex-1 h-[2px] bg-gray-200"/>
        </div>

        {/* Full answer */}
        <div
          ref={contentRef}
          className="
            prose prose-lg max-w-none
            leading-[30px] lg:leading-[35px]
            text-justify whitespace-pre-line break-words
          "
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      {/* Similar questions */}
      {subcatId != null && (
        <div className="mt-8 lg:mt-12">
          <SimilarQuestions questionId={id} />
        </div>
      )}

      {/* Scroll to top */}
      <ScrollTop threshold={250} behavior="smooth"
        className="!right-4 !left-auto !bg-blue-800 text-white h-[35px] w-[35px] rounded-3xl hover:!bg-primary/90" />
    </article>
  )
}
