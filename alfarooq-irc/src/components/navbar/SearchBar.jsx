'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input }  from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SearchBar () {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState('')

  // keep local state in-sync with the URL
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [pathname, searchParams])

  const handleSubmit = e => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/ur/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative md:flex w-full max-w-md shrink-0"
    >
      <Input
        dir="rtl"
        placeholder="تلاش کریں..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="pr-4 rtl:placeholder:text-right rounded-[10px]"
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute left-1 top-1/2 -translate-y-1/2 text-primary"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}
