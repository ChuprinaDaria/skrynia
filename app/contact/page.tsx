import React from 'react';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-cinzel text-4xl md:text-5xl text-ivory mb-4">
              Контакт
            </h1>
            <p className="font-inter text-sage text-lg">
              Маєте питання? Ми завжди раді відповісти
            </p>
          </div>

          <div className="bg-footer-black border border-sage/20 rounded-sm p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-ivory font-inter mb-2">
                  Ім'я
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder="Ваше ім'я"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-ivory font-inter mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-ivory font-inter mb-2">
                  Тема
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder="Тема повідомлення"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-ivory font-inter mb-2">
                  Повідомлення
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all resize-none"
                  placeholder="Ваше повідомлення..."
                />
              </div>

              <Button type="submit" size="lg" fullWidth>
                Надіслати
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-sage/20">
              <h3 className="font-cinzel text-xl text-ivory mb-4">Інші способи зв'язку</h3>
              <div className="space-y-3 text-sage font-inter">
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@skrynia.com
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Польща, Європейський Союз
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
