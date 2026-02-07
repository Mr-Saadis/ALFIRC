'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaBars,
  FaGlobe,
  FaHeart,
  FaSearch,
} from 'react-icons/fa';


export default function Header({ onMenuClick }) {
  const router        = useRouter();
  const [term, setTerm] = useState('');

  /* submit handler – pushes to /ur/search?q=... */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    router.push(`/ur/search?q=${encodeURIComponent(term.trim())}`);
    setTerm('');
  };

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 dark:bg-[#101827] dark:border-gray-800"
    >
      {/* ---------------------------------------------------------------- */}
      {/*  Left section (menu + logo)                                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        {/* burger (mobile only) */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FaBars className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* brand */}
        <div className="text-center leading-tight">
          <h1 className="text-primary font-bold text-[15px] leading-snug">
            Al Farooq Islamic
            <br />
            Research Center
          </h1>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-[-2px]">
            Founded &amp; Supervised By:
            <br />
            Abu&nbsp;Zur'ah&nbsp;Ahmad&nbsp;bin&nbsp;Ihtisham&nbsp;Affah&nbsp;Allah&nbsp;Auhu
            "ابوزرعہ&nbsp;احمد&nbsp;بن&nbsp;احتشام&nbsp;عفا&nbsp;اللہ&nbsp;عنہ"
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Center section – search                                         */}
      {/* ---------------------------------------------------------------- */}
      <form
        onSubmit={handleSearch}
        className="hidden sm:flex w-full max-w-md items-center bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-1.5 mx-4"
      >
        <input
          type="search"
          placeholder="تلاش کریں..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="flex-1 bg-transparent text-sm focus:outline-none rtl:placeholder:text-right"
        />
        <button
          type="submit"
          className="text-primary hover:text-blue-700"
          aria-label="Search"
        >
          <FaSearch />
        </button>
      </form>

      {/* ---------------------------------------------------------------- */}
      {/*  Right section – contribute + language + mobile search icon      */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        {/* compact search icon (mobile) */}
        <button
          onClick={() => {
            /* focus expanded input on small screens */
            const el = document.getElementById('mobile-search');
            if (el) el.classList.toggle('hidden');
          }}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Search"
        >
          <FaSearch className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* contribute */}
        <a
          href="https://contribution.islamqa.info"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-1 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-primary/90 transition"
        >
          <FaHeart className="text-white" />
          Contribute
        </a>

        {/* language */}
        <button className="flex items-center gap-2 bg-blue-100 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
          <FaGlobe /> English
        </button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Hidden expandable mobile input                                  */}
      {/* ---------------------------------------------------------------- */}
      <form
        id="mobile-search"
        onSubmit={handleSearch}
        className="sm:hidden hidden absolute top-full inset-x-3 mt-2 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center px-4 py-1.5"
      >
        <input
          type="search"
          placeholder="تلاش کریں..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="flex-1 bg-transparent text-sm focus:outline-none rtl:placeholder:text-right"
        />
        <button type="submit" className="text-primary">
          <FaSearch />
        </button>
      </form>
    </header>
  );
}
