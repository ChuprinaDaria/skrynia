'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useRouter } from 'next/navigation';
import { 
  Settings as SettingsIcon, 
  Database, 
  CreditCard, 
  Mail, 
  Package, 
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

interface SystemInfo {
  app_name: string;
  app_version: string;
  debug: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // Try to fetch dashboard stats to check system status
      const res = await fetch(getApiEndpoint('/api/v1/admin/dashboard?days=7'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // System is working
        setSystemInfo({
          app_name: 'Rune Box API',
          app_version: '1.0.0',
          debug: process.env.NODE_ENV === 'development',
        });
      } else if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch system info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black">
        <AdminNav />
        <div className="ml-64 pt-20 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-ivory text-xl font-cinzel">Завантаження...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-cinzel text-4xl text-ivory mb-2">Налаштування Системи</h1>
            <p className="text-sage/70">Інформація про конфігурацію та статус системи</p>
          </div>

          {/* Info Notice */}
          <div className="mb-8 bg-footer-black border border-sage/20 rounded-sm p-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-sage flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-ivory font-cinzel text-xl mb-2">Налаштування зберігаються на сервері</h3>
                <p className="text-sage/80 font-inter mb-4">
                  Налаштування системи (API ключі, паролі, інтеграції) зберігаються у файлі змінних середовища (.env) на бекенд-сервері.
                  Для зміни налаштувань необхідно відредагувати файл .env та перезапустити бекенд.
                </p>
                <div className="bg-deep-black/50 border border-sage/10 rounded-sm p-4 mt-4">
                  <p className="text-sage text-sm font-mono">
                    Файл: <span className="text-ivory">backend/.env</span>
                  </p>
                  <p className="text-sage text-xs mt-2">
                    Після зміни налаштувань виконайте: <span className="text-ivory font-mono">docker-compose restart backend</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mb-8">
            <h2 className="font-cinzel text-2xl text-ivory mb-4">Статус Системи</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Database */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-sage" />
                  <h3 className="font-cinzel text-xl text-ivory">База Даних</h3>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sage">Підключена</span>
                </div>
              </div>

              {/* API */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-sage" />
                  <h3 className="font-cinzel text-xl text-ivory">API Backend</h3>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sage">Працює</span>
                </div>
              </div>

              {/* Frontend */}
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <SettingsIcon className="w-6 h-6 text-sage" />
                  <h3 className="font-cinzel text-xl text-ivory">Frontend</h3>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sage">Активний</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Providers */}
            <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-sage" />
                <h3 className="font-cinzel text-xl text-ivory">Платіжні Системи</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sage">Stripe</span>
                  <span className="text-sage/70 text-sm">Налаштовується в .env</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage">Przelewy24</span>
                  <span className="text-sage/70 text-sm">Налаштовується в .env</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage">BLIK</span>
                  <span className="text-sage/70 text-sm">Через P24</span>
                </div>
              </div>
            </div>

            {/* Shipping Providers */}
            <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-sage" />
                <h3 className="font-cinzel text-xl text-ivory">Служби Доставки</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sage">InPost</span>
                  <span className="text-sage/70 text-sm">Налаштовується в .env</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage">Nova Poshta</span>
                  <span className="text-sage/70 text-sm">Налаштовується в .env</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage">DHL</span>
                  <span className="text-sage/70 text-sm">Налаштовується в .env</span>
                </div>
              </div>
            </div>

            {/* Email Configuration */}
            <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-sage" />
                <h3 className="font-cinzel text-xl text-ivory">Email Налаштування</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sage">SMTP Сервер</span>
                  <span className="text-sage/70 text-sm">Налаштовується в .env</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage">Відправка Email</span>
                  <span className="text-sage/70 text-sm">MAIL_* змінні</span>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <SettingsIcon className="w-6 h-6 text-sage" />
                <h3 className="font-cinzel text-xl text-ivory">Інформація про Систему</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sage">Версія API</span>
                  <span className="text-ivory">{systemInfo?.app_version || '1.0.0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage">Режим</span>
                  <span className="text-ivory">
                    {systemInfo?.debug ? 'Розробка' : 'Продакшн'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="mt-8 bg-footer-black border border-sage/20 rounded-sm p-6 max-w-4xl">
            <h3 className="font-cinzel text-xl text-ivory mb-4">Документація</h3>
            <p className="text-sage/80 font-inter mb-4">
              Для детальної інформації про налаштування перегляньте:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sage/80 font-inter">
              <li>README.md в корені проекту</li>
              <li>backend/README.md для API документації</li>
              <li>Файл .env.example для прикладу конфігурації</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

