'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t.register.errors.passwordsMismatch);
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.register.errors.passwordTooShort);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiEndpoint('/api/v1/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name || null,
          language: language.toUpperCase(), // Send user's preferred language
        }),
      });

      if (!response.ok) {
        let errorMessage = t.register.errors.defaultError;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            errorMessage = data.detail || errorMessage;
          } else {
            // Server returned HTML error page (500, 502, etc.)
            const text = await response.text();
            if (response.status === 500) {
              errorMessage = t.register.errors.serverError;
            } else {
              errorMessage = `${t.register.errors.defaultError} ${response.status}: ${response.statusText}`;
            }
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = t.register.errors.serverError;
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError(t.auth.errors.networkError);
      } else if (err instanceof SyntaxError) {
        // JSON parsing error - server probably returned HTML error page
        setError(t.register.errors.serverError);
      } else {
        setError(t.register.errors.defaultError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-footer-black border border-sage/20 rounded-sm p-8 text-center">
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
              {t.register.success.title}
            </h2>
            <p className="text-sage mb-6">
              {t.register.success.message} <strong>{formData.email}</strong>.
              {language === 'UA' && ' Будь ласка, перевірте пошту та натисніть на посилання для активації акаунту.'}
            </p>
            <p className="text-sage text-sm">
              {t.register.success.redirecting}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
              {t.register.title}
            </h1>
            <p className="font-inter text-sage text-lg">
              {t.register.subtitle}
            </p>
          </div>

          <div className="bg-footer-black border border-sage/20 rounded-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block text-ivory font-inter mb-2">
                  {t.register.fullName}
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder={t.register.fullNamePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-ivory font-inter mb-2">
                  {t.register.email} <span className="text-oxblood">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder={t.register.emailPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-ivory font-inter mb-2">
                  {t.register.password} <span className="text-oxblood">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder={t.register.passwordPlaceholder}
                />
                <p className="text-sage text-xs mt-1">{t.register.passwordHint}</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-ivory font-inter mb-2">
                  {t.register.confirmPassword} <span className="text-oxblood">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder={t.register.confirmPasswordPlaceholder}
                />
              </div>

              {error && (
                <div className="p-3 bg-oxblood/20 border border-oxblood/50 rounded-sm text-oxblood text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                fullWidth
                className="text-lg"
              >
                {loading ? t.register.submitting : t.register.submit}
              </Button>

              <div className="text-center text-sage text-sm">
                <p>
                  {t.register.hasAccount}{' '}
                  <Link href="/login" className="text-oxblood hover:text-oxblood/80 transition-colors">
                    {t.register.loginLink}
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center text-sage text-xs">
            <p>
              {t.register.agreement}{' '}
              <Link href="/regulamin" className="text-oxblood hover:text-oxblood/80">
                {t.register.termsLink}
              </Link>{' '}
              {language === 'UA' ? 'та' : 'and'}{' '}
              <Link href="/polityka-prywatnosci" className="text-oxblood hover:text-oxblood/80">
                {t.register.privacyLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

