'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

const Newsletter: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      {/* Background with texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-footer-black to-deep-black" />
      <div className="absolute inset-0 wood-texture opacity-5" />

      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Decorative top element */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-oxblood to-transparent" />
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="font-rutenia text-3xl md:text-4xl text-ivory mb-4">
              {t.newsletter.title}
            </h2>
            <p className="font-inter text-sage text-base md:text-lg">
              {t.newsletter.subtitle}
            </p>
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                required
                className="flex-grow px-6 py-4 bg-deep-black border border-sage/30 text-ivory placeholder-sage/50 rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all duration-300 font-inter"
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="whitespace-nowrap min-w-[150px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t.newsletter.subscribing}
                  </span>
                ) : (
                  t.newsletter.subscribe
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8 bg-deep-black border border-sage/30 rounded-sm animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-oxblood/20 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-oxblood"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-ivory font-inter text-lg mb-2">
                {t.newsletter.success.title}
              </p>
              <p className="text-sage text-sm">
                {t.newsletter.success.message}
              </p>
            </div>
          )}

          {/* Trust message */}
          <p className="text-center text-sage/60 text-xs mt-6 font-inter">
            {t.newsletter.privacy}
          </p>

          {/* Decorative bottom element */}
          <div className="flex justify-center mt-8">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-oxblood to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
