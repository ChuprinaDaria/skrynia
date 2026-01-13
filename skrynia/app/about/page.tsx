'use client';

import React, { useState, useEffect } from 'react';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import Script from 'next/script';
import { getApiEndpoint } from '@/lib/api';

// JSON-LD для сторінки "Про нас"
const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Про Rune Box',
  description: 'Історія створення та філософія бренду автентичних прикрас ручної роботи',
  url: 'https://runebox.eu/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Rune box',
    foundingDate: '2020',
    founder: {
      '@type': 'Person',
      name: 'Дарія',
      jobTitle: 'Майстер ювелірних виробів',
    },
    knowsAbout: [
      'Слов\'янські символи',
      'Вікінгські орнаменти',
      'Кельтські візерунки',
      'Ювелірна справа',
      'Ручна робота з коралом',
      'Срібло 925 проби',
    ],
  },
};

export default function AboutPage() {
  const { t, language } = useLanguage();
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Map language codes
  const langMap: Record<string, string> = {
    'UA': 'ua',
    'EN': 'en',
    'DE': 'de',
    'PL': 'pl',
    'SE': 'se',
    'NO': 'no',
    'DK': 'dk',
    'FR': 'fr',
  };

  const currentLang = langMap[language] || 'ua';

  useEffect(() => {
    fetchAboutPage();
  }, []);

  const fetchAboutPage = async () => {
    try {
      const res = await fetch(getApiEndpoint('/api/v1/about-page/'));
      if (res.ok) {
        const data = await res.json();
        setAboutData(data);
      }
    } catch (error) {
      console.error('Failed to fetch about page:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get content for current language, fallback to translations
  const getContent = (field: string, fallback: string) => {
    if (aboutData && aboutData[`${field}_${currentLang}`]) {
      return aboutData[`${field}_${currentLang}`];
    }
    return fallback;
  };

  const title = getContent('title', t.about.title);
  const subtitle = getContent('subtitle', t.about.subtitle);
  const historyTitle = getContent('history_title', t.about.history.title);
  const historyContent = getContent('history_content', t.about.history.content);
  const missionTitle = getContent('mission_title', t.about.mission.title);
  const missionContent = getContent('mission_content', t.about.mission.content);
  const qualityTitle = getContent('quality_title', t.about.quality.title);
  const qualityIntro = getContent('quality_intro', t.about.quality.intro);
  const qualityCoral = getContent('quality_coral', t.about.quality.materials.coral);
  const qualitySilver = getContent('quality_silver', t.about.quality.materials.silver);
  const qualityAmber = getContent('quality_amber', t.about.quality.materials.amber);
  const qualityGemstone = getContent('quality_gemstone', t.about.quality.materials.gemstone);
  const qualityConclusion = getContent('quality_conclusion', t.about.quality.conclusion);

  return (
    <>
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="min-h-screen bg-deep-black pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="text-center mb-16">
              <div className="flex justify-center mb-8">
                <AlatyrIcon size={120} variant="oxblood" />
              </div>
              <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-6">
                {title}
              </h1>
              <p className="font-inter text-sage text-lg">
                {subtitle}
              </p>
            </header>

            {/* Content */}
            <article className="space-y-8 font-inter text-ivory leading-relaxed">
              <section aria-labelledby="history-title">
                <h2 id="history-title" className="font-rutenia text-2xl md:text-3xl text-ivory mb-4">
                  {historyTitle}
                </h2>
                <p className="text-sage">
                  {historyContent}
                </p>
              </section>

              <section aria-labelledby="mission-title">
                <h2 id="mission-title" className="font-rutenia text-2xl md:text-3xl text-ivory mb-4">
                  {missionTitle}
                </h2>
                <p className="text-sage">
                  {missionContent}
                </p>
              </section>

              <section aria-labelledby="quality-title">
                <h2 id="quality-title" className="font-rutenia text-2xl md:text-3xl text-ivory mb-4">
                  {qualityTitle}
                </h2>
                <div className="space-y-4 text-sage">
                  <p>
                    {qualityIntro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{qualityCoral}</li>
                    <li>{qualitySilver}</li>
                    <li>{qualityAmber}</li>
                    <li>{qualityGemstone}</li>
                  </ul>
                  <p>
                    {qualityConclusion}
                  </p>
                </div>
              </section>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
