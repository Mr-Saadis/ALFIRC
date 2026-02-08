'use client'
import { useState } from 'react'
import {
  FiPrinter,
  FiDownload,
  FiCopy,
  FiBookmark,
  FiSearch,
  FiShare2,
  FiX,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi'
import { getCopyableText } from '@/lib/getCopyableText'
import { toast } from 'sonner'

export default function ActionBar({
  questionId,
  query, setQuery,
  matches, current,
  goPrev, goNext,
  onCopy,
  setMatches, setCurrent,
  question,
  ansDetailed,
  isBookmarked,
  setIsBookmarked
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const baseInputId = `find-input-${questionId}`

  // ─────────────────────────────────────────────────────────────────────────────
  // 🖨️ PRINT HANDLER (Bismillah Right - Coded Brand with Logo Left)
  // ─────────────────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    // 1. Data Setup
    const currentDate = new Date().toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const publishedDate = question?.published
      ? new Date(question.published).toLocaleDateString('ar-SA')
      : currentDate

    // 2. HTML Template
    const printContent = `
      <!DOCTYPE html>
      <html lang="ur" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>Fatwa-${questionId}</title>
        <style>
          /* Fonts */
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

          body {
            background-color: #fff;
            display: flex;
            justify-content: center;
            padding: 0;
            margin: 0;
            font-family: 'Amiri', serif;
            color: #000;
            -webkit-print-color-adjust: exact;
          }

          .document {
            width: 100%;
            max-width: 210mm;
            min-height: 297mm;
            background-color: white;
            padding: 10mm;
            position: relative;
            box-sizing: border-box;
          }

          .outer-border {
            border: 4px double black;
            min-height: 95vh;
            padding: 20px;
            position: relative;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
          }

          /* ─── Header Layout ─── */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid black;
            padding-bottom: 15px;
            margin-bottom: 20px;
            height: 120px; 
          }

          /* Right Side: Bismillah Image */
          .header-right {
            width: 40%;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: flex-start; 
          }
          .bismillah-img {
            max-width: 100%;
            max-height: 130px;
            object-fit: contain;
          }

          /* Left Side: Brand Layout (Logo + Text) */
          .header-left {
            display: flex;
            justify-content: flex-end; /* Align to the left edge visually in RTL */
            align-items: center;
            direction: ltr; /* Force LTR for English Text alignment */
          }

          .brand-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .brand-logo {
            width: 60px;
            height: 60px;
            object-fit: contain;
          }

          .brand-text {
            text-align: center;
            line-height: 1.1;
          }

          .brand-title {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 18px;
            color: #0f5132; /* Official Green */
            margin: 0;
          }

          .brand-subtitle {
            font-family: 'Poppins', sans-serif;
            font-size: 11px;
            color: #666;
            margin-top: 3px;
            font-weight: 400;
          }

          .brand-founder {
            font-family: 'Amiri', serif;
            font-size: 12px;
            color: #000;
            margin-top: 2px;
            font-weight: bold;
          }

          /* ─── Content ─── */
          .content-wrapper { flex: 1; }

          .metadata {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            font-weight: bold;
            font-size: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
          }

          .question {
            font-weight: bold;
            font-size: 22px;
            margin-bottom: 20px;
            line-height: 1.8;
            margin-top: 20px;
            text-align: justify;
          }

          .answer-title {
            text-align: center;
            text-decoration: underline;
            font-size: 26px;
            margin: 30px 0 20px 0;
            font-weight: bold;
          }

          .main-text {
            line-height: 2.4;
            font-size: 22px;
            text-align: justify;
          }

          /* ─── Footer ─── */
          .web-footer {
            margin-top: 80px;
            border-top: 1px solid #ccc;
            padding-top: 15px;
            text-align: center;
            color: #555;
          }
          .web-text { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
          .web-url { font-family: sans-serif; font-size: 12px; direction: ltr; color: #888; }

          @media print {
            @page { margin: 0; size: A4; }
            body { background: none; margin: 0; }
            .outer-border { min-height: 98vh; border: 4px double black !important; }
            .brand-title { color: #0f5132 !important; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>

      <div class="document">
        <div class="outer-border">
          
          <div class="header">
            <div class="header-right">
               <img src="/images/bismillah.png" alt="Bismillah" class="bismillah-img" />
            </div>

            <div class="header-left">
               <div class="brand-container">
                  <img src="/images/logo.png" alt="Logo" class="brand-logo" />
                  <div class="brand-text">
                     <div class="brand-title">Al Farooq Islamic<br>Research Center</div>
                     <div class="brand-subtitle">Founded & Supervised By</div>
                     <div class="brand-founder">ابوزرعہ احمد بن احتشام عفا اللہ عنہ</div>
                  </div>
               </div>
            </div>
          </div>

          <div class="content-wrapper">
            <div class="metadata">
              <div>سلسلہ نمبر: ${questionId}</div>
              <div>التاريخ: ${publishedDate}</div>
            </div>

            <div class="question">
              السؤال: ${question?.Q_Heading || ''}
            </div>

            <div class="answer-title">الجواب</div>

            <div class="main-text">
              ${ansDetailed}
            </div>

            <div style="text-align:center; font-weight:bold; font-size:20px; margin-top:30px;">
              واللہ تعالیٰ اعلم بالصواب
            </div>
          </div>

          <div class="web-footer">
            <div class="web-text">یہ فتویٰ ویب سائٹ سے پرنٹ کیا گیا ہے۔ اصل کی تصدیق کے لیے درج ذیل لنک وزٹ کریں:</div>
            <div class="web-url">${window.location.href}</div>
          </div>

        </div>
      </div>

      </body>
      </html>
    `

    const printWindow = window.open('', '_blank', 'width=900,height=800')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 800)
    } else {
      alert('براہ کرم پرنٹ کے لیے پاپ اپ کی اجازت دیں۔')
    }
  }

  const handleDownload = () => {
    const text = getCopyableText(ansDetailed)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `question-${questionId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleToggleBookmark = async () => {
    if (isBookmarked) {
      const res = await fetch('/api/bookmark', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      })
      if (res.ok) {
        setIsBookmarked(false)
        toast.success('Bookmark removed')
      } else {
        toast.error('Failed to remove bookmark')
      }
    } else {
      const res = await fetch('/api/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      })
      if (res.ok) {
        setIsBookmarked(true)
        toast.success('Added to Bookmarks')
      } else {
        toast.error('Failed to add bookmark')
      }
    }
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: document.title, url })
    } else {
      navigator.clipboard.writeText(url)
      toast.success('URL copied!')
    }
  }

  return (
    <div className="sticky top-5 z-50 mt-5 bottom-0 left-0 right-0 bg-transparent">
      <div className="flex justify-around bg-white opacity-85 border rounded-[10px] border-gray-200 flex-row-reverse py-4">
        <FiPrinter className="text-xl cursor-pointer hover:text-primary" onClick={handlePrint} />
        <FiShare2 className="text-xl cursor-pointer hover:text-primary" onClick={handleShare} />
        <FiBookmark className={`text-xl cursor-pointer hover:text-primary ${isBookmarked ? 'text-yellow-500' : ''}`} onClick={handleToggleBookmark} />
        <FiSearch className="text-xl transition-all cursor-pointer hover:text-primary" onClick={() => setSearchOpen(o => !o)} />
        <FiCopy className="text-xl cursor-pointer hover:text-primary" onClick={onCopy} />
      </div>

      {searchOpen && (
        <div className="flex items-center mt-2 opacity-85 px-4 py-2 shadow-[0px_5px_8px_#00000025] rounded-[8px] bg-white dark:border-gray-700">
          <FiX className="text-lg cursor-pointer mr-4" onClick={() => { setSearchOpen(false); setQuery('') }} />
          <button onClick={goPrev} disabled={current <= 0} className="px-2 disabled:text-gray-400"><FiChevronUp /></button>
          <span className="mx-2 font-mono text-sm">{current + 1}/{matches}</span>
          <button onClick={goNext} disabled={current >= matches - 1} className="px-2 disabled:text-gray-400"><FiChevronDown /></button>
          <input
            id={baseInputId}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="تلاش کریں..."
            className="ml-4 flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}