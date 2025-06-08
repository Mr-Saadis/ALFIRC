"use client";

import {
  HelpCircle,
  Search as SearchIcon,
} from "lucide-react";

import Category from "@/components/lists/Category";
import NewAnswers from "@/components/lists/NewAnswers";
import SelectedList from "@/components/lists/SelectedList";
import AskQuestionBtn from "@/components/navbar/AskQuestionBtn";
import SearchBar from "@/components/navbar/SearchBar";

/* -------------------------------------------------------------------------- */
/*  Utility: simple card wrapper (JS‑safe, no TS types)                        */
/* -------------------------------------------------------------------------- */
function Card({ children }) {
  return (
    <div className="w-full max-w-xl rounded-[1.25rem] border border-muted/40 bg-background p-6 shadow-sm backdrop-blur-sm sm:p-8 md:p-10">
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main page                                                                 */
/* -------------------------------------------------------------------------- */
export default function HomePage() {
  return (
    <div dir="rtl" className="font-arabic">
      {/* ---------------------------------------------------------------- */}
      {/*  Hero – Search & Ask question cards                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-2 py-4 sm:px-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
        {/* Ask-question card */}
        <Card>
          <header className="text-center">
            <h1 className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <HelpCircle className="h-6 w-6" />
              نیا سوال پوچھیں
            </h1>
            <h2 className="text-base text-muted-foreground">
              سمجھ نہیں آیا؟ مستند جواب حاصل کریں
            </h2>
          </header>

          <div className="mt-6 flex justify-center">
            <AskQuestionBtn />
          </div>

          <p className="mx-auto mt-6 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
            اپنا سوال اردو یا رومن اردو میں تحریر کریں۔ غیر ضروری معلومات شامل نہ کریں۔ جواب ویب سائٹ اور ای‑میل دونوں پر موصول ہو گا۔
          </p>
        </Card>

        {/* Search card */}
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

          <SearchBar />

          <ul className="mx-auto mt-6 max-w-sm list-disc space-y-2 pr-5 text-xs leading-6 text-muted-foreground">
            <li>
              الفاظ کے درمیان صرف اسپیس دیں۔ ان میں سے کوئی بھی لفظ ملنے پر نتیجہ دکھایا جائے گا۔
            </li>
            <li>
              عبارت کو ڈبل کوٹس (" ") میں لکھیں تا کہ مکمل فقرہ ہی تلاش ہو۔
            </li>
          </ul>
        </Card>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Main content grid                                               */}
      {/* ---------------------------------------------------------------- */}
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-2 pb-8 sm:px-4 lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <Category />
        </aside>

        {/* Latest answers + selected list */}
        <section className="space-y-6">
          <NewAnswers />
          <SelectedList />
        </section>
      </main>
    </div>
  );
}
