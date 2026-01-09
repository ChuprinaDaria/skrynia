'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { getApiEndpoint } from '@/lib/api';

interface Product {
  id: number;
  title_uk: string;
  slug: string;
  price: number;
  currency: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  category_id?: number;
}

interface ProductFormData {
  title_uk: string;
  title_en?: string;
  slug: string;
  description_uk?: string;
  description_en?: string;
  price: number;
  currency: string;
  stock_quantity: number;
  sku?: string;
  materials?: string[];
  is_handmade: boolean;
  is_active: boolean;
  is_featured: boolean;
  category_id?: number;
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    title_uk: '',
    slug: '',
    price: 0,
    currency: 'zł',
    stock_quantity: 0,
    is_handmade: true,
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiEndpoint('/api/v1/products?is_active=true&limit=100'));

      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      title_uk: '',
      slug: '',
      price: 0,
      currency: 'zł',
      stock_quantity: 0,
      is_handmade: true,
      is_active: true,
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title_uk: product.title_uk,
      slug: product.slug,
      price: product.price,
      currency: product.currency,
      stock_quantity: product.stock_quantity,
      is_handmade: true,
      is_active: product.is_active,
      is_featured: product.is_featured,
      category_id: product.category_id,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('admin_token');
      const url = editingProduct
        ? getApiEndpoint(`/api/v1/products/${editingProduct.id}`)
        : getApiEndpoint('/api/v1/products');

      const method = editingProduct ? 'PATCH' : 'POST';

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
        fetchProducts();
      } else {
        const error = await res.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей товар?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(getApiEndpoint(`/api/v1/products/${productId}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok || res.status === 204) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
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
          <h1 className="font-cinzel text-4xl text-ivory">Управління Товарами</h1>
          <a
            href="/admin/products/editor"
            className="px-6 py-3 bg-oxblood text-ivory hover:bg-oxblood/90 rounded-sm transition-colors font-inter font-semibold"
          >
            + Додати Товар
          </a>
        </div>

        {/* Products Table */}
        <div className="bg-footer-black border border-sage/20 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-deep-black border-b border-sage/20">
              <tr>
                <th className="text-left p-4 text-ivory font-cinzel">Назва</th>
                <th className="text-left p-4 text-ivory font-cinzel">Slug</th>
                <th className="text-left p-4 text-ivory font-cinzel">Ціна</th>
                <th className="text-left p-4 text-ivory font-cinzel">Запас</th>
                <th className="text-left p-4 text-ivory font-cinzel">Статус</th>
                <th className="text-right p-4 text-ivory font-cinzel">Дії</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-sage/10 hover:bg-deep-black/50">
                  <td className="p-4 text-ivory font-inter">{product.title_uk}</td>
                  <td className="p-4 text-sage font-mono text-sm">{product.slug}</td>
                  <td className="p-4 text-ivory">
                    {product.price} {product.currency}
                  </td>
                  <td className="p-4 text-ivory">{product.stock_quantity}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-sm text-xs ${
                        product.is_active ? 'bg-sage/20 text-sage' : 'bg-oxblood/20 text-oxblood'
                      }`}
                    >
                      {product.is_active ? 'Активний' : 'Неактивний'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <a
                      href={`/admin/products/editor?id=${product.id}`}
                      className="text-sage hover:text-ivory transition-colors"
                    >
                      Редагувати
                    </a>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-oxblood hover:text-ivory transition-colors ml-4"
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product Form Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Редагувати Товар' : 'Новий Товар'} maxWidth="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-ivory font-inter mb-2">Назва (UA)</label>
              <input
                type="text"
                value={formData.title_uk}
                onChange={(e) => {
                  setFormData({ ...formData, title_uk: e.target.value });
                  if (!editingProduct) {
                    setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                  }
                }}
                className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-ivory font-inter mb-2">Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood font-mono"
                required
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-ivory font-inter mb-2">Ціна (zł)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood"
                  required
                />
              </div>
              <div>
                <label className="block text-ivory font-inter mb-2">Запас</label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-ivory font-inter mb-2">Опис (UA)</label>
              <textarea
                value={formData.description_uk || ''}
                onChange={(e) => setFormData({ ...formData, description_uk: e.target.value })}
                className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:border-oxblood"
                rows={4}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-ivory cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5"
                />
                <span>Активний</span>
              </label>
              <label className="flex items-center gap-2 text-ivory cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-5 h-5"
                />
                <span>Рекомендований</span>
              </label>
              <label className="flex items-center gap-2 text-ivory cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_handmade}
                  onChange={(e) => setFormData({ ...formData, is_handmade: e.target.checked })}
                  className="w-5 h-5"
                />
                <span>Ручна робота</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" fullWidth>
                {editingProduct ? 'Зберегти' : 'Створити'}
              </Button>
              <Button type="button" variant="ghost" fullWidth onClick={() => setIsModalOpen(false)}>
                Скасувати
              </Button>
            </div>
          </form>
        </Modal>
        </div>
      </div>
    </div>
  );
}
