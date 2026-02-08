'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function Brand () {
    const router = useRouter();
  return (
    <div
    onClick={() => router.push('/')}
    dir="rtl"
    className="text-center leading-tight">
      <h1 className="text-primary font-bold text-[15px] leading-snug">
        Al&nbsp;Farooq&nbsp;Islamic
        <br />
        Research&nbsp;Center
      </h1>
      <h2 className="text-[10px] text-muted-foreground mt-[-2px]">
        Founded &amp; Supervised By
        <br />
       <p className="text-[12px] leading-6 font-arabic">
    ابوزرعہ&nbsp;احمد&nbsp;بن&nbsp;احتشام&nbsp;عفا&nbsp;اللہ&nbsp;عنہ
</p>
      </h2>
    </div>
  )
}
