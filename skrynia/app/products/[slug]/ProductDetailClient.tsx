'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Button from '@/components/ui/Button';
import ProductCard, { Product } from '@/components/product/ProductCard';
import ProductValueProps from '@/components/product/ProductValueProps';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint, normalizeImageUrl } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

interface ApiProduct {
  id: number;
  title_uk: string;
  title_en?: string;
  title_de?: string;
  title_pl?: string;
  title_se?: string;
  title_no?: string;
  title_dk?: string;
  title_fr?: string;
  slug: string;
  description_uk?: string;
  description_en?: string;
  description_de?: string;
  description_pl?: string;
  description_se?: string;
  description_no?: string;
  description_dk?: string;
  description_fr?: string;
  price: number;
  currency: string;
  stock_quantity?: number;
  primary_image?: string;
  materials?: string[];
  specifications?: Array<{ label: string; value: string }>;
  legend_title_uk?: string;
  legend_content_uk?: string;
  is_handmade?: boolean;
  is_made_to_order?: boolean;
  made_to_order_duration?: string;
  category_id?: number;
  images?: Array<{ image_url: string; is_primary?: boolean }>;
}

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    custom_text: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingNow, setViewingNow] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchProduct();
  }, [slug, language]);

  const getProductTitle = (product: ApiProduct): string => {
    switch (language) {
      case 'EN':
        return product.title_en || product.title_uk;
      case 'DE':
        return product.title_de || product.title_en || product.title_uk;
      case 'PL':
        return product.title_pl || product.title_en || product.title_uk;
      case 'SE':
        return product.title_se || product.title_en || product.title_uk;
      case 'NO':
        return product.title_no || product.title_en || product.title_uk;
      case 'DK':
        return product.title_dk || product.title_en || product.title_uk;
      case 'FR':
        return product.title_fr || product.title_en || product.title_uk;
      default:
        return product.title_uk;
    }
  };

  const getProductDescription = (product: ApiProduct): string => {
    switch (language) {
      case 'EN':
        return product.description_en || product.description_uk || '';
      case 'DE':
        return product.description_de || product.description_en || product.description_uk || '';
      case 'PL':
        return product.description_pl || product.description_en || product.description_uk || '';
      case 'SE':
        return product.description_se || product.description_en || product.description_uk || '';
      case 'NO':
        return product.description_no || product.description_en || product.description_uk || '';
      case 'DK':
        return product.description_dk || product.description_en || product.description_uk || '';
      case 'FR':
        return product.description_fr || product.description_en || product.description_uk || '';
      default:
        return product.description_uk || '';
    }
  };

  useEffect(() => {
    // Only run on client to avoid hydration mismatch
    if (typeof window === 'undefined') return;
    
    // Generate random viewing count
    const count = Math.floor(Math.random() * 21) + 5;
    setViewingNow(count);

    const interval = setInterval(() => {
      setViewingNow(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(3, Math.min(30, prev + change));
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(getApiEndpoint(`/api/v1/products/${slug}`));

      if (res.ok) {
        const productData: ApiProduct = await res.json();
        setProduct(productData);
        
        // Fetch related products from same category
        if (productData.category_id) {
          const relatedRes = await fetch(
            getApiEndpoint(`/api/v1/products?category_id=${productData.category_id}&is_active=true&limit=4`)
          );
          if (relatedRes.ok) {
            const related: ApiProduct[] = await relatedRes.json();
            const transformed = related
              .filter((p) => p.id !== productData.id)
              .slice(0, 3)
              .map((p) => ({
                id: p.id.toString(),
                title: getProductTitle(p),
                titleEn: p.title_en,
                price: p.price,
                currency: p.currency,
                image: normalizeImageUrl(p.primary_image) || '/images/products/placeholder.jpg',
                category: 'slavic' as const,
                materials: p.materials || [],
                isHandmade: p.is_handmade ?? true,
                slug: p.slug,
              }));
            setRelatedProducts(transformed);
          }
        }
      } else if (res.status === 404) {
        setError('Товар не знайдено');
      } else {
        setError('Не вдалося завантажити товар');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Помилка підключення до сервера');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
    addItem({
      productId: product.id,
      title: product.title_uk,
      price: product.price,
      currency: product.currency,
      quantity: quantity,
      image: normalizeImageUrl(primaryImage?.image_url) || '/images/products/placeholder.jpg',
      slug: product.slug,
    });
  };

  const handleMadeToOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(getApiEndpoint('/api/v1/made-to-order/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          ...orderFormData,
        }),
      });

      if (response.ok) {
        alert(t.product.madeToOrder?.success || 'Ваше замовлення прийнято! Ми зв\'яжемося з вами найближчим часом.');
        setShowOrderForm(false);
        setOrderFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          custom_text: '',
          description: '',
        });
      } else {
        const errorData = await response.json();
        alert(`${t.common.error}: ${errorData.detail || (t.product.madeToOrder?.submit || 'Не вдалося відправити замовлення')}`);
      }
    } catch (error) {
      console.error('Failed to submit order:', error);
      alert(t.common.error + ': ' + (t.product.madeToOrder?.submit || 'Не вдалося відправити замовлення'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-ivory text-xl font-cinzel mb-4">Завантаження...</div>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oxblood"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-ivory text-xl font-cinzel mb-4">{error || 'Товар не знайдено'}</div>
          <Link
            href="/collections"
            className="inline-block font-inter font-semibold transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-oxblood focus:ring-offset-2 focus:ring-offset-deep-black bg-oxblood text-ivory hover:bg-oxblood/90 hover:shadow-oxblood-glow active:scale-[0.98] px-6 py-3 text-base"
          >
            Повернутися до колекцій
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images?.map(img => normalizeImageUrl(img.image_url)) || ['/images/products/placeholder.jpg'];
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const displayTitle = getProductTitle(product);
  const displayDescription = getProductDescription(product);
  const categorySlug = product.category_id ? 'slavic' : 'all'; // TODO: Map from category_id

  // Generate JSON-LD for product
  const generateProductJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle,
    description: displayDescription.substring(0, 200),
    image: productImages.map((img) => {
      // If already absolute URL, use as is; otherwise prepend siteUrl
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      return `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`;
    }),
    sku: product.slug,
    mpn: product.id.toString(),
    brand: {
      '@type': 'Brand',
      name: 'Rune Box',
    },
    category: 'Jewelry',
    material: product.materials?.join(', ') || '',
    isHandmade: product.is_handmade ?? true,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: product.currency === 'zł' ? 'PLN' : product.currency,
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.stock_quantity ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Rune Box',
      },
    },
  });

  const generateBreadcrumbJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Головна',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Колекції',
        item: `${siteUrl}/collections`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: displayTitle,
        item: `${siteUrl}/products/${product.slug}`,
      },
    ],
  });

  const isMadeToOrder = product.is_made_to_order || false;

  return (
    <>
      {/* JSON-LD структуровані дані */}
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateProductJsonLd()) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbJsonLd()) }}
      />
      
      <div className="min-h-screen bg-deep-black pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm font-inter text-sage">
            <Link href="/" className="hover:text-ivory transition-colors">
              {t.product.breadcrumb.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/collections" className="hover:text-ivory transition-colors">
              {t.product.breadcrumb.collections}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ivory" aria-current="page">{displayTitle}</span>
          </nav>

          {/* Product Detail */}
          <article itemScope itemType="https://schema.org/Product">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              {/* Left Column - Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <figure className="relative aspect-square bg-deep-black rounded-sm overflow-hidden border border-sage/20">
                  <Image
                    src={productImages[selectedImage]}
                    alt={`${displayTitle} - головне зображення`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    itemProp="image"
                  />
                </figure>

                {/* Thumbnail Strip */}
                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4" role="tablist" aria-label="Галерея зображень товару">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        role="tab"
                        aria-selected={selectedImage === index}
                        aria-label={`Зображення ${index + 1} з ${productImages.length}`}
                        className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === index
                            ? 'border-oxblood shadow-oxblood-glow'
                            : 'border-sage/20 hover:border-sage'
                        }`}
                      >
                        <Image 
                          src={image} 
                          alt={`${displayTitle} - зображення ${index + 1}`} 
                          fill 
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 12vw"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Title */}
                <h1 className="font-rutenia text-3xl md:text-4xl lg:text-5xl text-ivory" itemProp="name">
                  {displayTitle}
                </h1>

                {/* Social Proof - Viewing Now */}
                {isClient && viewingNow > 0 && (
                  <div className="flex items-center gap-2 text-sage/80 animate-fade-in">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-oxblood animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-inter text-sm">
                        <span className="text-ivory font-semibold">{viewingNow}</span> {t.product.viewingNow || 'людей дивляться зараз'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="text-3xl font-semibold text-sage font-inter" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <span itemProp="price" content={product.price.toString()}>{product.price}</span>
                  {' '}
                  <span itemProp="priceCurrency" content={product.currency === 'zł' ? 'PLN' : product.currency}>{product.currency}</span>
                  <link itemProp="availability" href={product.stock_quantity ? "https://schema.org/InStock" : "https://schema.org/PreOrder"} />
                </div>

                {/* Divider */}
                <div className="h-px bg-sage/20" aria-hidden="true" />

                {/* Description */}
                {displayDescription && (
                  <div className="text-ivory font-inter leading-relaxed prose prose-invert prose-sage max-w-none" itemProp="description">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <h1 className="font-rutenia text-2xl text-ivory mt-6 mb-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="font-rutenia text-xl text-ivory mt-5 mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="font-rutenia text-lg text-ivory mt-4 mb-2">{children}</h3>,
                        h4: ({ children }) => <h4 className="font-rutenia text-base text-ivory mt-3 mb-1">{children}</h4>,
                        p: ({ children }) => <p className="text-ivory/90 mb-3">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside text-ivory/90 mb-3 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside text-ivory/90 mb-3 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-ivory/90">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-ivory">{children}</strong>,
                        em: ({ children }) => <em className="italic text-sage">{children}</em>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-oxblood pl-4 italic text-sage my-3">{children}</blockquote>,
                        hr: () => <hr className="border-sage/20 my-4" />,
                      }}
                    >
                      {displayDescription}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Materials */}
                {product.materials && product.materials.length > 0 && (
                  <div>
                    <h2 className="font-rutenia text-lg text-ivory mb-3">{t.product.materials}</h2>
                    <div className="flex flex-wrap gap-3">
                      {product.materials.map((material, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-footer-black border border-sage/20 rounded-sm"
                          itemProp="material"
                        >
                          <svg className="w-4 h-4 text-sage" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sage text-sm font-inter">{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-sage/20" aria-hidden="true" />

                {/* Quantity & Add to Cart / Made to Order */}
                <div className="space-y-4">
                  {isMadeToOrder ? (
                    <>
                      {/* Made to Order Info */}
                      {product.made_to_order_duration && (
                        <div className="bg-oxblood/20 border border-oxblood/50 rounded-sm p-4 mb-4">
                          <p className="text-ivory font-inter font-semibold mb-1">{t.product.madeToOrder?.duration || 'Строк виготовлення'}:</p>
                          <p className="text-sage">{product.made_to_order_duration}</p>
                        </div>
                      )}
                      
                      {/* Order Button */}
                      {!showOrderForm ? (
                        <Button 
                          onClick={() => setShowOrderForm(true)} 
                          size="lg" 
                          fullWidth 
                          className="text-lg"
                        >
                          {t.product.madeToOrder?.orderButton || 'Замовити під замовлення'}
                        </Button>
                      ) : (
                        /* Order Form */
                        <form onSubmit={handleMadeToOrderSubmit} className="space-y-4 bg-footer-black/50 border border-sage/20 rounded-sm p-6">
                          <h3 className="font-cinzel text-xl text-ivory mb-4">{t.product.madeToOrder?.formTitle || 'Форма замовлення'}</h3>
                          
                          <div>
                            <label htmlFor="customer_name" className="block text-ivory font-inter mb-2">
                              {t.product.madeToOrder?.name || 'Ім\'я'} <span className="text-oxblood">*</span>
                            </label>
                            <input
                              id="customer_name"
                              type="text"
                              required
                              value={orderFormData.customer_name}
                              onChange={(e) => setOrderFormData({ ...orderFormData, customer_name: e.target.value })}
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="customer_email" className="block text-ivory font-inter mb-2">
                              {t.product.madeToOrder?.email || 'Email'} <span className="text-oxblood">*</span>
                            </label>
                            <input
                              id="customer_email"
                              type="email"
                              required
                              value={orderFormData.customer_email}
                              onChange={(e) => setOrderFormData({ ...orderFormData, customer_email: e.target.value })}
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="customer_phone" className="block text-ivory font-inter mb-2">
                              {t.product.madeToOrder?.phone || 'Телефон'}
                            </label>
                            <input
                              id="customer_phone"
                              type="tel"
                              value={orderFormData.customer_phone}
                              onChange={(e) => setOrderFormData({ ...orderFormData, customer_phone: e.target.value })}
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="custom_text" className="block text-ivory font-inter mb-2">
                              {t.product.madeToOrder?.customText || 'Текст для нанесення (якщо потрібно)'}
                            </label>
                            <textarea
                              id="custom_text"
                              value={orderFormData.custom_text}
                              onChange={(e) => setOrderFormData({ ...orderFormData, custom_text: e.target.value })}
                              rows={3}
                              maxLength={500}
                              placeholder={t.product.madeToOrder?.customTextPlaceholder || 'Введіть текст, який хочете додати на прикрасу...'}
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                            <p className="text-sage text-xs mt-1">{orderFormData.custom_text.length}/500</p>
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-ivory font-inter mb-2">
                              {t.product.madeToOrder?.description || 'Опис / Коментар'}
                            </label>
                            <textarea
                              id="description"
                              value={orderFormData.description}
                              onChange={(e) => setOrderFormData({ ...orderFormData, description: e.target.value })}
                              rows={4}
                              maxLength={2000}
                              placeholder={t.product.madeToOrder?.descriptionPlaceholder || 'Опишіть свої побажання щодо виготовлення...'}
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                            <p className="text-sage text-xs mt-1">{orderFormData.description.length}/2000</p>
                          </div>
                          
                          <div className="flex gap-4">
                            <Button 
                              type="submit" 
                              size="lg" 
                              fullWidth 
                              className="text-lg"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (t.product.madeToOrder?.submitting || 'Відправка...') : (t.product.madeToOrder?.submit || 'Відправити замовлення')}
                            </Button>
                            <Button 
                              type="button" 
                              onClick={() => {
                                setShowOrderForm(false);
                                setOrderFormData({
                                  customer_name: '',
                                  customer_email: '',
                                  customer_phone: '',
                                  custom_text: '',
                                  description: '',
                                });
                              }}
                              variant="ghost"
                              size="lg"
                              className="text-lg"
                            >
                              {t.product.madeToOrder?.cancel || 'Скасувати'}
                            </Button>
                          </div>
                        </form>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-4">
                        <label htmlFor="quantity" className="text-ivory font-inter">{t.product.quantity}</label>
                        <div className="flex items-center border border-sage/30 rounded-sm">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-4 py-2 text-ivory hover:bg-sage/10 transition-colors"
                            aria-label="Зменшити кількість"
                          >
                            -
                          </button>
                          <span id="quantity" className="px-6 py-2 text-ivory font-semibold border-x border-sage/30" aria-live="polite">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-4 py-2 text-ivory hover:bg-sage/10 transition-colors"
                            aria-label="Збільшити кількість"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button onClick={handleAddToCart} size="lg" fullWidth className="text-lg">
                        {t.product.addToCart}
                      </Button>
                    </>
                  )}

                  <ProductValueProps
                    giftWrapText={t.product.valueProps.giftWrap}
                    warrantyText={t.product.valueProps.warranty}
                    trackingText={t.product.valueProps.tracking}
                    handmadeTooltipLabel={t.product.valueProps.handmadeTooltipLabel}
                    handmadeTooltipText={t.product.valueProps.handmadeTooltip}
                  />
                </div>
              </div>
            </div>
          </article>

          {/* The Legend Section */}
          {product.legend_title_uk && product.legend_content_uk && (
            <section className="mb-20" aria-labelledby="legend-title">
              <div className="max-w-4xl mx-auto bg-footer-black border border-sage/20 rounded-sm p-8 md:p-12 relative overflow-hidden parchment-texture">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-oxblood/50" aria-hidden="true" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-oxblood/50" aria-hidden="true" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-oxblood/50" aria-hidden="true" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-oxblood/50" aria-hidden="true" />

                <h2 id="legend-title" className="font-rutenia text-2xl md:text-3xl text-ivory mb-6 text-center">
                  {t.product.legend}: {product.legend_title_uk}
                </h2>
                <p className="text-ivory/85 font-inter leading-relaxed text-center max-w-3xl mx-auto">
                  {product.legend_content_uk}
                </p>
              </div>
            </section>
          )}

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <section className="mb-20" aria-labelledby="specifications-title">
              <div className="max-w-4xl mx-auto">
                <h2 id="specifications-title" className="font-rutenia text-3xl text-ivory mb-8 text-center">
                  {t.product.specifications}
                </h2>
                <dl className="bg-footer-black border border-sage/20 rounded-sm divide-y divide-sage/20">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center p-4 hover:bg-deep-black/50 transition-colors">
                      <dt className="text-sage font-inter">{spec.label}</dt>
                      <dd className="text-ivory font-inter font-semibold text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section aria-labelledby="related-products-title">
              <h2 id="related-products-title" className="font-rutenia text-3xl text-ivory mb-8 text-center">
                {t.product.related}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
