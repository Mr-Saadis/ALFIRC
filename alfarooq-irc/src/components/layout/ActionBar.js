'use client'
import { useState } from 'react'
import {
  FiPrinter,
  FiDownload,
  FiCopy,
  FiBookmark,
  FiGlobe,
  FiSearch,
  FiShare2,
  FiX,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi'
import { getCopyableText } from '@/lib/getCopyableText'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function ActionBar({
  questionId,
  query, setQuery,
  matches, current,
  goPrev, goNext,
  onCopy,
  setMatches, setCurrent,
  question,
  ansDetailed,
  isFormatted,
  onToggleFormat,
  isBookmarked,
  setIsBookmarked
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const baseInputId = `find-input-${questionId}`

  const handlePrint = () => window.print()

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
        toast.success('Bookmark removed')
        setIsBookmarked(false)
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
        toast.success('Added to Bookmarks', {
          action: {
            label: 'Open',
            onClick: () => console.log('View bookmarks')
          }
        })
        setIsBookmarked(true)
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
      alert('URL copied to clipboard')
    }
  }

  return (
    <div className="sticky top-5 z-50 mt-5 bottom-0 left-0 right-0 bg-transparent">
      <div className="flex justify-around bg-white opacity-85 border rounded-[10px] border-gray-200 flex-row-reverse py-4">
        <FiPrinter className="text-xl cursor-pointer hover:text-[#3333cc]" onClick={handlePrint} />
        <FiShare2 className="text-xl cursor-pointer hover:text-[#3333cc]" onClick={handleShare} />
        <FiBookmark className={`text-xl cursor-pointer hover:text-[#3333cc] ${isBookmarked ? 'text-yellow-500' : ''}`} onClick={handleToggleBookmark} />
        <FiSearch className="text-xl transition-all cursor-pointer hover:text-[#3333cc]" onClick={() => setSearchOpen(o => !o)} />
        <FiCopy className="text-xl cursor-pointer hover:text-[#3333cc]" onClick={onCopy} />
      </div>

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
            {current + 1}/{matches}
          </span>
          <button
            onClick={goNext}
            disabled={current >= matches - 1}
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
