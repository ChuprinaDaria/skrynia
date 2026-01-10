'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'UA' as const, flag: '🇺🇦', name: 'Українська' },
    { code: 'EN' as const, flag: '🇬🇧', name: 'English' },
    { code: 'DE' as const, flag: '🇩🇪', name: 'Deutsch' },
    { code: 'PL' as const, flag: '🇵🇱', name: 'Polski' },
    { code: 'SE' as const, flag: '🇸🇪', name: 'Svenska' },
    { code: 'NO' as const, flag: '🇳🇴', name: 'Norsk' },
    { code: 'DK' as const, flag: '🇩🇰', name: 'Dansk' },
    { code: 'FR' as const, flag: '🇫🇷', name: 'Français' },
  ];

  const navLinks = [
    { href: '/collections', label: t.nav.collections },
    { href: '/constructor', label: t.nav['constructor'] },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glassmorphism border-b border-sage/30' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20 md:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <AlatyrIcon
              size={40}
              variant="oxblood"
              className="transition-transform duration-300 group-hover:rotate-180"
            />
            <span className="font-rutenia text-lg md:text-xl text-ivory group-hover:text-oxblood transition-colors duration-300 hidden sm:block">
              {t.hero.title}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-ivory hover:text-oxblood transition-colors duration-300 font-inter text-base group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-oxblood transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-sm text-sm font-inter transition-all duration-200 ${
                    language === lang.code
                      ? 'bg-oxblood/20 text-oxblood font-semibold border border-oxblood/50'
                      : 'text-ivory hover:text-sage hover:bg-sage/10'
                  }`}
                  aria-label={`Switch to ${lang.name}`}
                  title={lang.name}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="hidden xl:inline">{lang.code}</span>
                </button>
              ))}
            </div>

            {/* Constructor Button */}
            <Link
              href="/constructor"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-oxblood/20 hover:bg-oxblood/30 border border-oxblood/50 rounded-sm text-ivory hover:text-oxblood transition-colors duration-200 font-inter text-sm"
              aria-label="Necklace Constructor"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden lg:inline">{t.nav['constructor']}</span>
            </Link>

            {/* Search Icon */}
            <button
              className="text-ivory hover:text-oxblood transition-colors duration-200"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Icon - opens drawer instead of navigating */}
            <button
              onClick={openCart}
              className="relative text-ivory hover:text-oxblood transition-colors duration-200"
              aria-label="Shopping cart"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-oxblood text-ivory text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-ivory hover:text-oxblood transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glassmorphism border-b border-sage/30 animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ivory hover:text-oxblood transition-colors duration-300 font-rutenia text-xl py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Constructor Button */}
            <Link
              href="/constructor"
              className="mt-2 px-4 py-3 bg-oxblood/20 hover:bg-oxblood/30 border border-oxblood/50 rounded-sm text-ivory hover:text-oxblood transition-colors duration-200 font-inter text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.nav['constructor']}
            </Link>

            {/* Mobile Language Switcher */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-sage/20">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-sm transition-all duration-200 ${
                    language === lang.code
                      ? 'bg-oxblood/20 text-oxblood font-semibold border border-oxblood/50'
                      : 'text-ivory hover:text-sage hover:bg-sage/10 border border-transparent'
                  }`}
                  title={lang.name}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-xs font-inter">{lang.code}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
