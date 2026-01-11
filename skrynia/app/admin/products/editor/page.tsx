'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as LucideIcons from 'lucide-react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import AdminNav from '@/components/admin/AdminNav';
import {
  Save,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronDown,
  Search,
  Sparkles,
  Video,
} from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

// Payment methods
const PAYMENT_METHODS = [
  { id: 'stripe', label: 'Stripe', icon: 'CreditCard' },
  { id: 'przelewy24', label: 'Przelewy24', icon: 'Wallet' },
  { id: 'blik', label: 'BLIK', icon: 'Smartphone' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: 'Building2' },
];

// Shipping providers
const SHIPPING_PROVIDERS = [
  { id: 'inpost', label: 'InPost', icon: 'Package' },
  { id: 'poczta_polska', label: 'Poczta Polska', icon: 'Mail' },
  { id: 'dhl', label: 'DHL', icon: 'Truck' },
  { id: 'nova_poshta', label: 'Nova Poshta', icon: 'MapPin' },
];

// Symbols
const SYMBOLS = [
  { id: 'love', label: 'Love', icon: 'Heart' },
  { id: 'protection', label: 'Protection', icon: 'Shield' },
  { id: 'wealth', label: 'Wealth', icon: 'Coins' },
  { id: 'wisdom', label: 'Wisdom', icon: 'BookOpen' },
];

// Comprehensive Lucide icons for picker (categorized like emoji picker)
const ICON_CATEGORIES = {
  'Любов та Емоції': ['Heart', 'HeartHandshake', 'Smile', 'Sparkles', 'Star', 'Gem'],
  'Захист та Сила': ['Shield', 'ShieldCheck', 'Sword', 'Axe', 'Crosshair', 'Target'],
  'Багатство та Успіх': ['Coins', 'DollarSign', 'TrendingUp', 'Award', 'Trophy', 'Crown'],
  'Мудрість та Знанія': ['BookOpen', 'GraduationCap', 'Lightbulb', 'Brain', 'Eye', 'Search'],
  'Природа': ['Flower', 'Leaf', 'Tree', 'Sun', 'Moon', 'Cloud', 'Droplet', 'Flame', 'Mountain'],
  'Енергія та Рух': ['Zap', 'Bolt', 'Wind', 'Waves', 'Activity', 'Gauge'],
  'Предмети': ['Gift', 'Bell', 'Key', 'Lock', 'Unlock', 'Box', 'Package', 'ShoppingBag'],
  'Символи': ['Circle', 'Square', 'Triangle', 'Hexagon', 'Infinity', 'Cross', 'Plus', 'Minus'],
};

interface ProductFormData {
  // Basic Info
  title_uk: string;
  title_en: string;
  title_de: string;
  title_pl: string;
  title_se?: string;
  title_no?: string;
  title_dk?: string;
  title_fr?: string;
  slug: string;

  // Descriptions (Markdown)
  description_uk: string;
  description_en: string;
  description_de: string;
  description_pl: string;
  description_se?: string;
  description_no?: string;
  description_dk?: string;
  description_fr?: string;

  // Legend
  legend_title_uk: string;
  legend_title_en: string;
  legend_title_se?: string;
  legend_title_no?: string;
  legend_title_dk?: string;
  legend_title_fr?: string;
  legend_content_uk: string;
  legend_content_en: string;
  legend_content_se?: string;
  legend_content_no?: string;
  legend_content_dk?: string;
  legend_content_fr?: string;

  // Pricing
  price: number;
  currency: string;
  compare_at_price: number | null;

  // Inventory
  stock_quantity: number;
  sku: string;

  // Details
  materials: string[];
  specifications: Record<string, string>;
  is_handmade: boolean;

  // Category & Tags
  category_id: number | null;
  tags: string[];
  symbols: string[];

  // Status
  is_active: boolean;
  is_featured: boolean;
  
  // Made to Order
  is_made_to_order: boolean;
  made_to_order_duration: string | null;

  // SEO
  meta_description: string;
  meta_keywords: string[];

  // Payment & Shipping
  payment_methods: string[];
  shipping_providers: string[];

  // Images
  images: Array<{
    image_url: string;
    alt_text: string;
    position: number;
    is_primary: boolean;
  }>;

  // Videos
  videos: Array<{
    video_url: string;
    thumbnail_url?: string;
    alt_text: string;
    position: number;
  }>;
}

function ProductEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [formData, setFormData] = useState<ProductFormData>({
    title_uk: '',
    title_en: '',
    title_de: '',
    title_pl: '',
    title_se: '',
    title_no: '',
    title_dk: '',
    title_fr: '',
    slug: '',
    description_uk: '',
    description_en: '',
    description_de: '',
    description_pl: '',
    description_se: '',
    description_no: '',
    description_dk: '',
    description_fr: '',
    legend_title_uk: '',
    legend_title_en: '',
    legend_title_se: '',
    legend_title_no: '',
    legend_title_dk: '',
    legend_title_fr: '',
    legend_content_uk: '',
    legend_content_en: '',
    legend_content_se: '',
    legend_content_no: '',
    legend_content_dk: '',
    legend_content_fr: '',
    price: 0,
    currency: 'zł',
    compare_at_price: null,
    stock_quantity: 0,
    sku: '',
    materials: [],
    specifications: {},
    is_handmade: true,
    category_id: null,
    tags: [],
    symbols: [],
    is_active: true,
    is_featured: false,
    is_made_to_order: false,
    made_to_order_duration: null,
    meta_description: '',
    meta_keywords: [],
    payment_methods: [],
    shipping_providers: [],
    images: [],
    videos: [],
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [activeLang, setActiveLang] = useState<'uk' | 'en' | 'de' | 'pl' | 'se' | 'no' | 'dk' | 'fr'>('uk');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [iconCategory, setIconCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(getApiEndpoint(`/api/v1/products/by-id/${productId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          ...formData,
          ...data,
          materials: data.materials || [],
          tags: data.tags || [],
          symbols: data.symbols || [],
          meta_keywords: data.meta_keywords || [],
          payment_methods: data.payment_methods || [],
          shipping_providers: data.shipping_providers || [],
          specifications: data.specifications || {},
          images: data.images || [],
          videos: data.videos || [],
          is_made_to_order: data.is_made_to_order || false,
          made_to_order_duration: data.made_to_order_duration || null,
        });
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(getApiEndpoint('/api/v1/categories'));
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
      const url = productId
        ? getApiEndpoint(`/api/v1/products/${productId}`)
        : getApiEndpoint('/api/v1/products');

      const method = productId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const error = await res.json();
        alert(`Помилка: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Не вдалося зберегти товар');
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, ''],
    });
  };

  const updateMaterial = (index: number, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData({ ...formData, materials: newMaterials });
  };

  const removeMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index),
    });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: { ...formData.specifications, '': '' },
    });
  };

  const updateSpecification = (key: string, value: string, oldKey?: string) => {
    const newSpecs = { ...formData.specifications };
    if (oldKey && oldKey !== key) {
      delete newSpecs[oldKey];
    }
    newSpecs[key] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const togglePaymentMethod = (method: string) => {
    setFormData({
      ...formData,
      payment_methods: formData.payment_methods.includes(method)
        ? formData.payment_methods.filter((m) => m !== method)
        : [...formData.payment_methods, method],
    });
  };

  const toggleShippingProvider = (provider: string) => {
    setFormData({
      ...formData,
      shipping_providers: formData.shipping_providers.includes(provider)
        ? formData.shipping_providers.filter((p) => p !== provider)
        : [...formData.shipping_providers, provider],
    });
  };

  const toggleSymbol = (symbol: string) => {
    setFormData({
      ...formData,
      symbols: formData.symbols.includes(symbol)
        ? formData.symbols.filter((s) => s !== symbol)
        : [...formData.symbols, symbol],
    });
  };

  const insertIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return;

    // Insert icon as markdown emoji or unicode symbol
    // For now, we'll use a simple text representation that can be replaced later
    const iconMarkdown = `:${iconName.toLowerCase()}:`;
    const descField = `description_${activeLang}` as keyof ProductFormData;
    const currentValue = formData[descField] as string || '';
    
    // Insert at the end of the current text
    const newValue = currentValue + (currentValue ? ' ' : '') + iconMarkdown + ' ';
    
    setFormData({
      ...formData,
      [descField]: newValue,
    });
    setShowIconPicker(false);
  };

  // Get all icons from categories
  const getAllIcons = () => {
    return Object.values(ICON_CATEGORIES).flat();
  };

  // Filter icons based on search and category
  const getFilteredIcons = () => {
    let icons = iconCategory === 'all' ? getAllIcons() : ICON_CATEGORIES[iconCategory as keyof typeof ICON_CATEGORIES] || [];
    
    if (iconSearch) {
      icons = icons.filter((icon) =>
        icon.toLowerCase().includes(iconSearch.toLowerCase())
      );
    }
    
    return icons;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      alert(`Невірний тип файлу. Дозволені: JPEG, PNG, WebP, AVIF`);
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert(`Файл занадто великий. Максимальний розмір: ${maxSize / 1024 / 1024}MB`);
      e.target.value = ''; // Reset input
      return;
    }

    setUploadingImage(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Помилка: Не знайдено токен авторизації. Будь ласка, увійдіть знову.');
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch(getApiEndpoint('/api/v1/upload/image'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header - browser will set it with boundary for FormData
        },
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setFormData((prev) => {
            const newImage = {
              image_url: data.url,
              alt_text: '',
              position: prev.images.length,
              is_primary: prev.images.length === 0,
            };
            return {
              ...prev,
              images: [...prev.images, newImage],
            };
          });
          // Reset input to allow uploading the same file again
          e.target.value = '';
        } else {
          throw new Error('Сервер не повернув URL зображення');
        }
      } else {
        // Try to get error message from response
        let errorMessage = 'Помилка завантаження зображення';
        try {
          const errorData = await res.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          errorMessage = `Помилка ${res.status}: ${res.statusText}`;
        }
        alert(`Помилка завантаження: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      alert(`Не вдалося завантажити зображення: ${errorMessage}`);
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const setPrimaryImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.map((img, i) => ({
        ...img,
        is_primary: i === index,
      })),
    });
  };

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...formData.images];
    newImages[index].alt_text = alt;
    setFormData({ ...formData, images: newImages });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a video file
    if (!file.type.startsWith('video/')) {
      alert('Будь ласка, виберіть відео файл');
      return;
    }

    // Check file size (max 500MB for high quality videos)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      alert(`Файл занадто великий. Максимальний розмір: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setUploadingVideo(true);
    try {
      const token = localStorage.getItem('admin_token');
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch(getApiEndpoint('/api/v1/upload/video'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => {
          const newVideo = {
            video_url: data.url,
            thumbnail_url: data.thumbnail_url || '',
            alt_text: file.name,
            position: prev.videos.length,
          };
          return {
            ...prev,
            videos: [...prev.videos, newVideo],
          };
        });
      } else {
        const error = await res.json().catch(() => ({ detail: 'Помилка завантаження відео' }));
        alert(`Помилка завантаження відео: ${error.detail || 'Невідома помилка'}`);
      }
    } catch (error) {
      console.error('Failed to upload video:', error);
      alert('Не вдалося завантажити відео. Спробуйте додати через URL.');
    } finally {
      setUploadingVideo(false);
      // Reset input
      e.target.value = '';
    }
  };

  const addVideoByUrl = () => {
    const videoUrl = prompt('Введіть URL відео (YouTube, Vimeo, або прямий посилання):');
    if (videoUrl && videoUrl.trim()) {
      setFormData((prev) => {
        const newVideo = {
          video_url: videoUrl.trim(),
          thumbnail_url: '',
          alt_text: '',
          position: prev.videos.length,
        };
        return {
          ...prev,
          videos: [...prev.videos, newVideo],
        };
      });
    }
  };

  const removeVideo = (index: number) => {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, i) => i !== index),
    });
  };

  const updateVideoAlt = (index: number, alt: string) => {
    const newVideos = [...formData.videos];
    newVideos[index].alt_text = alt;
    setFormData({ ...formData, videos: newVideos });
  };

  const updateVideoUrl = (index: number, url: string) => {
    const newVideos = [...formData.videos];
    newVideos[index].video_url = url;
    setFormData({ ...formData, videos: newVideos });
  };

  return (
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-cinzel text-4xl text-ivory mb-2">
              {productId ? 'Редагувати Товар' : 'Новий Товар'}
            </h1>
            <p className="text-sage text-sm">Повний редактор товару з Markdown та іконками</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin/products')}
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
          {/* Basic Info Section */}
          <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Основна Інформація</h2>

            {/* Language Tabs */}
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
                Назва ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={formData[`title_${activeLang}` as keyof ProductFormData] as string || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const updates: any = { [`title_${activeLang}`]: newValue };
                  if (activeLang === 'uk' && !productId) {
                    updates.slug = generateSlug(newValue);
                  }
                  setFormData({ ...formData, ...updates });
                }}
                onInput={(e) => {
                  // Ensure input is not blocked
                  e.currentTarget.value = e.currentTarget.value;
                }}
                className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                required={activeLang === 'uk'}
                autoComplete="off"
              />
            </div>

            {/* Slug */}
            <div className="mb-4">
              <label className="block text-ivory font-inter mb-2">Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none font-mono text-sm"
                required
              />
            </div>

            {/* Description with Visual Markdown Editor */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-ivory font-inter">
                  Опис ({activeLang.toUpperCase()}) - Візуальний Редактор Markdown
                </label>
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="px-3 py-1.5 bg-deep-black/50 border border-sage/30 text-ivory hover:border-oxblood rounded-sm text-sm flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Іконки
                </button>
              </div>

              {/* Icon Picker - Enhanced like emoji picker */}
              {showIconPicker && (
                <div className="mb-4 bg-deep-black border border-sage/30 rounded-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-sage" />
                    <input
                      type="text"
                      placeholder="Пошук іконок..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="flex-1 px-3 py-2 bg-footer-black border border-sage/20 text-ivory rounded-sm focus:border-oxblood focus:outline-none text-sm"
                    />
                  </div>
                  
                  {/* Category tabs */}
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                    <button
                      type="button"
                      onClick={() => setIconCategory('all')}
                      className={`px-3 py-1.5 rounded-sm text-xs font-inter whitespace-nowrap transition-colors ${
                        iconCategory === 'all'
                          ? 'bg-oxblood/20 border border-oxblood/50 text-oxblood'
                          : 'bg-footer-black border border-sage/20 text-sage hover:border-sage'
                      }`}
                    >
                      Всі
                    </button>
                    {Object.keys(ICON_CATEGORIES).map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setIconCategory(category)}
                        className={`px-3 py-1.5 rounded-sm text-xs font-inter whitespace-nowrap transition-colors ${
                          iconCategory === category
                            ? 'bg-oxblood/20 border border-oxblood/50 text-oxblood'
                            : 'bg-footer-black border border-sage/20 text-sage hover:border-sage'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  
                  {/* Icons grid */}
                  <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                    {getFilteredIcons().map((iconName) => {
                      const IconComponent = (LucideIcons as any)[iconName];
                      if (!IconComponent) return null;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => insertIcon(iconName)}
                          className="p-2 bg-footer-black border border-sage/20 hover:border-oxblood hover:bg-oxblood/10 rounded-sm transition-all flex items-center justify-center group"
                          title={iconName}
                        >
                          <IconComponent className="w-5 h-5 text-sage group-hover:text-oxblood transition-colors" />
                        </button>
                      );
                    })}
                    {getFilteredIcons().length === 0 && (
                      <div className="col-span-8 text-center text-sage py-4">
                        Іконки не знайдено
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visual Markdown Editor */}
              <div data-color-mode="dark" suppressHydrationWarning>
                <MDEditor
                  value={formData[`description_${activeLang}` as keyof ProductFormData] as string || ''}
                  onChange={(value) => {
                    setFormData({ ...formData, [`description_${activeLang}`]: value || '' });
                  }}
                  preview="live"
                  hideToolbar={false}
                  visibleDragbar={true}
                  height={400}
                  data-color-mode="dark"
                />
              </div>
            </div>

            {/* Legend Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-ivory font-inter mb-2">
                  Заголовок Легенди ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={formData[`legend_title_${activeLang}` as keyof ProductFormData] as string}
                  onChange={(e) =>
                    setFormData({ ...formData, [`legend_title_${activeLang}`]: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-ivory font-inter mb-2">
                  Контент Легенди ({activeLang.toUpperCase()}) - Markdown
                </label>
                <textarea
                  value={formData[`legend_content_${activeLang}` as keyof ProductFormData] as string}
                  onChange={(e) =>
                    setFormData({ ...formData, [`legend_content_${activeLang}`]: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none font-mono text-sm"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Section */}
          <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Ціна та Склад</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-ivory font-inter mb-2">Ціна</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    setFormData({ 
                      ...formData, 
                      price: value && !isNaN(parseFloat(value)) ? parseFloat(value) : 0 
                    });
                  }}
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-ivory font-inter mb-2">Валюта</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                >
                  <option value="zł">zł (PLN)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="$">$ (USD)</option>
                  <option value="₴">₴ (UAH)</option>
                </select>
              </div>
              <div>
                <label className="block text-ivory font-inter mb-2">Стара Ціна</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compare_at_price ?? ''}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    setFormData({
                      ...formData,
                      compare_at_price: value && !isNaN(parseFloat(value)) ? parseFloat(value) : null,
                    });
                  }}
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-ivory font-inter mb-2">Запас</label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    setFormData({ 
                      ...formData, 
                      stock_quantity: value && !isNaN(parseInt(value)) ? parseInt(value) : 0 
                    });
                  }}
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-ivory font-inter mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none font-mono"
                />
              </div>
            </div>
            
            {/* Made to Order Section */}
            <div className="border-t border-sage/20 pt-6">
              <h3 className="font-cinzel text-xl text-ivory mb-4">Під Замовлення</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_made_to_order}
                    onChange={(e) => setFormData({ ...formData, is_made_to_order: e.target.checked })}
                    className="w-5 h-5 accent-oxblood"
                  />
                  <span className="font-inter">Товар доступний під замовлення</span>
                </label>
                
                {formData.is_made_to_order && (
                  <div>
                    <label className="block text-ivory font-inter mb-2">
                      Строк виготовлення (наприклад: "2-3 тижні", "1 місяць")
                    </label>
                    <input
                      type="text"
                      value={formData.made_to_order_duration || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, made_to_order_duration: e.target.value || null })
                      }
                      placeholder="2-3 тижні"
                      className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                    />
                    <p className="text-sage text-sm mt-2">
                      Цей текст буде відображатися клієнтам на сторінці товару
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Materials & Specifications */}
          <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Матеріали та Характеристики</h2>

            {/* Materials */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-ivory font-inter">Матеріали</label>
                <button
                  type="button"
                  onClick={addMaterial}
                  className="px-3 py-1.5 bg-oxblood/20 border border-oxblood/50 text-oxblood hover:bg-oxblood/30 rounded-sm text-sm flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Додати
                </button>
              </div>
              <div className="space-y-2">
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => updateMaterial(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                      placeholder="Назва матеріалу"
                    />
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="px-3 py-2 bg-oxblood/20 border border-oxblood/50 text-oxblood hover:bg-oxblood/30 rounded-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-ivory font-inter">Характеристики</label>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-3 py-1.5 bg-oxblood/20 border border-oxblood/50 text-oxblood hover:bg-oxblood/30 rounded-sm text-sm flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Додати
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value], index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => updateSpecification(e.target.value, value, key)}
                      className="px-4 py-2 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                      placeholder="Назва"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateSpecification(key, e.target.value)}
                        className="flex-1 px-4 py-2 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                        placeholder="Значення"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="px-3 py-2 bg-oxblood/20 border border-oxblood/50 text-oxblood hover:bg-oxblood/30 rounded-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment & Shipping */}
          <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Оплата та Доставка</h2>

            {/* Payment Methods */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-ivory font-inter">Методи Оплати</label>
                {formData.payment_methods.length > 0 && (
                  <span className="text-sage text-sm font-inter">
                    Вибрано: {formData.payment_methods.length}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const IconComponent = (LucideIcons as any)[method.icon];
                  const isSelected = formData.payment_methods.includes(method.id);
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => togglePaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-sm transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-oxblood bg-oxblood/20 text-ivory shadow-oxblood-glow'
                          : 'border-sage/30 bg-deep-black/50 text-sage hover:border-sage hover:bg-deep-black/70'
                      }`}
                    >
                      {IconComponent && (
                        <IconComponent className={`w-6 h-6 mb-2 ${isSelected ? 'text-oxblood' : 'text-sage'}`} />
                      )}
                      <div className="text-sm font-inter font-medium">{method.label}</div>
                      {isSelected && (
                        <div className="mt-1 text-xs text-oxblood">✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
              {formData.payment_methods.length === 0 && (
                <p className="text-sage text-sm mt-2 italic">Оберіть хоча б один метод оплати</p>
              )}
            </div>

            {/* Shipping Providers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-ivory font-inter">Способи Доставки</label>
                {formData.shipping_providers.length > 0 && (
                  <span className="text-sage text-sm font-inter">
                    Вибрано: {formData.shipping_providers.length}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SHIPPING_PROVIDERS.map((provider) => {
                  const IconComponent = (LucideIcons as any)[provider.icon];
                  const isSelected = formData.shipping_providers.includes(provider.id);
                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => toggleShippingProvider(provider.id)}
                      className={`p-4 border-2 rounded-sm transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-oxblood bg-oxblood/20 text-ivory shadow-oxblood-glow'
                          : 'border-sage/30 bg-deep-black/50 text-sage hover:border-sage hover:bg-deep-black/70'
                      }`}
                    >
                      {IconComponent && (
                        <IconComponent className={`w-6 h-6 mb-2 ${isSelected ? 'text-oxblood' : 'text-sage'}`} />
                      )}
                      <div className="text-sm font-inter font-medium">{provider.label}</div>
                      {isSelected && (
                        <div className="mt-1 text-xs text-oxblood">✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
              {formData.shipping_providers.length === 0 && (
                <p className="text-sage text-sm mt-2 italic">Оберіть хоча б один спосіб доставки</p>
              )}
            </div>
          </div>

          {/* Category, Tags & Symbols */}
          <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Категорія, Теги та Символи</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-ivory font-inter mb-2">Категорія</label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value ? parseInt(e.target.value) : null })
                  }
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                >
                  <option value="">Без категорії</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_uk}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-ivory font-inter mb-2">Теги</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-oxblood/20 border border-oxblood/50 text-oxblood rounded-sm text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-oxblood/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  placeholder="Введіть тег і натисніть Enter"
                  className="w-full px-4 py-2 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none text-sm"
                />
              </div>

              {/* Symbols */}
              <div>
                <label className="block text-ivory font-inter mb-2">Символи</label>
                <div className="grid grid-cols-2 gap-2">
                  {SYMBOLS.map((symbol) => {
                    const IconComponent = (LucideIcons as any)[symbol.icon];
                    const isSelected = formData.symbols.includes(symbol.id);
                    return (
                      <button
                        key={symbol.id}
                        type="button"
                        onClick={() => toggleSymbol(symbol.id)}
                        className={`p-3 border rounded-sm transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'border-oxblood bg-oxblood/20 text-ivory'
                            : 'border-sage/30 bg-deep-black/50 text-sage hover:border-sage'
                        }`}
                      >
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <span className="text-sm font-inter">{symbol.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Images & Videos Section */}
          <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Зображення та Відео Товару</h2>

            {/* Upload Buttons */}
            <div className="mb-6 flex gap-4 flex-wrap">
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-oxblood/20 border border-oxblood/50 text-oxblood hover:bg-oxblood/30 rounded-sm transition-colors cursor-pointer">
                <ImageIcon className="w-5 h-5" />
                {uploadingImage ? 'Завантаження...' : 'Завантажити Зображення'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-oxblood/20 border border-oxblood/50 text-oxblood hover:bg-oxblood/30 rounded-sm transition-colors cursor-pointer">
                <Video className="w-5 h-5" />
                {uploadingVideo ? 'Завантаження...' : 'Завантажити Відео'}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  disabled={uploadingVideo}
                />
              </label>
              <button
                type="button"
                onClick={addVideoByUrl}
                className="inline-flex items-center gap-2 px-6 py-3 bg-footer-black border border-sage/30 text-ivory hover:border-sage rounded-sm transition-colors"
              >
                <Video className="w-5 h-5" />
                Додати Відео по URL
              </button>
            </div>

            {/* Images Grid */}
            {formData.images.length > 0 && (
              <div className="mb-6">
                <h3 className="font-cinzel text-xl text-ivory mb-4">Зображення</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative group border-2 rounded-sm overflow-hidden ${
                        image.is_primary
                          ? 'border-oxblood shadow-oxblood-glow'
                          : 'border-sage/30'
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `Зображення ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      {image.is_primary && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-oxblood/80 text-ivory text-xs font-inter rounded-sm">
                          Головне
                        </div>
                      )}
                      <div className="absolute inset-0 bg-deep-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="px-3 py-1.5 bg-oxblood/80 text-ivory rounded-sm text-xs hover:bg-oxblood transition-colors"
                          title="Встановити як головне"
                        >
                          Головне
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="px-3 py-1.5 bg-oxblood/80 text-ivory rounded-sm text-xs hover:bg-oxblood transition-colors"
                          title="Видалити"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={image.alt_text}
                        onChange={(e) => updateImageAlt(index, e.target.value)}
                        placeholder="Alt текст..."
                        className="w-full mt-2 px-2 py-1 bg-deep-black/50 border border-sage/20 text-ivory text-xs rounded-sm focus:border-oxblood focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Grid */}
            {formData.videos.length > 0 && (
              <div>
                <h3 className="font-cinzel text-xl text-ivory mb-4">Відео</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.videos.map((video, index) => (
                    <div
                      key={index}
                      className="relative group border-2 border-sage/30 rounded-sm overflow-hidden"
                    >
                      <div className="relative w-full aspect-video bg-deep-black/50">
                        <video
                          src={video.video_url}
                          controls
                          className="w-full h-full object-contain"
                        >
                          Ваш браузер не підтримує відео.
                        </video>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="px-3 py-1.5 bg-oxblood/80 text-ivory rounded-sm text-xs hover:bg-oxblood transition-colors"
                            title="Видалити"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-2 space-y-2">
                        <input
                          type="text"
                          value={video.video_url}
                          onChange={(e) => updateVideoUrl(index, e.target.value)}
                          placeholder="URL відео..."
                          className="w-full px-2 py-1 bg-deep-black/50 border border-sage/20 text-ivory text-xs rounded-sm focus:border-oxblood focus:outline-none font-mono"
                        />
                        <input
                          type="text"
                          value={video.alt_text}
                          onChange={(e) => updateVideoAlt(index, e.target.value)}
                          placeholder="Опис відео..."
                          className="w-full px-2 py-1 bg-deep-black/50 border border-sage/20 text-ivory text-xs rounded-sm focus:border-oxblood focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status & SEO */}
          <div className="bg-footer-black/50 backdrop-blur-sm border border-sage/20 rounded-lg p-6">
            <h2 className="font-cinzel text-2xl text-ivory mb-6">Статус та SEO</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 accent-oxblood"
                  />
                  <span>Активний</span>
                </label>
                <label className="flex items-center gap-2 text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 accent-oxblood"
                  />
                  <span>Рекомендований</span>
                </label>
                <label className="flex items-center gap-2 text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_handmade}
                    onChange={(e) => setFormData({ ...formData, is_handmade: e.target.checked })}
                    className="w-5 h-5 accent-oxblood"
                  />
                  <span>Ручна робота</span>
                </label>
              </div>

              <div>
                <label className="block text-ivory font-inter mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                  rows={3}
                  placeholder="Опис для пошукових систем..."
                />
              </div>
            </div>

            {/* Meta Keywords */}
            <div className="mt-6">
              <label className="block text-ivory font-inter mb-2">Meta Keywords</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.meta_keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-oxblood/20 border border-oxblood/50 text-oxblood rounded-sm text-sm flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          meta_keywords: formData.meta_keywords.filter((k) => k !== keyword),
                        })
                      }
                      className="hover:text-oxblood/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const keyword = e.currentTarget.value.trim();
                    if (keyword && !formData.meta_keywords.includes(keyword)) {
                      setFormData({
                        ...formData,
                        meta_keywords: [...formData.meta_keywords, keyword],
                      });
                      e.currentTarget.value = '';
                    }
                  }
                }}
                placeholder="Введіть ключове слово і натисніть Enter"
                className="w-full px-4 py-2 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none text-sm"
              />
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

export default function ProductEditor() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-deep-black">
        <AdminNav />
        <div className="ml-64 pt-20 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-ivory">Завантаження...</div>
          </div>
        </div>
      </div>
    }>
      <ProductEditorContent />
    </Suspense>
  );
}

