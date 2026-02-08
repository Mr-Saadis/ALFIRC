/* ───────────────────────────────────────────────
   components/DynamicCategory.jsx
   ─────────────────────────────────────────────── */
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Spinner }          from 'flowbite-react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import Cat_Subcat_Answers   from './Cat_Subcat_Answers'

const TABS = [
  { key: 'false', label: 'احکام و مسائل' },
  { key: 'true',  label: 'تحقیق و تخریج' },
]

/* ────────────── Accordion row (unchanged UI) ────────────── */
function CategoryAccordion ({ cat, onCat, onSub }) {
  const [open, setOpen] = useState(false)

  return (
    <li className="bg-white rounded-xl shadow-sm mb-4">
      <div
        className="flex items-center justify-center p-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-col w-full items-center gap-4">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onCat(cat.id) }}
            className="text-[16px] font-[600] text-[#111928] hover:text-primary"
          >
            {cat.name}
          </button>

          <div className="flex justify-around gap-4 w-full">
            <span className="text-[15px] text-gray-500">جوابات: {cat.answers}</span>
            <span className="text-[15px] text-gray-500">ذیلی زمرے: {cat.subcategories.length}</span>
          </div>
        </div>

        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100"
          onClick={e => { e.stopPropagation(); setOpen(!open) }}
          aria-label={open ? 'Hide subcategories' : 'Show subcategories'}
        >
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {open && (
        <ul className="border-t flex flex-col px-4 pt-4 pb-4 space-y-2 rtl text-right">
          {cat.subcategories.map(sub => (
            <li key={sub.id}>
              <button
                type="button"
                onClick={() => onSub(sub.id)}
                className="flex flex-row-reverse justify-between w-full p-1 rounded-[8px] hover:bg-gray-100"
              >
                {sub.name}
                <span className="text-[14px] text-gray-500">جوابات : {sub.answers}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/* ────────────── Main component ────────────── */
export default function DynamicCategory () {
  /* read url qs once */
  const params   = useSearchParams()
  const router   = useRouter()

  const qsCat    = params.get('catID')    || null
  const qsSub    = params.get('subCatID') || null
  const qsAssign = params.get('assignT')   || 'true'

  /* state */
  const [activeTab, setActiveTab]       = useState(qsAssign)
  const [categories, setCategories]     = useState([])

  const [loading, setLoading]           = useState(true)
  const [error,   setError]             = useState(null)

  const [catId,   setCatId]             = useState(qsCat)
  const [subId,   setSubId]             = useState(qsSub)

  /* keep query-string in sync so links / refresh work */
  const pushQS = (cat, sub, assign) => {
    const q   = new URLSearchParams()
    if (cat)    q.set('catID',    cat)
    if (sub)    q.set('subCatID', sub)
    q.set('assign', assign)
    router.replace(`?${q.toString()}`, { scroll: false })
  }

  /* click handlers */
  const chooseCat = id => { setCatId(id); setSubId(null); pushQS(id,null,activeTab) }
  const chooseSub = id => { setSubId(id); setCatId(null); pushQS(null,id,activeTab) }

  /* tab change => refetch categories sidebar */
  useEffect(() => {
    setLoading(true)
    fetch(`/api/categories_sub?assign=${activeTab}`)
      .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json() })
      .then(setCategories)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [activeTab])

  return (
    <div className="flex flex-col md:flex-row gap-4 max-h-[600px]" dir="rtl">

      {/* ───── Sidebar (categories) ───── */}
      <aside className="relative max-w-[300px] lg:min-w-[300px] min-w-full bg-white rounded-2xl shadow-md p-6 pt-6 flex flex-col">
        {/* tabs */}
        <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">زمرہ جات</h1>
              </div>
        
        <ul className="flex flex-row-reverse justify-end rtl:space-x-reverse space-x-6 border-b mb-4">
          {TABS.map(t => (
            <li key={t.key}
                className={`cursor-pointer pb-2 ${
                    t.key === activeTab
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                // ───────────────────────────────────────────────
                // CHANGED HERE: Reset catId and subId to NULL when tab is clicked
                // ───────────────────────────────────────────────
                onClick={() => { 
                    setActiveTab(t.key); 
                    setCatId(null); 
                    setSubId(null); 
                    pushQS(null, null, t.key) 
                }}
            >
              {t.label}
            </li>
          ))}
        </ul>

        {/* list */}
        {loading && <div className="flex justify-center py-10"><Spinner/></div>}
        {error   && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <ul className="overflow-y-auto max-h-[calc(100vh-12rem)] no-scrollbar pr-2">
            {categories.map(c => (
              <CategoryAccordion
                key={c.id}
                cat={c}
                onCat={chooseCat}
                onSub={chooseSub}
              />
            ))}
          </ul>
        )}
      </aside>

      {/* ───── Answers list ───── */}
      <main className="lg:min-w-[800px] min-w-full">
        {/* If catId/subcatId are null, this component should load ALL for that Assign_T */}
        <Cat_Subcat_Answers
          catId={catId}
          subcatId={subId}
          Assign_T={activeTab === 'true'}
        />
      </main>
    </div>
  )
}