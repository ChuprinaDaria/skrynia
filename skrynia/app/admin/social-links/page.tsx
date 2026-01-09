'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, Instagram, Facebook, Twitter, Youtube, Linkedin, Share2 } from 'lucide-react';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon_name: string | null;
  is_active: boolean;
  display_order: number;
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  pinterest: Share2,
  telegram: Share2,
  tiktok: Share2,
};

export default function SocialLinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon_name: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/social-links/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      } else if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLink(null);
    setFormData({
      platform: '',
      url: '',
      icon_name: '',
      is_active: true,
      display_order: links.length,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon_name: link.icon_name || '',
      is_active: link.is_active,
      display_order: link.display_order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const url = editingLink
        ? `${apiUrl}/api/v1/social-links/${editingLink.id}`
        : `${apiUrl}/api/v1/social-links/`;

      const method = editingLink ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchLinks();
      } else {
        const error = await res.json();
        alert(`Помилка: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to save social link:', error);
      alert('Не вдалося зберегти посилання');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити це посилання?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/social-links/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok || res.status === 204) {
        fetchLinks();
      }
    } catch (error) {
      console.error('Failed to delete social link:', error);
    }
  };

  const toggleActive = async (link: SocialLink) => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/social-links/${link.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !link.is_active }),
      });

      if (res.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error('Failed to update social link:', error);
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
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-cinzel text-4xl text-ivory">Соціальні Мережі</h1>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-oxblood text-ivory hover:bg-oxblood/90 rounded-sm transition-colors font-inter font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Додати Посилання
            </button>
          </div>

          {/* Links List */}
          <div className="bg-footer-black border border-sage/20 rounded-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-deep-black border-b border-sage/20">
                <tr>
                  <th className="text-left p-4 text-ivory font-cinzel">Платформа</th>
                  <th className="text-left p-4 text-ivory font-cinzel">URL</th>
                  <th className="text-left p-4 text-ivory font-cinzel">Порядок</th>
                  <th className="text-left p-4 text-ivory font-cinzel">Статус</th>
                  <th className="text-right p-4 text-ivory font-cinzel">Дії</th>
                </tr>
              </thead>
              <tbody>
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sage">
                      Немає соціальних мереж. Додайте перше посилання.
                    </td>
                  </tr>
                ) : (
                  links.map((link) => {
                    const IconComponent = PLATFORM_ICONS[link.platform.toLowerCase()] || Edit2;
                    return (
                      <tr key={link.id} className="border-b border-sage/10 hover:bg-deep-black/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 text-sage" />
                            <span className="text-ivory font-inter capitalize">{link.platform}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sage hover:text-oxblood transition-colors font-mono text-sm"
                          >
                            {link.url}
                          </a>
                        </td>
                        <td className="p-4 text-ivory">{link.display_order}</td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleActive(link)}
                            className={`px-3 py-1 rounded-sm text-xs font-inter transition-colors ${
                              link.is_active
                                ? 'bg-sage/20 text-sage hover:bg-sage/30'
                                : 'bg-oxblood/20 text-oxblood hover:bg-oxblood/30'
                            }`}
                          >
                            {link.is_active ? 'Активна' : 'Неактивна'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(link)}
                            className="text-sage hover:text-ivory transition-colors"
                            title="Редагувати"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(link.id)}
                            className="text-oxblood hover:text-ivory transition-colors ml-4"
                            title="Видалити"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Form Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-deep-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-footer-black border border-sage/20 rounded-sm p-6 max-w-md w-full">
                <h2 className="font-cinzel text-2xl text-ivory mb-6">
                  {editingLink ? 'Редагувати Посилання' : 'Нове Посилання'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Платформа <span className="text-oxblood">*</span>
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                      required
                      disabled={!!editingLink}
                    >
                      <option value="">Виберіть платформу</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                      <option value="youtube">YouTube</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="pinterest">Pinterest</option>
                      <option value="tiktok">TikTok</option>
                      <option value="telegram">Telegram</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      URL <span className="text-oxblood">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://instagram.com/your_profile"
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-ivory font-inter mb-2">Порядок відображення</label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                    />
                    <p className="text-sage text-xs mt-1">Менше значення = вище в списку</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 accent-oxblood"
                    />
                    <label htmlFor="is_active" className="text-ivory font-inter cursor-pointer">
                      Активна
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-oxblood text-ivory hover:bg-oxblood/90 rounded-sm transition-colors font-inter font-semibold"
                    >
                      {editingLink ? 'Зберегти' : 'Створити'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-3 bg-footer-black border border-sage/30 text-ivory hover:border-sage rounded-sm transition-colors font-inter font-semibold"
                    >
                      Скасувати
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

