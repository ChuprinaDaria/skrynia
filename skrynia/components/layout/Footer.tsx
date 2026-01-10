'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Facebook, Twitter, Youtube, Linkedin, MessageCircle, Share2 } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon_name: string | null;
  is_active: boolean;
  display_order: number;
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  pinterest: Share2, // Using Share2 as fallback for Pinterest
  telegram: MessageCircle,
  tiktok: Share2,
};

interface ContactInfo {
  id: number;
  email: string;
  phone: string | null;
  address: string | null;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t, language, setLanguage } = useLanguage();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetchSocialLinks();
    fetchContactInfo();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const res = await fetch(getApiEndpoint('/api/v1/social-links/?is_active=true'));
      if (res.ok) {
        const data = await res.json();
        setSocialLinks(data);
      }
    } catch (error) {
      console.error('Failed to fetch social links:', error);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const res = await fetch(getApiEndpoint('/api/v1/contact-info/'));
      if (res.ok) {
        const data = await res.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
    }
  };

  const quickLinks = [
    { href: '/collections', label: t.footer.collections },
    { href: '/about', label: t.footer.about },
    { href: '/shipping', label: t.footer.shipping },
    { href: '/contact', label: t.nav.contact },
  ];

  const legalLinks = [
    { href: '/regulamin', label: t.legal.terms },
    { href: '/polityka-prywatnosci', label: t.legal.privacy },
    { href: '/odstapienie', label: t.legal.withdrawal },
  ];

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

  return (
    <footer className="bg-footer-black border-t border-sage/20 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <AlatyrIcon size={50} variant="oxblood" />
              <div>
                <h3 className="font-rutenia text-lg text-ivory">{t.hero.title}</h3>
                <p className="text-sage text-sm">{t.footer.brandDescription}</p>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-rutenia text-ivory text-lg mb-4">{t.footer.navigation}</h4>
            <ul className="flex flex-col gap-2 mb-6">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ivory hover:text-oxblood transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-rutenia text-ivory text-lg mb-4">{t.legal.terms}</h4>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sage hover:text-oxblood transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-rutenia text-ivory text-lg mb-4">{t.footer.contact}</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="text-ivory">
                <strong>DARIA CHUPRINA</strong>
              </li>
              <li className="text-sage">
                NIP: 8982319083
              </li>
              {contactInfo?.email && (
                <li className="flex items-center gap-2 text-ivory">
                  <svg
                    className="w-4 h-4 text-sage"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-oxblood transition-colors duration-200"
                  >
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.address ? (
                <li className="flex items-center gap-2 text-ivory">
                  <svg
                    className="w-4 h-4 text-sage"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{contactInfo.address}</span>
                </li>
              ) : (
                <li className="flex items-center gap-2 text-ivory">
                  <svg
                    className="w-4 h-4 text-sage"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>ul. Wojciecha Gersona 9/7, 51-664 Wrocław, Polska</span>
                </li>
              )}
            </ul>
          </div>

          {/* Languages & Social Column */}
          <div>
            <h4 className="font-rutenia text-ivory text-lg mb-4">{t.footer.languages}</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`text-2xl transition-all duration-200 hover:scale-110 ${
                    language === lang.code ? 'grayscale-0 opacity-100' : 'grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                  }`}
                  aria-label={`Switch to ${lang.name}`}
                  title={lang.name}
                >
                  {lang.flag}
                </button>
              ))}
            </div>

            {/* Social Media */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const IconComponent = PLATFORM_ICONS[link.platform.toLowerCase()] || Share2;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ivory hover:text-oxblood transition-colors duration-200"
                      aria-label={link.platform}
                      title={link.platform}
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sage/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sage text-sm opacity-60">
            © {currentYear} {t.footer.copyright}
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-4 opacity-60">
            <span className="text-sage text-xs">{t.footer.acceptPayments}</span>
            <div className="flex gap-2 grayscale">
              <svg className="h-6" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1434CB" />
                <path
                  d="M20.5 10h7l-2 12h-7l2-12z"
                  fill="#fff"
                />
              </svg>
              <svg className="h-6" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#EB001B" />
                <circle cx="19" cy="16" r="7" fill="#F79E1B" />
                <circle cx="29" cy="16" r="7" fill="#FF5F00" />
              </svg>
              <svg className="h-6" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#003087" />
                <path
                  d="M14 10h4l-2 12h-4l2-12zm16 0h-4l-2 12h4l2-12z"
                  fill="#fff"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
