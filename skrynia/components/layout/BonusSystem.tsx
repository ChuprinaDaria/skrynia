'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';

const BonusSystem: React.FC = () => {
  const { t } = useLanguage();

  const levels = [
    {
      name: t.home.bonusSystem.levels.human.name,
      description: t.home.bonusSystem.levels.human.description,
      bonus: t.home.bonusSystem.levels.human.bonus,
      icon: '👤',
      gradient: 'from-sage/20 to-sage/10',
    },
    {
      name: t.home.bonusSystem.levels.elf.name,
      description: t.home.bonusSystem.levels.elf.description,
      bonus: t.home.bonusSystem.levels.elf.bonus,
      requirement: t.home.bonusSystem.levels.elf.requirement,
      icon: '🧝',
      gradient: 'from-oxblood/30 to-oxblood/20',
    },
    {
      name: t.home.bonusSystem.levels.dwarf.name,
      description: t.home.bonusSystem.levels.dwarf.description,
      bonus: t.home.bonusSystem.levels.dwarf.bonus,
      requirement: t.home.bonusSystem.levels.dwarf.requirement,
      icon: '🧙',
      gradient: 'from-ivory/20 to-ivory/10',
    },
  ];

  const benefits = [
    {
      icon: (
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      text: t.home.bonusSystem.benefits.earn,
    },
    {
      icon: (
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      text: t.home.bonusSystem.benefits.use,
    },
    {
      icon: (
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      ),
      text: t.home.bonusSystem.benefits.track,
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4 bg-deep-black relative overflow-hidden" aria-labelledby="bonus-system-title">
      {/* Decorative background */}
      <div className="absolute inset-0 parchment-texture opacity-5" aria-hidden="true" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16 max-w-3xl mx-auto">
            <h2 id="bonus-system-title" className="font-rutenia text-3xl md:text-5xl text-ivory mb-6">
              {t.home.bonusSystem.title}
            </h2>
            <p className="font-inter text-sage text-lg mb-4">
              {t.home.bonusSystem.subtitle}
            </p>
            <p className="font-inter text-sage/80 text-base">
              {t.home.bonusSystem.description}
            </p>
          </header>

          {/* Levels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {levels.map((level, index) => (
              <div
                key={index}
                className={`bg-footer-black border border-sage/20 rounded-sm p-6 hover:border-oxblood/50 transition-all duration-300 relative overflow-hidden`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient} opacity-30`} aria-hidden="true" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-5xl mb-4 text-center" aria-hidden="true">
                    {level.icon}
                  </div>
                  
                  {/* Level Name */}
                  <h3 className="font-rutenia text-2xl text-ivory mb-2 text-center">
                    {level.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="font-inter text-sage text-sm mb-4 text-center">
                    {level.description}
                  </p>
                  
                  {/* Bonus */}
                  <div className="bg-deep-black/50 rounded-sm p-4 mb-3">
                    <p className="font-inter text-oxblood font-semibold text-center">
                      {level.bonus}
                    </p>
                  </div>
                  
                  {/* Requirement (if exists) */}
                  {level.requirement && (
                    <p className="font-inter text-sage/60 text-xs text-center">
                      {level.requirement}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-8 mb-12">
            <h3 className="font-rutenia text-2xl text-ivory mb-6 text-center">
              {t.home.bonusSystem.benefits.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-oxblood/20 rounded-sm flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-oxblood"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      {benefit.icon}
                    </svg>
                  </div>
                  <p className="font-inter text-sage text-sm">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/register">
              <Button size="lg" variant="primary" className="px-12">
                {t.home.bonusSystem.cta}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BonusSystem;

