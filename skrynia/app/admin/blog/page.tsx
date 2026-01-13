'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdminNav from '@/components/admin/AdminNav';
import Button from '@/components/ui/Button';
import { getApiEndpoint } from '@/lib/api';

// Dynamic import for markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  tags: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  linked_products: any[];
}

interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  featured_image: string | null;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: 'Skrynia Team',
    meta_title: '',
    meta_description: '',
    og_image: '',
    tags: '',
    published: false,
    linked_product_ids: [] as number[],
  });

  useEffect(() => {
    checkAuth();
    fetchBlogs();
    fetchProducts();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getApiEndpoint('/api/v1/blog/admin/all'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/v1/products?limit=1000'));
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('admin_token');
      const url = selectedBlog
        ? getApiEndpoint(`/api/v1/blog/${selectedBlog.id}`)
        : getApiEndpoint('/api/v1/blog/');
      
      const response = await fetch(url, {
        method: selectedBlog ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save blog post');
      }

      await fetchBlogs();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog post');
    }
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      featured_image: blog.featured_image || '',
      author: blog.author || 'Skrynia Team',
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      og_image: blog.og_image || '',
      tags: blog.tags || '',
      published: blog.published,
      linked_product_ids: blog.linked_products.map(p => p.id),
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цю статтю?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getApiEndpoint(`/api/v1/blog/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchBlogs();
      }
    } catch (err) {
      console.error('Failed to delete blog:', err);
    }
  };

  const resetForm = () => {
    setSelectedBlog(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      author: 'Skrynia Team',
      meta_title: '',
      meta_description: '',
      og_image: '',
      tags: '',
      published: false,
      linked_product_ids: [],
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return <div className="p-8 text-ivory">Завантаження...</div>;
  }

  return (
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-0 lg:ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-rutenia text-4xl text-ivory">Керування Блогом</h1>
          {!isEditing && (
            <div className="flex gap-4">
              <Button onClick={() => router.push('/admin/blog/editor')}>
                + Новий Редактор (Всі мови)
              </Button>
              <Button onClick={() => setIsEditing(true)} variant="secondary">
                Створити Статтю (Простий)
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-oxblood/20 border border-oxblood rounded-sm text-oxblood">
            {error}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6 bg-footer-black border border-sage/20 rounded-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-rutenia text-2xl text-ivory">
                {selectedBlog ? 'Редагувати Статтю' : 'Нова Стаття'}
              </h2>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  resetForm();
                }}
              >
                Скасувати
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-ivory font-inter mb-2">
                  Заголовок <span className="text-oxblood">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                />
              </div>

              <div>
                <label className="block text-ivory font-inter mb-2">
                  Slug <span className="text-oxblood">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                />
              </div>
            </div>

            <div>
              <label className="block text-ivory font-inter mb-2">Короткий опис (excerpt)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                placeholder="Короткий опис для превью..."
              />
            </div>

            <div>
              <label className="block text-ivory font-inter mb-2">
                Контент (Markdown) <span className="text-oxblood">*</span>
              </label>
              <div data-color-mode="dark">
                <MDEditor
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val || '' })}
                  height={400}
                  preview="edit"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-ivory font-inter mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                  placeholder="/images/blog/..."
                />
              </div>

              <div>
                <label className="block text-ivory font-inter mb-2">Автор</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                />
              </div>
            </div>

            <div className="border-t border-sage/20 pt-6">
              <h3 className="font-rutenia text-xl text-ivory mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-ivory font-inter mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                    placeholder="Залиште порожнім для автоматичного заповнення"
                  />
                </div>
                <div>
                  <label className="block text-ivory font-inter mb-2">Meta Description</label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                    maxLength={160}
                    placeholder="Опис для пошукових систем (макс. 160 символів)"
                  />
                  <p className="text-sage text-xs mt-1">
                    {formData.meta_description.length}/160 символів
                  </p>
                </div>
                <div>
                  <label className="block text-ivory font-inter mb-2">OG Image URL</label>
                  <input
                    type="url"
                    value={formData.og_image}
                    onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                    placeholder="Зображення для соц. мереж (1200x630)"
                  />
                </div>
                <div>
                  <label className="block text-ivory font-inter mb-2">
                    Теги (через кому)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                    placeholder="ювелірні вироби, етно, handmade"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-sage/20 pt-6">
              <h3 className="font-rutenia text-xl text-ivory mb-4">Пов'язані Товари</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                {products.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center gap-2 p-2 bg-deep-black border border-sage/30 rounded-sm cursor-pointer hover:border-oxblood transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.linked_product_ids.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            linked_product_ids: [...formData.linked_product_ids, product.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            linked_product_ids: formData.linked_product_ids.filter(id => id !== product.id),
                          });
                        }
                      }}
                      className="w-4 h-4 accent-oxblood"
                    />
                    <span className="text-sage text-sm truncate">{product.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-sage/20 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 accent-oxblood"
                />
                <span className="text-ivory font-inter">Опублікувати</span>
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" size="lg">
                {selectedBlog ? 'Оновити' : 'Створити'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => {
                  setIsEditing(false);
                  resetForm();
                }}
              >
                Скасувати
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {blogs.length === 0 ? (
              <div className="text-center py-12 text-sage">
                Статей ще немає. Створіть першу!
              </div>
            ) : (
              blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-footer-black border border-sage/20 rounded-sm p-6 hover:border-sage/40 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-rutenia text-xl text-ivory">{blog.title}</h3>
                        {blog.published ? (
                          <span className="px-2 py-1 bg-sage/20 text-sage text-xs rounded">
                            Опубліковано
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-oxblood/20 text-oxblood text-xs rounded">
                            Чернетка
                          </span>
                        )}
                      </div>
                      <p className="text-sage text-sm mb-2">Slug: /{blog.slug}</p>
                      {blog.excerpt && (
                        <p className="text-sage text-sm mb-3">{blog.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-sage">
                        <span>Автор: {blog.author}</span>
                        <span>•</span>
                        <span>
                          Створено: {new Date(blog.created_at).toLocaleDateString('uk-UA')}
                        </span>
                        {blog.published_at && (
                          <>
                            <span>•</span>
                            <span>
                              Опубліковано: {new Date(blog.published_at).toLocaleDateString('uk-UA')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(blog)}
                        variant="secondary"
                        size="sm"
                      >
                        Редагувати
                      </Button>
                      <Button
                        onClick={() => handleDelete(blog.id)}
                        variant="secondary"
                        size="sm"
                        className="!bg-oxblood/20 !text-oxblood hover:!bg-oxblood/30"
                      >
                        Видалити
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
