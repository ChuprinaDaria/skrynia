'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint } from '@/lib/api';

interface ContactInfo {
  id: number;
  email: string;
  phone: string | null;
  address: string | null;
}

export default function ContactPage() {
  const { t } = useLanguage();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
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
    fetchContactInfo();
  }, []);
  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
              {t.contact.title}
            </h1>
            <p className="font-inter text-sage text-lg">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="bg-footer-black border border-sage/20 rounded-sm p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-ivory font-inter mb-2">
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder={t.contact.form.namePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-ivory font-inter mb-2">
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder={t.contact.form.emailPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-ivory font-inter mb-2">
                  {t.contact.form.subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder={t.contact.form.subjectPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-ivory font-inter mb-2">
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all resize-none"
                  placeholder={t.contact.form.messagePlaceholder}
                />
              </div>

              <Button type="submit" size="lg" fullWidth>
                {t.contact.form.submit}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-sage/20">
              <h3 className="font-rutenia text-xl text-ivory mb-4">{t.contact.otherWays}</h3>
              <div className="space-y-3 text-sage font-inter">
                {contactInfo?.email && (
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-oxblood transition-colors">
                      {contactInfo.email}
                    </a>
                  </p>
                )}
                {contactInfo?.phone && (
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-oxblood transition-colors">
                      {contactInfo.phone}
                    </a>
                  </p>
                )}
                {contactInfo?.address ? (
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {contactInfo.address}
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t.contact.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
