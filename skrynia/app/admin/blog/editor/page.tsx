'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import AdminNav from '@/components/admin/AdminNav';
import {
  Save,
  X,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface BlogFormData {
  // Multilingual titles
  title_uk: string;
  title_en: string;
  title_de: string;
  title_pl: string;
  title_se: string;
  title_no: string;
  title_dk: string;
  title_fr: string;
  
  slug: string;
  
  // Multilingual excerpts
  excerpt_uk: string;
  excerpt_en: string;
  excerpt_de: string;
  excerpt_pl: string;
  excerpt_se: string;
  excerpt_no: string;
  excerpt_dk: string;
  excerpt_fr: string;
  
  // Multilingual content (Markdown)
  content_uk: string;
  content_en: string;
  content_de: string;
  content_pl: string;
  content_se: string;
  content_no: string;
  content_dk: string;
  content_fr: string;
  
  featured_image: string;
  author: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
  tags: string;
  published: boolean;
  linked_product_ids: number[];
}

function BlogEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id');

  const [formData, setFormData] = useState<BlogFormData>({
    title_uk: '',
    title_en: '',
    title_de: '',
    title_pl: '',
    title_se: '',
    title_no: '',
    title_dk: '',
    title_fr: '',
    slug: '',
    excerpt_uk: '',
    excerpt_en: '',
    excerpt_de: '',
    excerpt_pl: '',
    excerpt_se: '',
    excerpt_no: '',
    excerpt_dk: '',
    excerpt_fr: '',
    content_uk: '',
    content_en: '',
    content_de: '',
    content_pl: '',
    content_se: '',
    content_no: '',
    content_dk: '',
    content_fr: '',
    featured_image: '',
    author: 'Skrynia Team',
    meta_title: '',
    meta_description: '',
    og_image: '',
    tags: '',
    published: false,
    linked_product_ids: [],
  });

  const [activeLang, setActiveLang] = useState<'uk' | 'en' | 'de' | 'pl' | 'se' | 'no' | 'dk' | 'fr'>('uk');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(getApiEndpoint(`/api/v1/blog/admin/${blogId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title_uk: data.title_uk || data.title || '',
          title_en: data.title_en || '',
          title_de: data.title_de || '',
          title_pl: data.title_pl || '',
          title_se: data.title_se || '',
          title_no: data.title_no || '',
          title_dk: data.title_dk || '',
          title_fr: data.title_fr || '',
          slug: data.slug || '',
          excerpt_uk: data.excerpt_uk || data.excerpt || '',
          excerpt_en: data.excerpt_en || '',
          excerpt_de: data.excerpt_de || '',
          excerpt_pl: data.excerpt_pl || '',
          excerpt_se: data.excerpt_se || '',
          excerpt_no: data.excerpt_no || '',
          excerpt_dk: data.excerpt_dk || '',
          excerpt_fr: data.excerpt_fr || '',
          content_uk: data.content_uk || data.content || '',
          content_en: data.content_en || '',
          content_de: data.content_de || '',
          content_pl: data.content_pl || '',
          content_se: data.content_se || '',
          content_no: data.content_no || '',
          content_dk: data.content_dk || '',
          content_fr: data.content_fr || '',
          featured_image: data.featured_image || '',
          author: data.author || 'Skrynia Team',
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          og_image: data.og_image || '',
          tags: data.tags || '',
          published: data.published || false,
          linked_product_ids: data.linked_products?.map((p: any) => p.id) || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(getApiEndpoint('/api/v1/products?limit=1000'));
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Помилка: Не знайдено токен авторизації. Будь ласка, увійдіть знову.');
        setLoading(false);
        return;
      }

      const url = blogId
        ? getApiEndpoint(`/api/v1/blog/${blogId}`)
        : getApiEndpoint('/api/v1/blog/');

      const method = blogId ? 'PUT' : 'POST';

      // Prepare data - include both new multilingual fields and legacy fields for backward compatibility
      const apiData = {
        ...formData,
        // Legacy fields for backward compatibility
        title: formData.title_uk,
        excerpt: formData.excerpt_uk,
        content: formData.content_uk,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      if (res.ok) {
        router.push('/admin/blog');
      } else {
        let errorMessage = 'Помилка збереження статті';
        try {
          const errorData = await res.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          errorMessage = `Помилка ${res.status}: ${res.statusText}`;
        }
        alert(`Помилка: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
      alert(`Не вдалося зберегти статтю: ${error instanceof Error ? error.message : 'Невідома помилка'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      alert(`Невірний тип файлу. Дозволені: JPEG, PNG, WebP, AVIF`);
      e.target.value = '';
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(`Файл занадто великий. Максимальний розмір: ${maxSize / 1024 / 1024}MB`);
      e.target.value = '';
      return;
    }

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
        if (data.url) {
          setFormData({ ...formData, featured_image: data.url });
          e.target.value = '';
        }
      } else {
        const error = await res.json().catch(() => ({ detail: 'Помилка завантаження зображення' }));
        alert(`Помилка завантаження: ${error.detail || 'Невідома помилка'}`);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Не вдалося завантажити зображення');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-0 lg:ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-cinzel text-4xl text-ivory mb-2">
                {blogId ? 'Редагувати Статтю' : 'Нова Стаття'}
              </h1>
              <p className="text-sage text-sm">Редактор статей блогу з підтримкою всіх мов</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/admin/blog')}
                className="px-6 py-3 bg-footer-black border border-sage/30 text-ivory hover:border-sage rounded-sm transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Скасувати
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-oxblood text-ivory hover:bg-oxblood/90 rounded-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Language Tabs */}
            <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
              <h2 className="font-cinzel text-2xl text-ivory mb-6">Основна Інформація</h2>
              
              <div className="flex gap-2 mb-6 border-b border-sage/20 overflow-x-auto">
                {(['uk', 'en', 'de', 'pl', 'se', 'no', 'dk', 'fr'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`px-4 py-2 font-inter text-sm transition-colors whitespace-nowrap ${
                      activeLang === lang
                        ? 'text-ivory border-b-2 border-oxblood'
                        : 'text-sage hover:text-ivory'
                    }`}
                  >
                    {lang === 'uk' ? 'UA' : lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-ivory font-inter mb-2">
                  Заголовок ({activeLang.toUpperCase()}) {activeLang === 'uk' && <span className="text-oxblood">*</span>}
                </label>
                <input
                  type="text"
                  value={formData[`title_${activeLang}` as keyof BlogFormData] as string || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const updates: any = { [`title_${activeLang}`]: newValue };
                    if (activeLang === 'uk' && !blogId) {
                      updates.slug = generateSlug(newValue);
                    }
                    setFormData({ ...formData, ...updates });
                  }}
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                  required={activeLang === 'uk'}
                  autoComplete="off"
                />
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-ivory font-inter mb-2">Slug (URL) <span className="text-oxblood">*</span></label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none font-mono text-sm"
                  required
                />
              </div>

              {/* Excerpt */}
              <div className="mb-4">
                <label className="block text-ivory font-inter mb-2">
                  Короткий опис ({activeLang.toUpperCase()})
                </label>
                <textarea
                  value={formData[`excerpt_${activeLang}` as keyof BlogFormData] as string || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, [`excerpt_${activeLang}`]: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                  rows={3}
                  placeholder="Короткий опис для превью..."
                />
              </div>

              {/* Content with Visual Markdown Editor */}
              <div className="mb-4">
                <label className="block text-ivory font-inter mb-2">
                  Контент ({activeLang.toUpperCase()}) - Markdown {activeLang === 'uk' && <span className="text-oxblood">*</span>}
                </label>
                <div data-color-mode="dark" suppressHydrationWarning>
                  <MDEditor
                    value={formData[`content_${activeLang}` as keyof BlogFormData] as string || ''}
                    onChange={(value) => {
                      setFormData({ ...formData, [`content_${activeLang}`]: value || '' });
                    }}
                    preview="live"
                    hideToolbar={false}
                    visibleDragbar={true}
                    height={400}
                    data-color-mode="dark"
                  />
                </div>
              </div>
            </div>

            {/* Featured Image & Author */}
            <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
              <h2 className="font-cinzel text-2xl text-ivory mb-6">Зображення та Автор</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-ivory font-inter mb-2">Featured Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.featured_image}
                      onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                      className="flex-1 px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                      placeholder="/images/blog/..."
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-3 bg-oxblood/20 border border-oxblood/50 text-oxblood hover:bg-oxblood/30 rounded-sm transition-colors cursor-pointer">
                      <Upload className="w-5 h-5" />
                      {uploadingImage ? 'Завантаження...' : 'Завантажити'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {formData.featured_image && (
                    <div className="mt-2">
                      <img
                        src={formData.featured_image}
                        alt="Featured"
                        className="max-w-full h-32 object-cover rounded-sm border border-sage/20"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-ivory font-inter mb-2">Автор</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
              <h2 className="font-cinzel text-2xl text-ivory mb-6">SEO</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-ivory font-inter mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                    placeholder="Залиште порожнім для автоматичного заповнення"
                  />
                </div>
                <div>
                  <label className="block text-ivory font-inter mb-2">Meta Description</label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
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
                    className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                    placeholder="Зображення для соц. мереж (1200x630)"
                  />
                </div>
                <div>
                  <label className="block text-ivory font-inter mb-2">Теги (через кому)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                    placeholder="ювелірні вироби, етно, handmade"
                  />
                </div>
              </div>
            </div>

            {/* Linked Products */}
            <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
              <h2 className="font-cinzel text-2xl text-ivory mb-6">Пов'язані Товари</h2>
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
                    <span className="text-sage text-sm truncate">{product.title_uk || product.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
              <h2 className="font-cinzel text-2xl text-ivory mb-6">Статус</h2>
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BlogEditor() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-deep-black">
        <AdminNav />
        <div className="ml-0 lg:ml-64 pt-20 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-ivory">Завантаження...</div>
          </div>
        </div>
      </div>
    }>
      <BlogEditorContent />
    </Suspense>
  );
}

