'use client';

import {
  HelpCircle,
  Search as SearchIcon,
} from "lucide-react";

import AskQuestionBtn from "@/components/navbar/AskQuestionBtn";
import SearchBar from "@/components/navbar/SearchBar";
import { ScrollTop } from "primereact/scrolltop";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";

import { useEffect } from 'react';

/* -------------------------------------------------------------------------- */
/* Lazy-loaded list components                                               */
/* -------------------------------------------------------------------------- */
const Category = dynamic(() => import("@/components/lists/Category"), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground"></p>,
});

const Bookmark = dynamic(() => import("@/components/lists/Bookmark"), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground"></p>,
});

// We keep NewAnswers commented out as per your change
const NewAnswers = dynamic(() => import("@/components/lists/NewAnswers"), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground"></p>,
});

// IMPORT PATH MUST MATCH FILE LOCATION (src/components/lists/RandomAnswers.js)
const RandomAnswers = dynamic(() => import("@/components/lists/RandomAnswers"), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground"></p>,
});

const SelectedList = dynamic(() => import("@/components/lists/SelectedList"), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground"></p>,
});

/* -------------------------------------------------------------------------- */
/* Utility card wrapper                                                      */
/* -------------------------------------------------------------------------- */
function Card({ children }) {
  return (
    <div className="w-full rounded-[1.25rem] border border-muted/40 bg-background p-6 shadow-sm backdrop-blur-sm sm:p-8 md:p-10">
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                 */
/* -------------------------------------------------------------------------- */
export default function HomePage() {
  // Intersection observers for each component
  const { ref: catRef, inView: catInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: newAnsRef, inView: newAnsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: bookmarkRef, inView: bookmarkInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: selRef, inView: selInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div dir="rtl" className="font-arabic pb-8">
      {/* ---------------------------------------------------------------- */}
      {/* Hero Section                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-2 py-4 sm:px-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
        <Card>
          <header className="text-center">
            <h1 className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <HelpCircle className="h-6 w-6" />
              نیا سوال پوچھیں
            </h1>
            <h2 className="text-base text-muted-foreground">
              سمجھ نہیں آیا؟ مستند جواب حاصل کریں
            </h2>
          </header>

          <div className="mt-6 flex justify-center">
            <AskQuestionBtn />
          </div>

          <p className="mx-auto mt-6 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
            اپنا سوال اردو یا رومن اردو میں تحریر کریں۔ غیر ضروری معلومات شامل نہ کریں۔ جواب ویب سائٹ اور ای‑میل دونوں پر موصول ہو گا۔
          </p>
        </Card>

        <Card>
          <header className="mb-4 flex flex-col items-center gap-3 text-center">
            <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <SearchIcon className="h-6 w-6" />
              جوابات تلاش کریں
            </h1>
            <h2 className="text-base text-muted-foreground">
              آپ کو جواب تلاش کرنے سے مل سکتا ہے۔
            </h2>
          </header>

          <div className="flex lg:flex-row flex-col items-center lg:space-y-0 space-y-3 justify-center">
            <SearchBar />
            <Button asChild className="whitespace-nowrap w-27 h-9">
              <Link href="/search">
                <SearchIcon className="mr-2 h-4 w-4" />
                پیشرفته تلاش
              </Link>
            </Button>
          </div>

          <ul className="mx-auto mt-6 max-w-sm list-disc space-y-2 pr-5 text-xs leading-6 text-muted-foreground">
            <li>الفاظ کے درمیان صرف اسپیس دیں۔ ان میں سے کوئی بھی لفظ ملنے پر نتیجہ دکھایا جائے گا۔</li>
            <li>عبارت کو ڈبل کوٹس (&quot; &quot;) میں لکھیں تا کہ مکمل فقرہ ہی تلاش ہو۔</li>
          </ul>
        </Card>
        
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Main Content Grid                                               */}
      {/* ---------------------------------------------------------------- */}
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-2 pb-8 sm:px-4 lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block space-y-8">
          <div ref={catRef}>{catInView && <Category />}</div>
          <div ref={bookmarkRef}>{bookmarkInView && <Bookmark />}</div>
        </aside>

        {/* Answers Section */}
        <section className="space-y-6">
          {/* We use newAnsRef to trigger loading of RandomAnswers */}
          <div ref={newAnsRef}>{newAnsInView && <RandomAnswers />}</div>
          <div ref={selRef}>{selInView && <SelectedList />}</div>
          <div ref={selRef}>{selInView && <NewAnswers />}</div>
        </section>
      </main>

      <ScrollTop
        threshold={250}
        behavior="smooth"
        className="!right-4 !left-auto !bg-littleprimary text-white h-[35px] w-[35px] rounded-3xl hover:!bg-primary/90"
      />
    </div>
  );
}