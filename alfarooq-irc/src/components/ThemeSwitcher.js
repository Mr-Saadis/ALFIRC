"use client";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/lib/themes';

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { currentTheme, applyTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- REDESIGNED MODAL CONTENT ---
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      
      {/* 1. Backdrop (Blur + Dark) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)} 
      />
      
      {/* 2. Beautiful, Minimal Card */}
      <div className="relative w-full max-w-[340px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Select Theme
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Body: Compact Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {themes.map((theme) => {
             const isActive = currentTheme === theme.id;
             return (
              <button
                key={theme.id}
                onClick={() => {
                  applyTheme(theme.id);
                  // setIsOpen(false); // Uncomment if you want auto-close
                }}
                className={`relative flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all duration-200 group
                  ${isActive 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                    : 'border-gray-200 dark:border-zinc-800 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }`}
              >
                {/* Color Dot */}
                <span 
                  className={`h-6 w-6 rounded-full shadow-sm border border-black/10 shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}
                  style={{ backgroundColor: theme.colors['--color-primary'] }}
                />
                
                {/* Name */}
                <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                  {theme.name}
                </span>

                {/* Checkmark (Floating) */}
                {isActive && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                )}
              </button>
             )
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. YOUR ORIGINAL BUTTON (Untouched) */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 lg:relative group items-center justify-center rounded-lg border border-muted bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
        className={`absolute top-1/2 right-full mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-3 py-1 text-xs text-gray-700 shadow-md z-50 transition-opacity duration-200 ease-in-out
          ${showTooltip ? 'opacity-100' : 'opacity-0'}
        `}
      >
        تھیم تبدیل کریں
      </div>

        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.74 5.74c.84.84 0 2.1-.84 2.94l-2.07 2.07a1.99 1.99 0 0 1-2.83 0L3.54 5c-.84-.84.84-2.52 1.68-1.68L12 2.69z"/>
          <path d="M14 15.5c-4.63-2.6-8-2-11 1.5"/>
        </svg>
      </button>

      {/* 2. Portal for the Redesigned Dialog */}
      {isOpen && mounted && createPortal(modalContent, document.body)}
    </>
  );
}