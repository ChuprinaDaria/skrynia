'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint, getApiUrl } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('[Login] handleSubmit called', { email, password: '***' });
    
    // Validate inputs
    if (!email || !password) {
      setError('Будь ласка, заповніть всі поля');
      return;
    }
    
    setError('');
    setLoading(true);

    // Debug logging
    console.log('[Login] Form submitted', { email, password: '***' });
    const apiUrl = getApiEndpoint('/api/v1/auth/login');
    console.log('[Login] API URL:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('[Login] Response status:', response.status);

      if (!response.ok) {
        let errorMessage = t.auth.errors.defaultError;
        try {
          const data = await response.json();
          const detail = data.detail || '';
          
          // Map API error messages to translated messages
          if (detail.includes('Incorrect email or password') || detail.includes('Невірний email')) {
            errorMessage = t.auth.errors.incorrectCredentials;
          } else if (detail.includes('Account not activated') || detail.includes('not activated')) {
            errorMessage = t.auth.errors.accountNotActivated;
          } else if (detail.includes('Email not verified') || detail.includes('not verified')) {
            errorMessage = t.auth.errors.emailNotVerified;
          } else {
            errorMessage = detail || errorMessage;
          }
        } catch {
          errorMessage = t.auth.errors.defaultError;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Store user token
      localStorage.setItem('user_token', data.access_token);
      // Redirect to home or previous page
      router.push('/');
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        const apiUrl = getApiUrl();
        setError(`${t.auth.errors.networkError}. ${t.auth.errors.defaultError}`);
      } else {
        setError(err instanceof Error ? err.message : t.auth.errors.defaultError);
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
              {t.auth.loginTitle}
            </h1>
            <p className="font-inter text-sage text-lg">
              {t.auth.loginSubtitle}
            </p>
          </div>

          <div className="bg-footer-black border border-sage/20 rounded-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="email" className="block text-ivory font-inter mb-2">
                  {t.auth.email}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-ivory font-inter mb-2">
                  {t.auth.password}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-3 bg-oxblood/20 border border-oxblood/50 rounded-sm text-oxblood text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !email || !password}
                size="lg"
                fullWidth
                className="text-lg"
                onClick={(e) => {
                  console.log('[Login] Button clicked', { email, hasPassword: !!password });
                  // Don't prevent default here - let form handle it
                  if (!email || !password) {
                    e.preventDefault();
                    setError('Будь ласка, заповніть всі поля');
                    return false;
                  }
                }}
              >
                {loading ? t.auth.loggingIn : t.auth.loginButton}
              </Button>

              <div className="text-center text-sage text-sm">
                <p>
                  {t.auth.noAccount}{' '}
                  <Link href="/register" className="text-oxblood hover:text-oxblood/80 transition-colors">
                    {t.auth.registerLink}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

