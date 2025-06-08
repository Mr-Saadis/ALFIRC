'use client'
import { useState, useEffect } from 'react'
import { FaSearch }            from 'react-icons/fa'

const ASSIGN_OPTIONS = [
  { value: 'false', label: 'احکام و مسائل' },
  { value: 'true',  label: 'تحقیق و تخریج' }
]

export default function SearchForm ({ onSearch }) {
  /* text + filters ------------------------------------------------ */
  const [q, setQ]                       = useState('')
  const [assign, setAssign]             = useState([])      // array of 'true' | 'false'
  const [catIds,    setCatIds]          = useState([])      // array of cat ids
  const [subcatIds, setSubcatIds]       = useState([])      // array of subcat ids

  /* data ---------------------------------------------------------- */
  const [cats,     setCats]    = useState([])               // [{id,name,subcategories:[{id,name}]}]
  const [subsByCat,setSubs]    = useState({})               // { <catId> : [subcats] }

  /* load categories once */
  useEffect(() => {
    fetch('/api/categories_sub?assign=all')
      .then(r=>r.json())
      .then(data => {
        setCats(data)
        const map = {}
        data.forEach(c => { map[c.id] = c.subcategories })
        setSubs(map)
      })
  }, [])

  /* helpers ------------------------------------------------------- */
  const toggle    = (arr, val) => arr.includes(val)
                                ? arr.filter(x => x!==val)
                                : [...arr,val]

  /* clear dangling subcats when their category is unticked */
  useEffect(()=>{
    if (catIds.length===0) { setSubcatIds([]); return }
    const allowed = new Set(catIds)
    setSubcatIds(prev => prev.filter(sc =>
      cats.some(c => allowed.has(c.id) && c.subcategories.find(s=>s.id==sc))
    ))
  }, [catIds, cats])

  /* submit -------------------------------------------------------- */
  const handleSubmit = e => {
    e.preventDefault()
    onSearch({
      q,
      assign : assign.length ? assign : null,         // null = “all”
      catIds : catIds.length ? catIds : null,
      subcatIds : subcatIds.length ? subcatIds : null
    })
  }

  /* ------------------------------------------------------------------ */
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-xl p-4 mb-8 flex flex-col gap-6"
      dir="rtl"
    >
      {/* search text -------------------------------------------- */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="search"
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="سوال یا کلیدی لفظ لکھیں…"
          className="flex-1 border px-3 py-2 rounded-md focus:outline-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 justify-center"
        >
          <FaSearch/> تلاش
        </button>
      </div>

      {/* check-box filters --------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-3">

        {/* 1) Assign_T ---------------------------------------- */}
        <fieldset>
          <legend className="font-semibold mb-1">قسم</legend>
          <label className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={assign.length===0}
              onChange={()=>setAssign([])}      // clearing selects ALL
            />
            تمام
          </label>
          {ASSIGN_OPTIONS.map(o=>(
            <label key={o.value} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={assign.includes(o.value)}
                onChange={()=>setAssign(toggle(assign,o.value))}
              />
              {o.label}
            </label>
          ))}
        </fieldset>

        {/* 2) Category ----------------------------------------- */}
        <fieldset>
          <legend className="font-semibold mb-1">زمرہ جات</legend>
          <label className="flex items-center gap-2 mb-1">
            <input type="checkbox"
              checked={catIds.length===0}
              onChange={()=>setCatIds([])}
            /> تمام
          </label>
          <div className="max-h-40 overflow-y-auto pr-1">
            {cats.map(c=>(
              <label key={c.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={catIds.includes(c.id)}
                  onChange={()=>setCatIds(toggle(catIds,c.id))}
                />
                {c.name}
              </label>
            ))}
          </div>
        </fieldset>

        {/* 3) Subcategory -------------------------------------- */}
        <fieldset>
          <legend className="font-semibold mb-1">ذیلی زمرے</legend>
          <label className="flex items-center gap-2 mb-1">
            <input type="checkbox"
              checked={subcatIds.length===0}
              onChange={()=>setSubcatIds([])}
              disabled={catIds.length===0}
            /> تمام
          </label>
          <div className="max-h-40 overflow-y-auto pr-1">
            {catIds.flatMap(cid => subsByCat[cid] || []).map(s=>(
              <label key={s.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={subcatIds.includes(s.id)}
                  onChange={()=>setSubcatIds(toggle(subcatIds,s.id))}
                />
                {s.name}
              </label>
            ))}
            {catIds.length===0 &&
              <p className="text-gray-400 text-sm">پہلے کوئی زمرہ منتخب کریں</p>}
          </div>
        </fieldset>
      </div>
    </form>
  )
}
