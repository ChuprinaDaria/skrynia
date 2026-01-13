'use client';

import { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import Button from '@/components/ui/Button';
import { getApiEndpoint } from '@/lib/api';

interface Category {
  id: number;
  name_uk: string;
  name_en?: string;
  name_de?: string;
  name_pl?: string;
  slug: string;
  description_uk?: string;
  description_en?: string;
  icon?: string;
  culture_type: string;
  is_featured: boolean;
}

interface CategoryFormData {
  name_uk: string;
  name_en: string;
  name_de: string;
  name_pl: string;
  slug: string;
  description_uk: string;
  description_en: string;
  icon: string;
  culture_type: string;
  is_featured: boolean;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name_uk: '',
    name_en: '',
    name_de: '',
    name_pl: '',
    slug: '',
    description_uk: '',
    description_en: '',
    icon: '',
    culture_type: 'slavic',
    is_featured: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(getApiEndpoint('/api/v1/categories'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name_uk: '',
      name_en: '',
      name_de: '',
      name_pl: '',
      slug: '',
      description_uk: '',
      description_en: '',
      icon: '',
      culture_type: 'slavic',
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_uk: category.name_uk || '',
      name_en: category.name_en || '',
      name_de: category.name_de || '',
      name_pl: category.name_pl || '',
      slug: category.slug || '',
      description_uk: category.description_uk || '',
      description_en: category.description_en || '',
      icon: category.icon || '',
      culture_type: category.culture_type || 'slavic',
      is_featured: category.is_featured || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('admin_token');
      const url = editingCategory
        ? getApiEndpoint(`/api/v1/categories/${editingCategory.id}`)
        : getApiEndpoint('/api/v1/categories');

      const method = editingCategory ? 'PATCH' : 'POST';

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
        fetchCategories();
      } else {
        const error = await res.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цю категорію?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(getApiEndpoint(`/api/v1/categories/${categoryId}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok || res.status === 204) {
        fetchCategories();
      } else {
        const error = await res.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
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
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-cinzel text-4xl text-ivory">Управління Категоріями</h1>
            <Button onClick={handleCreate}>+ Додати Категорію</Button>
          </div>

          {/* Categories List */}
          <div className="bg-footer-black border border-sage/20 rounded-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-deep-black/50">
                <tr>
                  <th className="px-6 py-4 text-left text-ivory font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-ivory font-semibold">Назва (UA)</th>
                  <th className="px-6 py-4 text-left text-ivory font-semibold">Slug</th>
                  <th className="px-6 py-4 text-left text-ivory font-semibold">Тип культури</th>
                  <th className="px-6 py-4 text-left text-ivory font-semibold">Рекомендована</th>
                  <th className="px-6 py-4 text-left text-ivory font-semibold">Дії</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t border-sage/10 hover:bg-deep-black/30">
                    <td className="px-6 py-4 text-sage">{category.id}</td>
                    <td className="px-6 py-4 text-ivory">{category.name_uk}</td>
                    <td className="px-6 py-4 text-sage text-sm">{category.slug}</td>
                    <td className="px-6 py-4 text-sage capitalize">{category.culture_type}</td>
                    <td className="px-6 py-4">
                      {category.is_featured ? (
                        <span className="text-sage">✓</span>
                      ) : (
                        <span className="text-sage/50">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-oxblood hover:text-oxblood/80 text-sm"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-oxblood hover:text-oxblood/80 text-sm"
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-footer-black border border-sage/20 rounded-sm p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-cinzel text-ivory mb-6">
                  {editingCategory ? 'Редагувати Категорію' : 'Додати Категорію'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sage mb-2">Назва (UA) *</label>
                    <input
                      type="text"
                      value={formData.name_uk}
                      onChange={(e) => {
                        setFormData({ ...formData, name_uk: e.target.value });
                        if (!editingCategory && !formData.slug) {
                          setFormData({ ...formData, name_uk: e.target.value, slug: generateSlug(e.target.value) });
                        }
                      }}
                      className="w-full bg-deep-black border border-sage/20 rounded-sm px-4 py-2 text-ivory"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sage mb-2">Назва (EN)</label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      className="w-full bg-deep-black border border-sage/20 rounded-sm px-4 py-2 text-ivory"
                    />
                  </div>

                  <div>
                    <label className="block text-sage mb-2">Назва (DE)</label>
                    <input
                      type="text"
                      value={formData.name_de}
                      onChange={(e) => setFormData({ ...formData, name_de: e.target.value })}
                      className="w-full bg-deep-black border border-sage/20 rounded-sm px-4 py-2 text-ivory"
                    />
                  </div>

                  <div>
                    <label className="block text-sage mb-2">Назва (PL)</label>
                    <input
                      type="text"
                      value={formData.name_pl}
                      onChange={(e) => setFormData({ ...formData, name_pl: e.target.value })}
                      className="w-full bg-deep-black border border-sage/20 rounded-sm px-4 py-2 text-ivory"
                    />
                  </div>

                  <div>
                    <label className="block text-sage mb-2">Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-deep-black border border-sage/20 rounded-sm px-4 py-2 text-ivory"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sage mb-2">Опис (UA)</label>
                    <textarea
                      value={formData.description_uk}
                      onChange={(e) => setFormData({ ...formData, description_uk: e.target.value })}
                      className="w-full bg-deep-black border border-sage/20 rounded-sm px-4 py-2 text-ivory"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sage mb-2">Опис (EN)</label>
                    <textarea
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      className="w-full bg-deep-black border border-sage/20 rounded-sm px-4 py-2 text-ivory"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sage mb-2">Іконка</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full bg-deep-black border border-sage/20 rounded-sm px-4 py-2 text-ivory"
                      placeholder="alatyr, valknut, triquetra"
                    />
                  </div>

                  <div>
                    <label className="block text-sage mb-2">Тип культури *</label>
                    <select
                      value={formData.culture_type}
                      onChange={(e) => setFormData({ ...formData, culture_type: e.target.value })}
                      className="w-full bg-deep-black border border-sage/20 rounded-sm px-4 py-2 text-ivory"
                      required
                    >
                      <option value="slavic">Слов'янська</option>
                      <option value="viking">Вікінгська</option>
                      <option value="celtic">Кельтська</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_featured" className="text-sage">
                      Рекомендована категорія
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit">
                      {editingCategory ? 'Зберегти' : 'Створити'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Скасувати
                    </Button>
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

