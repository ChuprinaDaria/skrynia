'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import translations, { Language, Translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('UA');

  useEffect(() => {
    // Завантажуємо збережену мову з localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['UA', 'EN', 'DE', 'PL'].includes(savedLang)) {
      setLanguageState(savedLang);
      // Оновлюємо атрибут lang на html елементі
      if (typeof document !== 'undefined') {
        document.documentElement.lang = savedLang === 'UA' ? 'uk' : savedLang.toLowerCase();
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Оновлюємо атрибут lang на html елементі
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'UA' ? 'uk' : lang.toLowerCase();
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

