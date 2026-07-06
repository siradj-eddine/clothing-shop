'use client';

import { useEffect, ReactNode } from 'react';

export default function RTLProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, []);

  return <>{children}</>;
}