'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint } from '@/lib/api';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Токен верифікації не знайдено');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(
        getApiEndpoint(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`),
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        let errorMessage = 'Помилка верифікації email';
        try {
          const data = await response.json();
          errorMessage = data.detail || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setStatus('success');
      setMessage(data.message || 'Email успішно підтверджено!');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setStatus('error');
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setMessage('Не вдалося підключитися до сервера. Перевірте з\'єднання.');
      } else {
        setMessage(err instanceof Error ? err.message : 'Помилка верифікації email');
      }
      console.error('Email verification error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-footer-black border border-sage/20 rounded-sm p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="mb-4">
                <svg
                  className="animate-spin w-16 h-16 text-sage mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h2 className="font-rutenia text-2xl text-ivory mb-4">
                Перевірка email...
              </h2>
              <p className="text-sage">
                Будь ласка, зачекайте, поки ми підтверджуємо вашу електронну адресу.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-sage mx-auto"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-rutenia text-2xl text-ivory mb-4">
                Email підтверджено!
              </h2>
              <p className="text-sage mb-6">
                {message}
              </p>
              <p className="text-sage text-sm mb-6">
                Тепер ви можете увійти до свого акаунту.
              </p>
              <p className="text-sage text-sm">
                Перенаправлення на сторінку входу...
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push('/login')} size="lg" fullWidth>
                  Перейти до входу
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-oxblood mx-auto"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-rutenia text-2xl text-ivory mb-4">
                Помилка верифікації
              </h2>
              <div className="mb-6 p-3 bg-oxblood/20 border border-oxblood/50 rounded-sm">
                <p className="text-oxblood text-sm">
                  {message}
                </p>
              </div>
              <p className="text-sage text-sm mb-6">
                Можливо посилання застаріло або невірне. Спробуйте зареєструватися знову або зв'яжіться з підтримкою.
              </p>
              <div className="space-y-3">
                <Button onClick={() => router.push('/register')} size="lg" fullWidth>
                  Повернутися до реєстрації
                </Button>
                <Link
                  href="/login"
                  className="block text-center text-sage hover:text-ivory transition-colors text-sm"
                >
                  Або спробувати увійти
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
