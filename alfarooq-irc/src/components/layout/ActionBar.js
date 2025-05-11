'use client'
import { useState } from 'react'
import {
  FiPrinter,
  FiDownload,
  FiType,
  FiBookmark,
  FiGlobe,
  FiSearch,
  FiShare2,
  FiX,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi'
import { getCopyableText } from '@/lib/getCopyableText'

export default function ActionBar({
questionId,
  query, setQuery,
  matches, current,
  goPrev, goNext,
  onCopy,
  setMatches, setCurrent,

//   questionId,
  ansDetailed,
  isFormatted,
  onToggleFormat,
  isBookmarked,
  onToggleBookmark
}) {
  const [searchOpen, setSearchOpen] = useState(false)
 // const [query, setQuery]     = useState('')
//   const [matches, setMatches] = useState(0)
//   const [current, setCurrent] = useState(0)
  const baseInputId = `find-input-${questionId}`

  // ── handlers ──
  const handlePrint = () => window.print()

  const handleDownload = () => {
    const text = getCopyableText(ansDetailed)
    const blob = new Blob([text], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `question-${questionId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }


  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: document.title, url })
    } else {
      navigator.clipboard.writeText(url)
      alert('URL copied to clipboard')
    }
  }

  return (
    <div className="sticky top-5 z-50 bottom-0 left-0 right-0 bg-transparent">
      {/* Top row */}
      <div className="flex justify-around bg-white opacity-85 border rounded-[10px] border-gray-200 flex-row-reverse py-2">
        <FiPrinter    className="text-xl cursor-pointer" onClick={handlePrint} />
        <FiDownload   className="text-xl cursor-pointer" onClick={handleDownload} />
        {/* <FiType       className="text-xl cursor-pointer" onClick={onToggleFormat} /> */}
        <FiBookmark   className={`text-xl cursor-pointer ${isBookmarked ? 'text-yellow-500' : ''}`} onClick={onToggleBookmark} />
        {/* <FiGlobe      className="text-xl cursor-pointer" onClick={() => window.location.pathname = `/ur/questions/${questionId}`} /> */}
        <FiSearch     className="text-xl transition-all cursor-pointer" onClick={() => setSearchOpen(o => !o)} />
        <FiShare2     className="text-xl cursor-pointer" onClick={handleShare} />
      </div>

      {/* Search row */}
      {searchOpen && (
        <div className="flex items-center mt-2 opacity-85 px-4 py-2 shadow-[0px_5px_8px_#00000025] rounded-[8px] bg-white dark:border-gray-700">
          <FiX
            className="text-lg cursor-pointer mr-4"
            onClick={() => {
              setSearchOpen(false)
              setQuery('')
            }}
          />
          <button
            onClick={goPrev}
            disabled={current <= 0}
            className="px-2 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <FiChevronUp />
          </button>
          <span className="mx-2 font-mono text-sm">
            {current+1}/{matches}
          </span>
          <button
            onClick={goNext}
            disabled={current >= matches -1}
            className="px-2 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <FiChevronDown />
          </button>
          <input
            id={baseInputId}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="صفحہ میں تلاش"
            className="ml-4 flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  )
}
