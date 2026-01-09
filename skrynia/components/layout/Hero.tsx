'use client';

import React, { useEffect, useState } from 'react';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { t } = useLanguage();
  const heroBgPath = '/images/hero/hero-gemini.png';

  useEffect(() => {
    setIsVisible(true);
    
    // Preload background image
    const img = new Image();
    img.src = heroBgPath;
    img.onload = () => setIsImageLoaded(true);
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#0a0a0a', // Deep black complementary background
      }}
    >
      {/* Background Image Container:
          - blurred "cover" layer to avoid sharp edges
          - main "contain" layer centered
          - vignette overlay for soft borders */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* Blurred underlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBgPath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(50px)',
            transform: 'scale(1.18)',
            opacity: 0.65,
          }}
        />

        {/* Main image */}
      <div
        className="absolute inset-0"
        style={{
            backgroundImage: `url(${heroBgPath})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          padding: 'clamp(1rem, 3vw, 3rem)',
            // Fade edges of the "contain" image so it blends into the blurred underlay
            WebkitMaskImage:
              'radial-gradient(ellipse at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.15) 82%, rgba(0,0,0,0) 100%)',
            maskImage:
              'radial-gradient(ellipse at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.15) 82%, rgba(0,0,0,0) 100%)',
        }}
        />

        {/* Soft vignette to hide borders + improve contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, rgba(10, 10, 10, 0.02) 0%, rgba(10, 10, 10, 0.72) 68%, rgba(10, 10, 10, 0.96) 100%),
              linear-gradient(to bottom, rgba(10, 10, 10, 0.62) 0%, rgba(10, 10, 10, 0.18) 30%, rgba(10, 10, 10, 0.62) 100%)
            `,
          }}
        />

        {/* Fallback gradient while image loads */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-radial from-deep-black/80 via-deep-black to-deep-black" />
        )}
      </div>

      {/* Subtle overlay for text readability - dark gradient from edges */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.3) 40%, rgba(10, 10, 10, 0.7) 100%),
            linear-gradient(to bottom, rgba(10, 10, 10, 0.4) 0%, transparent 20%, transparent 80%, rgba(10, 10, 10, 0.4) 100%),
            linear-gradient(to right, rgba(10, 10, 10, 0.3) 0%, transparent 15%, transparent 85%, rgba(10, 10, 10, 0.3) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Additional mystical overlay - subtle red glow for atmosphere */}
      <div 
        className="absolute inset-0 z-10 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, rgba(102, 0, 0, 0.15) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Parchment texture overlay - very subtle */}
      <div className="absolute inset-0 z-10 parchment-texture opacity-5" aria-hidden="true" />

      {/* Floating particles effect - reduced opacity to not interfere with background */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-sage/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto w-full">
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
          className={`font-rutenia text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-ivory mb-4 tracking-wider transition-all duration-1000 delay-200 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(102, 0, 0, 0.3)',
          }}
        >
          {t.hero.title}
        </h1>

        {/* Subtitle */}
        <p
          className={`font-inter text-base md:text-lg lg:text-xl xl:text-2xl text-sage mb-12 tracking-wide transition-all duration-1000 delay-400 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          {t.hero.subtitle}
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
              className="group relative overflow-hidden animate-pulse-slow hover:animate-none shadow-lg"
              style={{
                boxShadow: '0 4px 20px rgba(102, 0, 0, 0.4)',
              }}
            >
              <span className="relative z-10">{t.hero.cta}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </Link>
        </div>

        {/* Tagline */}
        <p
          className={`mt-8 font-inter text-sm md:text-base text-sage/70 italic transition-all duration-1000 delay-800 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
          }}
        >
          {t.hero.tagline}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow z-10" 
        aria-hidden="true"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))',
        }}
      >
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
