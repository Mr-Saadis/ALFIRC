// src/app/page.js
import NewAnswers   from '@/components/lists/NewAnswers';
import SelectedList from '@/components/lists/SelectedList';
import Category     from '@/components/lists/Category';

export default function Home() {
  return (
    <main
      dir="rtl"
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 font-arabic"
    >
      {/* -------------------------------------------------------------- */}
      {/*  Ask-question button                                          */}
      {/* -------------------------------------------------------------- */}
      <div className="flex justify-center mt-6 mb-8">
        <button className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-2 rounded-full shadow hover:bg-primary/90 transition">
          نیا سوال پوچھیں
        </button>
      </div>

      {/* -------------------------------------------------------------- */}
      {/*  Responsive grid                                               */}
      {/*  lg:  | 20% categories | 40% main | 40% extra |                */}
      {/*  md:  | 30% categories | 70% main  |                           */}
      {/*  sm:  single-column                                           */}
      {/* -------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6">
        {/* -------- Categories rail (right in RTL) -------- */}
        <aside className="md:col-span-4 lg:col-span-3 order-2 md:order-1">
          <Category />
        </aside>

        {/* -------- Main column (selected + new answers) -------- */}
        <section className="md:col-span-8 lg:col-span-6 order-1 md:order-2 space-y-10">
          <SelectedList />
          <NewAnswers />
        </section>

        {/* -------- Optional extra rail (ads / widgets) -------- */}
        <aside className="hidden lg:block lg:col-span-3 order-3">
         
        </aside>
      </div>
    </main>
  );
}
