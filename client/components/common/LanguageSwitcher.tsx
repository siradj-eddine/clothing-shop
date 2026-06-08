'use client';

import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };
  
  const currentLang = i18n.language;
  
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          currentLang === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          currentLang === 'fr'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          currentLang === 'ar'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        AR
      </button>
    </div>
  );
}