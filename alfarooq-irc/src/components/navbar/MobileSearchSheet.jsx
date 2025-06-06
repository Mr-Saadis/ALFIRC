'use client'

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import SearchBar from './SearchBar'

export default function MobileSearchSheet () {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button size="icon" variant="ghost">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="top" className="pt-8">
        <SearchBar />
      </SheetContent>
    </Sheet>
  )
}
