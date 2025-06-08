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
      <p className="text-[10px] text-muted-foreground mt-[-2px]">
        Founded &amp; Supervised By
        <br />
        Shaykh&nbsp;Ahmad&nbsp;Bin&nbsp;Ihtisham
      </p>
    </div>
  )
}
