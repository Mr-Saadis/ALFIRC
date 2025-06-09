'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

import Brand            from './Brand'
import SearchBar        from './SearchBar'
import MobileSearch     from './MobileSearchSheet'
import AskQuestionBtn   from './AskQuestionBtn'

export default function Navbar ({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className='flex justify-start items-center p-2'>
        <div className="ml-2 flex justify-end cursor-pointer items-center gap-2">
          <img  src="/images/logo.png"
            alt="Alfarooq Logo"
            className="h-8 w-auto md:h-10" />
        <Brand/>
        </div>
      </div>
    </header>
  )
}
