// src/app/questions/[id]/page.js
'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaCalendar } from 'react-icons/fa';
import { FiHome, FiCalendar } from 'react-icons/fi';
import ActionBar from '@/components/layout/ActionBar';
import { getCopyableText } from '@/lib/getCopyableText'
import { highlightHtml } from '@/lib/highlightHtml';
import { toast } from 'sonner';
import SimilarQuestions from '@/components/lists/questions/Similar';


function formatAnsDetails(raw = '') {
  return raw
    .replace(/\*\*(.+?)\*\*/g, (_, txt) =>
      `<h1 class="text-xl font-bold my-4">${txt}</h1>`)
    .replace(/\*(.+?)\*/g, (_, txt) =>
      `<span class="font-[700] my-3">${txt}</span>`)
    .replace(/^###$/gm,
      () => `<hr class="border-gray-300 my-6" />`)
    .replace(/\/(.+?)\//g,
      (_, url) => `<a href="/questions/${url}" class="text-primary hover:underline">${url}</a>`)
    .replace(/\_([\s\S]+?)\_/g,
      (_, txt) => `<div class="text-primary bg-blue-50 p-4 rounded-3xl leading-[35px]">${txt}</div>`)
    .replace(/\r?\n\r?\n/g, '</p><p>')
    .replace(/\r?\n/g, '<br/>');
}



export default function QuestionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [rawHtml, setRawHtml] = useState('');  // formatted but un-highlighted
  const [html, setHtml] = useState('');  // with <mark> wrapping
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState(0);
  const [current, setCurrent] = useState(0);

  const contentRef = useRef(null);



  useEffect(() => {
    fetch(`/api/questions/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Question not found');
        return res.json();
      })
      .then(data => {
        const f = formatAnsDetails(data.Ans_Detailed);
        setQuestion(data);
        setRawHtml(f);
        setHtml(f);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);


  useEffect(() => {
    const [newHtml, count] = highlightHtml(rawHtml, query);
    setHtml(newHtml);
    setMatches(count);
    setCurrent(count > 0 ? 0 : -1);
  }, [query, rawHtml]);


  // scroll the “current” <mark> into view
  useEffect(() => {
    if (current >= 0 && contentRef.current) {
      const el = contentRef.current.querySelector(`mark[data-idx="${current}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [current]);

  const goPrev = () => {
    if (current > 0) setCurrent(c => c - 1);
  };
  const goNext = () => {
    if (current <= matches - 1) setCurrent(c => c + 1);
  };

  useEffect(() => {
    if (!contentRef.current) return;
    const marks = contentRef.current.querySelectorAll('mark[data-idx]');

    marks.forEach(mark => {
      const idx = Number(mark.getAttribute('data-idx'));
      if (idx === current) {
        mark.classList.add('bg-blue-400');
        mark.classList.remove('bg-blue-200');
      } else {
        mark.classList.remove('bg-blue-400');
        mark.classList.add('bg-blue-200');
      }
    });
  }, [current, html]);




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

  const handleCopy = () => {
    // 1) build your plain text exactly as you have it now

  };




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

        {/* only show category & subcategory if subcatId is not null */}
        {subcatId != null && (
          <>
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
          </>
        )}

        <Link href={`/questions/${id}`} className="text-primary hover:text-primary">
          {Q_Heading}
        </Link>
      </nav>

      <article className='bg-white shadow-sm  p-16 pt-2 rounded-[25px]'>


        <ActionBar
          question={question}
          questionId={id}
          ansDetailed={rawHtml}
          query={query}
          setQuery={setQuery}
          matches={matches}
          current={current}
          goPrev={goPrev}
          goNext={goNext}
          setMatches={setMatches}
          setCurrent={setCurrent}
          onCopy={() => {
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

        /* …other props… */
        />



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
            {subcatId != null && (
              <>
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
              </>
            )}
          </div>
        </div>

        <div>
          <span className='text-primary text-[16px] dark:text-primary font-[700] p-4 pt-2 mb-6'>
            سلسلہ نمبر : <span className='font-poppins'>{Q_ID}</span>
          </span>
        </div>
        <div className='flex justify-center items-center m-4  whitespace-pre-line break-words'>
          <h1 className=" text-2xl font-bold text-gray-900 mb-4 ">{Q_Heading}</h1>
        </div>

        {Q_User && (
          <section
            dir="rtl"
            className="flex flex-col justify-center border border-[#FCE96A] bg-[#FDFDEA] rounded-lg m-4 p-4
               whitespace-pre-line break-words"
          >
            <h2 className="text-[16px] font-[400] text-[#111928] leading-[28px]">
              {Q_User}
            </h2>
          </section>
        )}

        {Ans_Summary && (
          <section
            dir="rtl"
            className="flex flex-col justify-center border border-[#9FDCB4] bg-[#E7F6EC] rounded-lg m-4 p-4
               whitespace-pre-line break-words"
          >
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
          ref={contentRef}
          className="prose prose-lg text-justify text-[16px] font-[400] leading-[35px] pr-4 pl-4 pt-6 whitespace-pre-line break-words"
          dangerouslySetInnerHTML={{ __html: html }}
        />



      </article>
{
  (subcatId !==null) && (
    <SimilarQuestions questionId={id} />
  )
}


    </article>
  );
}
