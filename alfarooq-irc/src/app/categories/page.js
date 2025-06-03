'use client';

import React, { useState } from 'react';
import DynamicCategory from '@/components/lists/DynamicCategory';

export default function CategoryPage({ }) {
  // Get catId from route params

  return (
    <div
      dir="rtl"
      className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 font-arabic min-h-screen"
    >
      {/* Left panel: Categories and subcategories */}
      <DynamicCategory />

      {/* Right panel: Questions for selected subcategory (or category if none selected) */}
     
    </div>
  );
}
