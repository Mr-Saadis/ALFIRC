'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus } from 'lucide-react'

export default function AskQuestionBtn () {
  return (
    <Button asChild className="whitespace-nowrap">
      <Link href="/ask">
        <MessageSquarePlus className="mr-2 h-4 w-4" />
        نیا سوال پوچھیں
      </Link>
    </Button>
  )
}
