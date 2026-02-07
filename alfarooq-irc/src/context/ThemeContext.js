"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { themes } from '@/lib/themes'; // Adjust path if you put themes.js elsewhere

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('default');

  // Load saved theme from localStorage when the app starts
  useEffect(() => {
    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId) => {
    const selectedTheme = themes.find(t => t.id === themeId);
    if (!selectedTheme) return;

    // 1. Update State
    setCurrentTheme(themeId);

    // 2. Update CSS Variables in the <html> tag
    const root = document.documentElement;
    Object.entries(selectedTheme.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // 3. Save to LocalStorage
    localStorage.setItem('site-theme', themeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);