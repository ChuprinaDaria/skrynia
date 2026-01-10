'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, ArrowLeft, Check } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function QuoteRequestPage() {
  const router = useRouter();

  const [necklaceData, setNecklaceData] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    customer_name: '',
    customer_phone: '',
    comment: '',
    language: 'uk',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load necklace data from localStorage
    const savedData = localStorage.getItem('pending_necklace_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setNecklaceData(data);
      } catch (e) {
        console.error('Failed to parse necklace data:', e);
        router.push('/constructor');
      }
    } else {
      router.push('/constructor');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!necklaceData) {
      alert('Дані намиста відсутні');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(getApiEndpoint('/api/v1/quotes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          customer_name: formData.customer_name || null,
          customer_phone: formData.customer_phone || null,
          comment: formData.comment || null,
          language: formData.language,
          necklace_data: necklaceData,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        localStorage.removeItem('pending_necklace_data');

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        const error = await res.json();
        alert(`Помилка: ${error.detail || 'Не вдалося надіслати запит'}`);
      }
    } catch (error) {
      console.error('Failed to submit quote request:', error);
      alert('Помилка при відправці запиту');
    } finally {
      setSubmitting(false);
    }
  };

  if (!necklaceData) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <p className="text-ivory">Завантаження...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-sage/20 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-sage" />
            </div>
          </div>
          <h1 className="font-cinzel text-3xl text-ivory mb-4">Запит Надіслано!</h1>
          <p className="text-sage/70 mb-6">
            Дякуємо за ваш запит. Ми надішлемо вам детальний прорахунок протягом 24 годин на вказану електронну адресу.
          </p>
          <p className="text-sm text-sage/50">
            Переадресація на головну сторінку...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black">
      {/* Header */}
      <header className="bg-footer-black border-b border-sage/20 py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/constructor"
            className="flex items-center gap-2 text-ivory hover:text-sage transition-colors w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-inter">Повернутися до конструктора</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-cinzel text-4xl text-ivory mb-2">Запит на Прорахунок</h1>
          <p className="text-sage/70 mb-8">
            Заповніть форму нижче, і ми надішлемо вам детальний прорахунок вартості вашого намиста.
          </p>

          {/* Necklace Summary */}
          <div className="bg-footer-black rounded-sm p-6 mb-8">
            <h2 className="font-cinzel text-xl text-ivory mb-4">Ваше Намисто</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-sage/70">Кількість ниток:</span>
                <span className="text-ivory">{necklaceData.threads.length}</span>
              </div>
              {necklaceData.threads.map((thread: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sage/70">Нитка {thread.thread_number}:</span>
                  <span className="text-ivory">
                    {thread.length_cm} см, {thread.beads.length} бусин
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-sage/20">
                <span className="text-sage/70">Застібка:</span>
                <span className="text-ivory">
                  {necklaceData.clasp ? 'Вибрано' : 'Не вибрано'}
                </span>
              </div>
            </div>
          </div>

          {/* Quote Request Form */}
          <form onSubmit={handleSubmit} className="bg-footer-black rounded-sm p-6">
            <h2 className="font-cinzel text-xl text-ivory mb-6">Контактні Дані</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Email <span className="text-oxblood">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Ім'я
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  placeholder="Ваше ім'я"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  placeholder="+48 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Мова листування
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                >
                  <option value="uk">Українська</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="pl">Polski</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Коментар
                </label>
                <textarea
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  placeholder="Додаткові побажання або питання..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Link href="/constructor">
                <Button variant="secondary">Повернутися</Button>
              </Link>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  'Відправка...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Надіслати Запит
                  </>
                )}
              </Button>
            </div>

            <p className="mt-6 text-xs text-sage/50 text-center">
              Ми надішлемо вам детальний прорахунок вартості з переліком всіх бусин та інформацією про терміни виготовлення протягом 24 годин.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
