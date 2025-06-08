'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

import Brand            from './Brand'
import SearchBar        from './SearchBar'
import MobileSearch     from './MobileSearchSheet'
import AskQuestionBtn   from './AskQuestionBtn'

export default function Navbar ({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex flex-row-reverse max-w-7xl items-center justify-between gap-60 px-4 py-3">

        {/* Mobile burger */}
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {/* Brand */}
        <Brand />

        {/* Desktop search */}
        {/* <SearchBar /> */}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Mobile search sheet */}
          <MobileSearch />

          {/* Ask button */}
          {/* <AskQuestionBtn /> */}
        </div>
      </div>
    </header>
  )
}
