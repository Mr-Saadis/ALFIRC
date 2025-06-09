'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';

export default function FilterPanel({ filters = { category: [], subcategory: [] }, onChange }) {
  const [openCat, setOpenCat] = useState(true);
  const [openSub, setOpenSub] = useState(false);
  const [catOptions, setCatOptions] = useState([]);
  const [subOptions, setSubOptions] = useState([]);

  useEffect(() => {
    async function loadOptions() {
      const { data: cats } = await supabase.from('Category').select('Cat_Name');
      const { data: subs } = await supabase.from('Subcategory').select('Subcat_Name, Category:Cat_ID!inner(Cat_Name)');
      setCatOptions(cats.map((c) => c.Cat_Name));
      setSubOptions(subs.map((s) => ({ name: s.Subcat_Name, category: s.Category.Cat_Name })));
    }
    loadOptions();
  }, []);

  const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const visibleSubOptions = subOptions.filter((s) => filters.category.includes(s.category));

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden rounded-2xl border-muted/40 bg-background/80 shadow-md backdrop-blur-md">
      <div className="h-1 w-full  from-primary/60 via-primary/40 to-primary/10"/>
      <div dir="rtl" className="p-6 flex flex-col gap-6">
        <section>
          <button onClick={() => setOpenCat(!openCat)} className="flex justify-between w-full text-sm font-semibold text-primary hover:text-primary/90">
            <span>{`زمرہ جات ${filters.category.length ? `(${filters.category.length})` : ''}`}</span>
            {openCat ? <ChevronUp/> : <ChevronDown/>}
          </button>
          {openCat && (
            <ul className="mt-2 grid gap-2">
              {catOptions.map((c) => (
                <li key={c} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted/20">
                  <Checkbox
                    checked={filters.category.includes(c)}
                    onCheckedChange={() => onChange({ category: toggle(filters.category, c) })}
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <button onClick={() => setOpenSub(!openSub)} className="flex justify-between w-full text-sm font-semibold text-primary hover:text-primary/90">
            <span>{`ذیلی زمرے ${filters.subcategory.length ? `(${filters.subcategory.length})` : ''}`}</span>
            {openSub ? <ChevronUp/> : <ChevronDown/>}
          </button>
          {openSub && (
            <ul className="mt-2 grid gap-2">
              {visibleSubOptions.map((s) => (
                <li key={s.name} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted/20">
                  <Checkbox
                    checked={filters.subcategory.includes(s.name)}
                    onCheckedChange={() => onChange({ subcategory: toggle(filters.subcategory, s.name) })}
                  />
                  <span>{s.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Card>
  );
}
