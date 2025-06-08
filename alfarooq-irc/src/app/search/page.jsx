'use client'
import { useState, useEffect, useCallback } from 'react'
import SearchForm     from './SearchForm'
import Results        from './Results'

export default function SearchPage () {
  const [filters, setFilters]   = useState({           // always string/null
    q: '', assign: 'all', catId: null, subcatId: null
  })
  const [page, setPage]         = useState(1)
  const [rows, setRows]         = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  /* ------------------------------------------------------------------ */
  /* Fetch whenever filters or page change                              */
  /* ------------------------------------------------------------------ */
  const fetchData = useCallback(async () => {
    setLoading(true); setError(null)

    const params = new URLSearchParams()
    if (filters.q)          params.append('q', filters.q)
    if (filters.assign !== 'all') params.append('assign', filters.assign)
    if (filters.catId)      params.append('catId', filters.catId)
    if (filters.subcatId)   params.append('subcatId', filters.subcatId)
    params.append('page',  page)
    params.append('limit', 20)

    try {
      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error('Search failed')
      const js  = await res.json()
      setRows(js.data)
      setTotal(js.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetchData() }, [fetchData])

  /* Reset to page 1 whenever filters change */
  const onFilters = (newFilters) => { setFilters(newFilters); setPage(1) }

  return (
    <main dir="rtl" className="max-w-6xl mx-auto px-4 py-8 font-arabic">
      <h1 className="text-2xl font-bold mb-6 text-primary">تلاش کریں</h1>

      <SearchForm onSearch={onFilters} />

      <Results
        rows={rows}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        total={total}
      />
    </main>
  )
}
