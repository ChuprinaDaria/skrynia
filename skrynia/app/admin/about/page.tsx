'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

const languages = [
  { code: 'ua', label: 'Українська', flag: '🇺🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'se', label: 'Svenska', flag: '🇸🇪' },
  { code: 'no', label: 'Norsk', flag: '🇳🇴' },
  { code: 'dk', label: 'Dansk', flag: '🇩🇰' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export default function AboutPageAdmin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ua');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchAboutPage();
  }, []);

  const fetchAboutPage = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiEndpoint('/api/v1/about-page/'));

      if (res.ok) {
        const data = await res.json();
        setFormData(data || {});
      }
    } catch (error) {
      console.error('Failed to fetch about page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(getApiEndpoint('/api/v1/about-page/'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        alert('Сторінка "Про нас" успішно оновлена!');
      } else {
        const error = await res.json();
        alert(`Помилка: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to save about page:', error);
      alert('Не вдалося зберегти сторінку "Про нас"');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black">
        <AdminNav />
        <div className="ml-0 lg:ml-64 pt-20 pb-20">
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
      <div className="ml-0 lg:ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-cinzel text-4xl text-ivory">Редагування сторінки "Про нас"</h1>
            <p className="text-sage mt-2 font-inter">
              Редагуйте контент сторінки "Про нас" для всіх мов
            </p>
          </div>

          {/* Language Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 border-b border-sage/20">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveTab(lang.code)}
                  className={`px-4 py-2 font-inter text-sm transition-colors whitespace-nowrap ${
                    activeTab === lang.code
                      ? 'text-ivory border-b-2 border-oxblood'
                      : 'text-sage hover:text-ivory'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-footer-black border border-sage/20 rounded-sm p-6">
              {/* Title */}
              <div className="mb-6">
                <label className="block text-ivory font-inter mb-2 font-semibold">
                  Заголовок
                </label>
                <input
                  type="text"
                  value={formData[`title_${activeTab}`] || ''}
                  onChange={(e) => updateField(`title_${activeTab}`, e.target.value)}
                  placeholder="Про Rune Box"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div className="mb-6">
                <label className="block text-ivory font-inter mb-2 font-semibold">
                  Підзаголовок
                </label>
                <input
                  type="text"
                  value={formData[`subtitle_${activeTab}`] || ''}
                  onChange={(e) => updateField(`subtitle_${activeTab}`, e.target.value)}
                  placeholder="Автентичні прикраси ручної роботи з душею та історією"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                />
              </div>

              {/* History Section */}
              <div className="mb-6 border-t border-sage/20 pt-6">
                <h3 className="text-ivory font-cinzel text-xl mb-4">Розділ "Історія"</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Заголовок розділу
                    </label>
                    <input
                      type="text"
                      value={formData[`history_title_${activeTab}`] || ''}
                      onChange={(e) => updateField(`history_title_${activeTab}`, e.target.value)}
                      placeholder="Наша Історія"
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Контент розділу
                    </label>
                    <textarea
                      value={formData[`history_content_${activeTab}`] || ''}
                      onChange={(e) => updateField(`history_content_${activeTab}`, e.target.value)}
                      placeholder="Кожна прикраса в нашій колекції..."
                      rows={6}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Mission Section */}
              <div className="mb-6 border-t border-sage/20 pt-6">
                <h3 className="text-ivory font-cinzel text-xl mb-4">Розділ "Місія"</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Заголовок розділу
                    </label>
                    <input
                      type="text"
                      value={formData[`mission_title_${activeTab}`] || ''}
                      onChange={(e) => updateField(`mission_title_${activeTab}`, e.target.value)}
                      placeholder="Наша Місія"
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Контент розділу
                    </label>
                    <textarea
                      value={formData[`mission_content_${activeTab}`] || ''}
                      onChange={(e) => updateField(`mission_content_${activeTab}`, e.target.value)}
                      placeholder="Зберегти та передати красу..."
                      rows={6}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quality Section */}
              <div className="mb-6 border-t border-sage/20 pt-6">
                <h3 className="text-ivory font-cinzel text-xl mb-4">Розділ "Якість"</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Заголовок розділу
                    </label>
                    <input
                      type="text"
                      value={formData[`quality_title_${activeTab}`] || ''}
                      onChange={(e) => updateField(`quality_title_${activeTab}`, e.target.value)}
                      placeholder="Якість та Автентичність"
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Вступ
                    </label>
                    <textarea
                      value={formData[`quality_intro_${activeTab}`] || ''}
                      onChange={(e) => updateField(`quality_intro_${activeTab}`, e.target.value)}
                      placeholder="Ми використовуємо тільки натуральні матеріали:"
                      rows={3}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ivory font-inter mb-2">
                        Корал
                      </label>
                      <input
                        type="text"
                        value={formData[`quality_coral_${activeTab}`] || ''}
                        onChange={(e) => updateField(`quality_coral_${activeTab}`, e.target.value)}
                        placeholder="Натуральний корал із Середземномор'я"
                        className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-ivory font-inter mb-2">
                        Срібло
                      </label>
                      <input
                        type="text"
                        value={formData[`quality_silver_${activeTab}`] || ''}
                        onChange={(e) => updateField(`quality_silver_${activeTab}`, e.target.value)}
                        placeholder="Срібло 925 проби"
                        className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-ivory font-inter mb-2">
                        Бурштин
                      </label>
                      <input
                        type="text"
                        value={formData[`quality_amber_${activeTab}`] || ''}
                        onChange={(e) => updateField(`quality_amber_${activeTab}`, e.target.value)}
                        placeholder="Бурштин із Балтики"
                        className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-ivory font-inter mb-2">
                        Каміння
                      </label>
                      <input
                        type="text"
                        value={formData[`quality_gemstone_${activeTab}`] || ''}
                        onChange={(e) => updateField(`quality_gemstone_${activeTab}`, e.target.value)}
                        placeholder="Натуральне каміння"
                        className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Висновок
                    </label>
                    <textarea
                      value={formData[`quality_conclusion_${activeTab}`] || ''}
                      onChange={(e) => updateField(`quality_conclusion_${activeTab}`, e.target.value)}
                      placeholder="Кожен виріб створюється вручну..."
                      rows={4}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-oxblood text-ivory hover:bg-oxblood/90 rounded-sm transition-colors font-inter font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

