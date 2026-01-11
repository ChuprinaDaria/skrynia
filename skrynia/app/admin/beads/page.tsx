'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, Search, Upload } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface Bead {
  id: number;
  name: string;
  image_url: string;
  category: 'stone' | 'hardware' | 'extra';
  subcategory?: string;
  size_mm: number;
  color?: string;
  price_netto: number;
  price_brutto: number;
  supplier_link?: string;
  is_active: boolean;
  created_at?: string;
}

interface BeadFormData {
  name: string;
  image_url: string;
  category: 'stone' | 'hardware' | 'extra';
  subcategory: string;
  size_mm: number;
  color: string;
  price_netto: number;
  price_brutto: number;
  supplier_link: string;
  is_active: boolean;
}

export default function BeadsPage() {
  const router = useRouter();

  const [beads, setBeads] = useState<Bead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBead, setEditingBead] = useState<Bead | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [formData, setFormData] = useState<BeadFormData>({
    name: '',
    image_url: '',
    category: 'stone',
    subcategory: '',
    size_mm: 10,
    color: '',
    price_netto: 0,
    price_brutto: 0,
    supplier_link: '',
    is_active: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchBeads();
  }, []);

  const fetchBeads = async (category?: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      let url = '/api/v1/beads';
      if (category && category !== 'all') {
        url += `?category=${category}`;
      }

      const res = await fetch(getApiEndpoint(url), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setBeads(data);
      } else if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch beads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    fetchBeads(category);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const token = localStorage.getItem('admin_token');
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch(getApiEndpoint('/api/v1/upload/image'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, image_url: data.url });
      } else {
        alert('Помилка завантаження зображення');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Не вдалося завантажити зображення');
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreateModal = () => {
    setEditingBead(null);
    setFormData({
      name: '',
      image_url: '',
      category: 'stone',
      subcategory: '',
      size_mm: 10,
      color: '',
      price_netto: 0,
      price_brutto: 0,
      supplier_link: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (bead: Bead) => {
    setEditingBead(bead);
    setFormData({
      name: bead.name,
      image_url: bead.image_url,
      category: bead.category,
      subcategory: bead.subcategory || '',
      size_mm: bead.size_mm,
      color: bead.color || '',
      price_netto: bead.price_netto,
      price_brutto: bead.price_brutto,
      supplier_link: bead.supplier_link || '',
      is_active: bead.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image_url) {
      alert('Будь ласка, завантажте зображення або введіть URL');
      return;
    }

    const token = localStorage.getItem('admin_token');
    const url = editingBead
      ? `/api/v1/beads/${editingBead.id}`
      : '/api/v1/beads';

    const method = editingBead ? 'PUT' : 'POST';

    try {
      const res = await fetch(getApiEndpoint(url), {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBeads(categoryFilter === 'all' ? undefined : categoryFilter);
      } else {
        const error = await res.json();
        alert(`Помилка: ${error.detail || 'Не вдалося зберегти бусину'}`);
      }
    } catch (error) {
      console.error('Failed to save bead:', error);
      alert('Помилка при збереженні бусини');
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(getApiEndpoint(`/api/v1/beads/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok || res.status === 204) {
        setDeleteConfirmId(null);
        fetchBeads(categoryFilter === 'all' ? undefined : categoryFilter);
      } else {
        alert('Не вдалося видалити бусину');
      }
    } catch (error) {
      console.error('Failed to delete bead:', error);
      alert('Помилка при видаленні бусини');
    }
  };

  const filteredBeads = beads.filter(bead =>
    bead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bead.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bead.color?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'stone': return 'Камінь';
      case 'hardware': return 'Фурнітура';
      case 'extra': return 'Додатково';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-cinzel text-4xl text-ivory mb-2">Управління Бусинами</h1>
              <p className="text-sage/70">Додавайте та редагуйте бусини для конструктора</p>
            </div>
            <Button onClick={openCreateModal}>
              <Plus className="w-5 h-5 mr-2" />
              Додати Бусину
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleCategoryFilterChange('all')}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-oxblood text-ivory'
                    : 'bg-deep-black border border-sage/30 text-ivory hover:border-sage'
                }`}
              >
                Всі
              </button>
              <button
                onClick={() => handleCategoryFilterChange('stone')}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  categoryFilter === 'stone'
                    ? 'bg-oxblood text-ivory'
                    : 'bg-deep-black border border-sage/30 text-ivory hover:border-sage'
                }`}
              >
                Камінь
              </button>
              <button
                onClick={() => handleCategoryFilterChange('hardware')}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  categoryFilter === 'hardware'
                    ? 'bg-oxblood text-ivory'
                    : 'bg-deep-black border border-sage/30 text-ivory hover:border-sage'
                }`}
              >
                Фурнітура
              </button>
              <button
                onClick={() => handleCategoryFilterChange('extra')}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  categoryFilter === 'extra'
                    ? 'bg-oxblood text-ivory'
                    : 'bg-deep-black border border-sage/30 text-ivory hover:border-sage'
                }`}
              >
                Додатково
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage/50" />
              <input
                type="text"
                placeholder="Пошук за назвою, підкатегорією, кольором..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
              />
            </div>
          </div>

          {/* Beads Table */}
          {loading ? (
            <div className="text-center py-12 text-sage/70">Завантаження...</div>
          ) : filteredBeads.length === 0 ? (
            <div className="text-center py-12 text-sage/70">
              Бусини не знайдено. Додайте першу бусину!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-sage/30">
                  <tr>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Зображення</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Назва</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Категорія</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Підкатегорія</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Розмір (мм)</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Колір</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Ціна (нетто)</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Ціна (брутто)</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Статус</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeads.map((bead) => (
                    <tr key={bead.id} className="border-b border-sage/10 hover:bg-deep-black/50">
                      <td className="py-3 px-4">
                        <img
                          src={bead.image_url}
                          alt={bead.name}
                          className="w-12 h-12 object-contain rounded-sm bg-sage/10"
                        />
                      </td>
                      <td className="py-3 px-4 text-ivory">{bead.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 text-xs rounded-sm bg-sage/20 text-sage">
                          {getCategoryLabel(bead.category)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sage/70">{bead.subcategory || '-'}</td>
                      <td className="py-3 px-4 text-ivory">{bead.size_mm} мм</td>
                      <td className="py-3 px-4 text-sage/70">{bead.color || '-'}</td>
                      <td className="py-3 px-4 text-ivory">{bead.price_netto.toFixed(2)} PLN</td>
                      <td className="py-3 px-4 text-ivory">{bead.price_brutto.toFixed(2)} PLN</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-sm ${
                          bead.is_active
                            ? 'bg-sage/20 text-sage'
                            : 'bg-oxblood/20 text-oxblood'
                        }`}>
                          {bead.is_active ? 'Активна' : 'Неактивна'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(bead)}
                            className="p-2 text-sage hover:text-ivory transition-colors"
                            title="Редагувати"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(bead.id)}
                            className="p-2 text-oxblood hover:text-ivory transition-colors"
                            title="Видалити"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingBead ? 'Редагувати Бусину' : 'Додати Бусину'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ivory mb-1">
                Назва <span className="text-oxblood">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                placeholder="Наприклад: Яшма зелена"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-1">
                Зображення (PNG) <span className="text-oxblood">*</span>
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm hover:border-oxblood transition-colors flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Завантаження...' : 'Завантажити файл'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                <div className="text-xs text-sage/70 mb-2">або введіть URL:</div>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  placeholder="/static/beads/jasper-green.png"
                />
              </div>
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="mt-2 w-16 h-16 object-contain rounded-sm bg-sage/10"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.alt = 'Invalid image URL';
                  }}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Категорія <span className="text-oxblood">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                >
                  <option value="stone">Камінь</option>
                  <option value="hardware">Фурнітура</option>
                  <option value="extra">Додатково</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Підкатегорія
                </label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  placeholder="Наприклад: напівдорогоцінний"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Розмір (мм) <span className="text-oxblood">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={formData.size_mm}
                  onChange={(e) => setFormData({ ...formData, size_mm: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Колір
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  placeholder="Наприклад: зелений"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Ціна Нетто (PLN) <span className="text-oxblood">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price_netto}
                  onChange={(e) => setFormData({ ...formData, price_netto: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory mb-1">
                  Ціна Брутто (PLN) <span className="text-oxblood">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price_brutto}
                  onChange={(e) => setFormData({ ...formData, price_brutto: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-1">
                Посилання на товар (де закуповувати)
              </label>
              <input
                type="url"
                value={formData.supplier_link}
                onChange={(e) => setFormData({ ...formData, supplier_link: e.target.value })}
                className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                placeholder="https://example.com/product"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="is_active" className="text-sm text-ivory">
                Активна (доступна для конструктора)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Скасувати
              </Button>
              <Button type="submit">
                {editingBead ? 'Зберегти Зміни' : 'Додати Бусину'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Підтвердження видалення"
        >
          <p className="text-ivory mb-6">
            Ви впевнені, що хочете видалити цю бусину? Цю дію неможливо скасувати.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmId(null)}
            >
              Скасувати
            </Button>
            <Button
              variant="primary"
              onClick={() => handleDelete(deleteConfirmId)}
              className="bg-oxblood hover:bg-oxblood/90"
            >
              Видалити
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
