'use client';

import React from 'react';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import Script from 'next/script';

// JSON-LD для сторінки "Про нас"
const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Про Скриню Пані Дарії',
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
  const { t } = useLanguage();
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
                {t.about.title}
              </h1>
              <p className="font-inter text-sage text-lg">
                {t.about.subtitle}
              </p>
            </header>

            {/* Content */}
            <article className="space-y-8 font-inter text-ivory leading-relaxed">
              <section aria-labelledby="history-title">
                <h2 id="history-title" className="font-rutenia text-2xl md:text-3xl text-ivory mb-4">
                  {t.about.history.title}
                </h2>
                <p className="text-sage">
                  {t.about.history.content}
                </p>
              </section>

              <section aria-labelledby="mission-title">
                <h2 id="mission-title" className="font-rutenia text-2xl md:text-3xl text-ivory mb-4">
                  {t.about.mission.title}
                </h2>
                <p className="text-sage">
                  {t.about.mission.content}
                </p>
              </section>

              <section aria-labelledby="quality-title">
                <h2 id="quality-title" className="font-rutenia text-2xl md:text-3xl text-ivory mb-4">
                  {t.about.quality.title}
                </h2>
                <div className="space-y-4 text-sage">
                  <p>
                    {t.about.quality.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t.about.quality.materials.coral}</li>
                    <li>{t.about.quality.materials.silver}</li>
                    <li>{t.about.quality.materials.amber}</li>
                    <li>{t.about.quality.materials.gemstone}</li>
                  </ul>
                  <p>
                    {t.about.quality.conclusion}
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
