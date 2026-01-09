'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ShippingPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
              {t.shipping.title}
            </h1>
            <p className="font-inter text-sage text-lg">
              {t.shipping.subtitle}
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-footer-black border border-sage/20 rounded-sm p-8">
              <h2 className="font-rutenia text-2xl text-ivory mb-4">{t.shipping.delivery.title}</h2>
              <div className="space-y-4 text-sage font-inter">
                <p>
                  {t.shipping.delivery.intro}
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>{t.shipping.delivery.free}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>{t.shipping.delivery.standard}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>{t.shipping.delivery.express}</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="bg-footer-black border border-sage/20 rounded-sm p-8">
              <h2 className="font-rutenia text-2xl text-ivory mb-4">{t.shipping.payment.title}</h2>
              <div className="space-y-4 text-sage font-inter">
                <p>{t.shipping.payment.intro}</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>{t.shipping.payment.cards}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>{t.shipping.payment.paypal}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>{t.shipping.payment.transfer}</span>
                  </li>
                </ul>
                <p className="text-sm italic">
                  {t.shipping.payment.secure}
                </p>
              </div>
            </section>

            <section className="bg-footer-black border border-sage/20 rounded-sm p-8">
              <h2 className="font-rutenia text-2xl text-ivory mb-4">{t.shipping.returns.title}</h2>
              <div className="space-y-4 text-sage font-inter">
                <p>
                  {t.shipping.returns.intro}
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>{t.shipping.returns.days}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>{t.shipping.returns.condition}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>{t.shipping.returns.refund}</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
