'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiGrid, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Spinner } from 'flowbite-react'
import { useRouter } from 'next/navigation'

const TABS = [
  { key: 'false', label: 'احکام و مسائل' },
  { key: 'true', label: 'تحقیق و تخریج' },
  // { key: 'true',  label: 'اہم ترین'  },
]


function CategoryAccordion({ cat, tab }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="bg-white rounded-xl shadow-sm mb-4">
      <div
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-center p-4">
        <div className="flex flex-col w-full justify-center items-center gap-4">
          <Link
            onClick={() => setOpen(v => !v)}
            href={`/categories?catID=${cat.id}&assignT=${tab}`}
            className="text-[16px] font-[600] text-[#111928] hover:text-blue-600 transition"
          >
            {cat.name}
          </Link>
          <div className='flex justify-around gap-4 w-full'>
            <span className="text-[15px] text-gray-500">جوابات: {cat.answers}</span>
            <span className="text-[15px] text-gray-500">
              ذیلی زمرے: {cat.subcategories.length}
            </span>
          </div>
        </div>
        <button
          onClick={e => {e.stopPropagation(); setOpen(v => !v)}}
          className="p-1 rounded hover:bg-gray-100 transition"
          aria-label={open ? 'Hide subcategories' : 'Show subcategories'}
        >
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>
      {open && (
        <ul className="border-t flex flex-col  px-4 pt-4 pb-4 space-y-2 rtl text-right">
          {cat.subcategories.map(sub => (
            <li key={sub.id}>
              <Link
                href={`/categories/?catID=${cat.id}&subCatID=${sub.id}&assignT=${tab}`}
                className="flex justify-between flex-row-reverse pl-3 pr-3 items-center text-[16px] text-gray-700 p-1 rounded-[8px] hover:bg-gray-100 transition"
              >
                {sub.name}{' '}  •
                <span className="text-[14px] text-gray-500">
                  جوابات : {sub.answers}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState('true')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter();


  useEffect(() => {
    setLoading(true)
    fetch(`/api/categories_sub/?assign=${activeTab}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load categories')
        return res.json()
      })
      .then(data => {
        setCategories(data) // expected full array from your API
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [activeTab])

  return (
    <div className="relative max-w-sm font-arabic mx-auto bg-white rounded-2xl shadow-md h-[600px] p-6 pt-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">زمرہ جات</h1>
        <button
          onClick={() => router.push('/categories')}
          className="inline-flex items-center gap-1 px-3 py-1.5 border rounded-full hover:bg-gray-100 transition">
          <FiGrid className="text-lg text-blue-600" /> مزید
        </button>
      </div>

      <div className="flex pr-2 justify-start mb-4">
        <ul className="flex space-x-6 rtl:space-x-reverse flex-row-reverse border-b">
          {TABS.map(tab => (
            <li
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer  pb-2 ${activeTab === tab.key
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
          <Spinner aria-label="Loading categories" size="md" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500">{error}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        <ul>
          {categories.map((cat, tab) => (
            <CategoryAccordion
              key={cat.id}
              cat={cat}
              tab={TABS.find(t => t.key === activeTab)?.key || 'true'}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
