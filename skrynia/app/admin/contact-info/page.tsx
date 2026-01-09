'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useRouter } from 'next/navigation';
import { Save, Mail, Phone, MapPin } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

interface ContactInfo {
  id: number;
  email: string;
  phone: string | null;
  address: string | null;
}

export default function ContactInfoPage() {
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiEndpoint('/api/v1/contact-info/'));

      if (res.ok) {
        const data = await res.json();
        setContactInfo(data);
        setFormData({
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
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

      const res = await fetch(getApiEndpoint('/api/v1/contact-info/'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setContactInfo(data);
        alert('Контактна інформація успішно оновлена!');
      } else {
        const error = await res.json();
        alert(`Помилка: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to save contact info:', error);
      alert('Не вдалося зберегти контактну інформацію');
    } finally {
      setSaving(false);
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
            <h1 className="font-cinzel text-4xl text-ivory">Контактна Інформація</h1>
            <p className="text-sage mt-2 font-inter">
              Керуйте контактною інформацією, яка відображається в футері сайту
            </p>
          </div>

          {/* Form */}
          <div className="bg-footer-black border border-sage/20 rounded-sm p-6 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-ivory font-inter mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sage" />
                  Email <span className="text-oxblood">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@runebox.eu"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                  required
                />
                <p className="text-sage text-xs mt-1">Цей email відображається в футері та на сторінці контактів</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-ivory font-inter mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-sage" />
                  Телефон
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+48 123 456 789"
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                />
                <p className="text-sage text-xs mt-1">Опціонально - телефон для відображення в контактах</p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-ivory font-inter mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sage" />
                  Адреса
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Варшава, Польща"
                  rows={3}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none resize-none"
                />
                <p className="text-sage text-xs mt-1">Опціонально - адреса для відображення в футері</p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-oxblood text-ivory hover:bg-oxblood/90 rounded-sm transition-colors font-inter font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Збереження...' : 'Зберегти'}
                </button>
              </div>
            </form>

            {/* Current Info Preview */}
            {contactInfo && (
              <div className="mt-8 pt-8 border-t border-sage/20">
                <h3 className="font-cinzel text-xl text-ivory mb-4">Поточні дані</h3>
                <div className="space-y-3 text-sage font-inter">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {contactInfo.email}
                  </p>
                  {contactInfo.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {contactInfo.phone}
                    </p>
                  )}
                  {contactInfo.address && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {contactInfo.address}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

