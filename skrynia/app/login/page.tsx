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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(getApiEndpoint('/api/v1/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Помилка авторизації';
        try {
          const data = await response.json();
          errorMessage = data.detail || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
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
        setError(`Не вдалося підключитися до сервера. Перевірте, чи запущений бекенд на ${apiUrl}`);
      } else {
        setError(err instanceof Error ? err.message : 'Помилка авторизації');
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
              Вхід
            </h1>
            <p className="font-inter text-sage text-lg">
              Увійдіть до свого акаунту
            </p>
          </div>

          <div className="bg-footer-black border border-sage/20 rounded-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-ivory font-inter mb-2">
                  Email
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
                  Пароль
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
                disabled={loading}
                size="lg"
                fullWidth
                className="text-lg"
              >
                {loading ? 'Вхід...' : 'Увійти'}
              </Button>

              <div className="text-center text-sage text-sm">
                <p>
                  Немає акаунту?{' '}
                  <Link href="/register" className="text-oxblood hover:text-oxblood/80 transition-colors">
                    Зареєструватися
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

