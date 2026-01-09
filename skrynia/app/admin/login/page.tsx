'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
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
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      localStorage.setItem('admin_token', data.access_token);
      router.push('/admin');
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Не вдалося підключитися до сервера. Перевірте, чи запущений бекенд на http://localhost:8000');
      } else {
        setError(err instanceof Error ? err.message : 'Помилка авторизації');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-rutenia text-3xl text-ivory mb-2">Адмін-панель</h1>
          <p className="text-sage text-sm">Rune box</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-8 shadow-lg"
        >
          <div className="mb-6">
            <label htmlFor="email" className="block text-ivory font-inter text-sm mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 rounded-sm text-ivory placeholder-sage/50 focus:outline-none focus:ring-2 focus:ring-oxblood focus:border-transparent transition-all"
              placeholder="admin@skrynia.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-ivory font-inter text-sm mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 rounded-sm text-ivory placeholder-sage/50 focus:outline-none focus:ring-2 focus:ring-oxblood focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="mb-6 p-3 bg-oxblood/20 border border-oxblood/50 rounded-sm text-oxblood text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-inter font-semibold transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-oxblood focus:ring-offset-2 focus:ring-offset-deep-black disabled:opacity-50 disabled:cursor-not-allowed bg-oxblood text-ivory hover:bg-oxblood/90 hover:shadow-oxblood-glow active:scale-[0.98] px-6 py-3 text-base"
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <div className="mt-6 text-center text-sage text-xs">
          <p>Тестові дані: admin@skrynia.com / admin123</p>
        </div>
      </div>
    </div>
  );
}

