'use client';

import React, { useEffect, useState } from 'react';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with radial gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-deep-black/80 via-deep-black to-deep-black" />

      {/* Parchment texture overlay */}
      <div className="absolute inset-0 parchment-texture opacity-10" />

      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-sage/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Alatyr Symbol */}
        <div
          className={`flex justify-center mb-8 transition-all duration-1000 ${
            isVisible
              ? 'opacity-100 rotate-0'
              : 'opacity-0 rotate-180'
          }`}
        >
          <AlatyrIcon
            size={100}
            variant="oxblood"
            className="animate-rotate-slow drop-shadow-[0_0_20px_rgba(102,0,0,0.6)]"
          />
        </div>

        {/* Brand Name */}
        <h1
          className={`font-cinzel text-4xl md:text-6xl lg:text-7xl text-ivory mb-4 tracking-wider transition-all duration-1000 delay-200 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          Скриня Пані Дарії
        </h1>

        {/* Subtitle */}
        <p
          className={`font-inter text-lg md:text-xl lg:text-2xl text-sage mb-12 tracking-wide transition-all duration-1000 delay-400 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          Автентичні Скарби Спадщини
        </p>

        {/* CTA Button */}
        <div
          className={`transition-all duration-1000 delay-600 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Link href="/collections">
            <Button
              size="lg"
              className="group relative overflow-hidden animate-pulse-slow hover:animate-none"
            >
              <span className="relative z-10">Відкрити Скриню</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </Link>
        </div>

        {/* Tagline */}
        <p
          className={`mt-8 font-inter text-sm md:text-base text-sage/60 italic transition-all duration-1000 delay-800 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          Кожна прикраса — портал до історії наших предків
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <svg
          className="w-6 h-6 text-sage"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
