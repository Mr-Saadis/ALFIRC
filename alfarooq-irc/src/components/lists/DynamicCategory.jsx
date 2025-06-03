'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGrid, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Spinner } from 'flowbite-react';
import Cat_Subcat_Answers from './Cat_Subcat_Answers';

const TABS = [
  { key: 'false', label: 'احکام و مسائل' },
  { key: 'true', label: 'تحقیق و تخریج' },
  // مزید ٹیَب شامل کریں اگر چاہیں
];

function CategoryAccordion({ cat, onSubcatSelect, onCatSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="bg-white rounded-xl shadow-sm mb-4">
      <div
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-center p-4 cursor-pointer"
      >
        <div className="flex flex-col w-full justify-center items-center gap-4">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onCatSelect(cat.id);
            }}
            className="text-[16px] font-[600] text-[#111928] hover:text-blue-600 transition"
          >
            {cat.name}
          </button>
          <div className="flex justify-around gap-4 w-full">
            <span className="text-[15px] text-gray-500">جوابات: {cat.answers}</span>
            <span className="text-[15px] text-gray-500">
              ذیلی زمرے: {cat.subcategories.length}
            </span>
          </div>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            setOpen(v => !v);
          }}
          className="p-1 rounded hover:bg-gray-100 transition"
          aria-label={open ? 'Hide subcategories' : 'Show subcategories'}
          type="button"
        >
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>
      {open && (
        <ul className="border-t flex flex-col px-4 pt-4 pb-4 space-y-2 rtl text-right">
          {cat.subcategories.map(sub => (
            <li key={sub.id}>
              <button
                type="button"
                onClick={() => onSubcatSelect(sub.id)}
                className="flex justify-between flex-row-reverse pl-3 pr-3 items-center text-[16px] text-gray-700 p-1 rounded-[8px] hover:bg-gray-100 transition w-full"
              >
                {sub.name} •
                <span className="text-[14px] text-gray-500">جوابات : {sub.answers}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function DynamicCategory() {
  const [activeTab, setActiveTab] = useState('true');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [selectedSubcatId, setSelectedSubcatId] = useState(null);
  const [selectedAssignT, setSelectedAssignT] = useState(true);

  const onCatSelect = (catId) => {
    setSelectedCatId(catId);
    setSelectedSubcatId(null); // Reset subcategory when category changes
    setSelectedAssignT(activeTab); // Update assignT based on active tab

  };

  const onSubcatSelect = (subcatId) => {
    setSelectedSubcatId(subcatId);
    setSelectedCatId(null); // Optional: reset category on subcat select if logic requires
    setSelectedAssignT(activeTab); // Update assignT based on active tab
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/categories_sub/?assign=${activeTab}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load categories');
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setSelectedCatId(null);
        setSelectedSubcatId(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-screen" dir="rtl">
      {/* Questions List Section */}
     

      {/* Categories Section */}
      <aside className="relative max-w-md min-w-full font-arabic bg-white rounded-2xl shadow-md h-[600px] p-6 pt-12 flex flex-col overflow-hidden">
        <div className="flex justify-between  items-center mb-6">
          <h1 className="text-2xl font-bold">زمرہ جات</h1>
        </div>

        <div className="flex justify-end mb-4">
          <ul className="flex space-x-6 rtl:space-x-reverse flex-row-reverse border-b">
            {TABS.map(tab => (
              <li
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer pb-2 ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                role="tab"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter') setActiveTab(tab.key) }}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-full">
            <Spinner aria-label="Loading categories" size="md" />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        {!loading && !error && (
          <ul className="overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
            {categories.map(cat => (
              <CategoryAccordion
                key={cat.id}
                cat={cat}
                onSubcatSelect={onSubcatSelect}
                onCatSelect={onCatSelect}
              />
            ))}
          </ul>
        )}
      </aside>
       <main className="flex-1 min-w-full min-h-full">
        <Cat_Subcat_Answers catId={selectedCatId} subcatId={selectedSubcatId} Assign_T={selectedAssignT} />
      </main>
    </div>
  );
}
